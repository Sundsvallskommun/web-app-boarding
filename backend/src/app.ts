import 'reflect-metadata';
import { existsSync, mkdirSync } from 'fs';
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import createMemoryStore from 'memorystore';
import createFileStore from 'session-file-store';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import passport from 'passport';
import { Strategy, VerifiedCallback } from '@node-saml/passport-saml';
import bodyParser from 'body-parser';
import { useExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import {
  APIS,
  APP_NAME,
  BASE_URL_PREFIX,
  CREDENTIALS,
  LOG_FORMAT,
  MUNICIPALITY_ID,
  NODE_ENV,
  ORIGIN,
  PORT,
  SAML_CALLBACK_URL,
  SAML_ENTRY_SSO,
  SAML_FAILURE_REDIRECT,
  SAML_IDP_PUBLIC_CERT,
  SAML_ISSUER,
  SAML_LOGOUT_CALLBACK_URL,
  SAML_PRIVATE_KEY,
  SAML_PUBLIC_KEY,
  SECRET_KEY,
  SESSION_MEMORY,
  SWAGGER_ENABLED,
} from '@config';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { Profile } from './interfaces/profile.interface';
import { HttpException } from './exceptions/HttpException';
import { join } from 'path';
import { isValidUrl } from './utils/util';
import { additionalConverters } from './utils/custom-validation-classes';
import { getPermissions, getRole } from './services/authorization.service';
import ApiService from './services/api.service';
import { EmployeeChecklist } from './responses/checklist.response';
import { DelegatedEmployeeChecklistResponse } from '@/data-contracts/checklist/data-contracts';
import { PortalPersonData } from './data-contracts/employee/data-contracts';
import { getOrgChildren } from './services/organization.service';
import { Organization } from './data-contracts/company/data-contracts';

const SessionStoreCreate = SESSION_MEMORY ? createMemoryStore(session) : createFileStore(session);
const sessionTTL = 4 * 24 * 60 * 60;
// NOTE: memory uses ms while file uses seconds
const sessionStore = new SessionStoreCreate(SESSION_MEMORY ? { checkPeriod: sessionTTL * 1000 } : { sessionTTL, path: './data/sessions' });

// const prisma = new PrismaClient();
const apiService = new ApiService();

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

const samlStrategy = new Strategy(
  {
    disableRequestedAuthnContext: true,
    identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
    callbackUrl: SAML_CALLBACK_URL,
    entryPoint: SAML_ENTRY_SSO,
    // decryptionPvk: SAML_PRIVATE_KEY,
    privateKey: SAML_PRIVATE_KEY,
    // Identity Provider's public key
    idpCert: SAML_IDP_PUBLIC_CERT,
    signatureAlgorithm: 'sha256',
    digestAlgorithm: 'sha256',
    issuer: SAML_ISSUER,
    wantAssertionsSigned: false,
    acceptedClockSkewMs: 1000,
    logoutCallbackUrl: SAML_LOGOUT_CALLBACK_URL,
    wantAuthnResponseSigned: false,
    audience: false,
  },
  async function (profile: Profile, done: VerifiedCallback) {
    if (!profile) {
      return done({
        name: 'SAML_MISSING_PROFILE',
        message: 'Missing SAML profile',
      });
    }

    // Depending on using Onegate or ADFS for federation the profile data looks a bit different
    // Here we use the null coalescing operator (??) to handle both cases.
    // (A switch from Onegate to ADFS was done on august 6 2023 due to problems in MobilityGuard.)
    //
    // const { givenName, sn, email, groups } = profile;
    // const givenName = profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] ?? profile['givenName'];
    const givenName = profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] ?? profile['givenname'];
    // const sn = profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] ?? profile['sn'];
    const sn = profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] ?? profile['surname'];
    const groups = profile['http://schemas.xmlsoap.org/claims/Group']?.join(',') ?? profile['groups'];
    // const username = profile['urn:oid:0.9.2342.19200300.100.1.1'];
    const username = profile['urn:oid:0.9.2342.19200300.100.1.1'] ?? profile['uid'];

    console.log('SAML profile:', profile);
    logger.info(`SAML profile: ${JSON.stringify(profile)}`);

    if (!givenName || !sn || !groups || !username) {
      logger.error(
        'Could not extract necessary profile data fields from the IDP profile. Does the Profile interface match the IDP profile response? The profile response may differ, for example Onegate vs ADFS.',
      );
      return done(null, null, {
        name: 'SAML_MISSING_ATTRIBUTES',
        message: 'Missing profile attributes',
      });
    }

    const groupList: string[] = groups !== undefined ? (groups.split(',').map(x => x.toLowerCase()) as string[]) : [];

    const appGroups: string[] = groupList.length > 0 ? groupList : [];

    const getIsManager = async () => {
      try {
        const url = `checklist/1.0/2281/employee-checklists/manager/${username}`;
        const res = await apiService.get<EmployeeChecklist[]>(
          { url },
          {
            firstName: '',
            username: username,
            name: '',
            lastName: '',
            permissions: undefined,
            role: 'user',
            organizationId: -1,
            children: [],
            email: '',
          },
        );
        if (Array.isArray(res.data) && res.data.length > 0) {
          return true;
        }

        const hasDelegated = `checklist/1.0/2281/employee-checklists/delegated-to/${username}`;
        const hasDelegatedRes = await apiService.get<DelegatedEmployeeChecklistResponse>(
          { url: hasDelegated },
          {
            firstName: '',
            username: username,
            name: '',
            lastName: '',
            permissions: undefined,
            role: 'user',
            organizationId: -1,
            children: [],
            email: '',
          },
        );

        if (Array.isArray(hasDelegatedRes.data.employeeChecklists) && hasDelegatedRes.data.employeeChecklists.length > 0) {
          return true;
        }

        return false;
      } catch {
        return false;
      }
    };

    try {
      //
      // This section assigns the user an organizationId that represents the topmost level
      // in the part of the organization tree that the user is allowed to administrate.
      //
      // The user is also assigned a list of child organizations that the user is allowed to administrate.
      // This are all children to the organizationId.
      //
      // For Sundsvalls kommun the organizationId is the level 2 organization.
      // For other companies the organizationId is the level 1 organization.
      //
      const findUser = {
        name: `${givenName} ${sn}`,
        firstName: givenName,
        lastName: sn,
        username,
        email: '',
        groups: appGroups,
        role: getRole(appGroups),
        permissions: { ...getPermissions(appGroups), isManager: await getIsManager() },
        organizationId: -1,
        children: [],
      };

      const employeeApi = APIS.find(api => api.name === 'employee');
      const url = `${employeeApi.name}/${employeeApi.version}/portalpersondata/PERSONAL/${username}`;
      const employeeRes: { data: PortalPersonData } | undefined = await apiService.get<PortalPersonData>({ url }, findUser).catch(err => {
        logger.error(`Error fetching employee data: ${err.message || err}`);
        return undefined;
      });
      logger.info(`Employee data: ${JSON.stringify(employeeRes?.data)}`);
      findUser.email = employeeRes?.data?.email ?? '';

      if (!employeeRes?.data?.companyId) {
        logger.error('Error: Employee data not found or missing companyId.');
        return done(null, findUser);
      }

      const { companyId, orgTree } = employeeRes.data;
      logger.debug(`companyId is: ${companyId}`);

      const orgTreeChunks = orgTree?.split('¤') ?? [];
      if (orgTreeChunks.length < 5) {
        logger.error('Error: User organization does not contain 5 levels');
        return done(null, findUser);
      }

      const userOrgs = orgTreeChunks.map(unit => {
        const split = unit.split('|');
        if (split.length !== 3) {
          logger.warn(`Org unit string "${unit}" is malformed.`);
          return { level: '', id: '', name: '' };
        }
        const [level, id, name] = split;
        return { level, id, name };
      });

      if (companyId === 1) {
        // User belongs to the Sundsvalls kommun organization tree,
        // so the relevant admin level for department admins is level 2
        logger.debug('User is in Sundsvalls kommun');
        const userLevelTwo = userOrgs.find(unit => unit.level === '2');
        if (!userLevelTwo) {
          logger.error('Error: Could not find user level 2 organization');
          return done(null, findUser);
        }
        findUser.organizationId = parseInt(userLevelTwo.id, 10);
      } else {
        // User is not in the Sundsvalls kommun organization tree,
        // so the relevant admin level for department admins
        // is level 1 (the company level)
        logger.debug('User is not in Sundsvalls kommun');
        const company = APIS.find(api => api.name === 'company');
        const companyUrl = `${company.name}/${company.version}/${MUNICIPALITY_ID}/${companyId}/orgnodes`;

        const companyData: { data: Organization[] } | null = await apiService.get<Organization[]>({ url: companyUrl }, findUser).catch(err => {
          logger.error(`Error fetching company data: ${err.message || err}`);
          return null;
        });

        const userLevelOne = companyData?.data?.find(org => org.treeLevel === 1)?.orgId;
        if (!userLevelOne) {
          logger.error('Error: Could not find user level 1 organization');
          return done(null, findUser);
        }

        findUser.organizationId = userLevelOne;
      }

      // Assign the list of children of the determined organizationId
      const children = await getOrgChildren(findUser.organizationId, findUser).catch(err => {
        logger.error(`Error fetching child organizations: ${err.message || err}`);
        return [] as number[];
      });
      findUser.children = children;

      logger.info(`Constructed user: ${JSON.stringify(findUser)}`);
      return done(null, findUser);
    } catch (err) {
      if (err instanceof HttpException && err.status === 404) {
        logger.warn('User not found in external service: 404');
        return done(null, {});
      }
      return done(err);
    }
  },
  async function (profile: Profile, done: VerifiedCallback) {
    return done(null, {});
  },
);

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public swaggerEnabled: boolean;

  constructor(Controllers: Function[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;
    this.swaggerEnabled = SWAGGER_ENABLED || false;

    this.initializeDataFolders();

    this.initializeMiddlewares();
    this.initializeRoutes(Controllers);
    if (this.swaggerEnabled) {
      this.initializeSwagger(Controllers);
    }
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    this.app.use(
      session({
        secret: SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
      }),
    );

    this.app.use(passport.initialize());
    this.app.use(passport.session());
    passport.use('saml', samlStrategy);

    this.app.get(
      `${BASE_URL_PREFIX}/saml/login`,
      (req, res, next) => {
        if (req.session.returnTo) {
          req.query.RelayState = req.session.returnTo;
        } else if (req.query.successRedirect) {
          req.query.RelayState = req.query.successRedirect;
        }
        next();
      },
      (req, res, next) => {
        passport.authenticate('saml', {
          failureRedirect: SAML_FAILURE_REDIRECT,
        })(req, res, next);
      },
    );

    this.app.get(`${BASE_URL_PREFIX}/saml/metadata`, (req, res) => {
      res.type('application/xml');
      const metadata = samlStrategy.generateServiceProviderMetadata(SAML_PUBLIC_KEY, SAML_PUBLIC_KEY);
      res.status(200).send(metadata);
    });

    this.app.get(
      `${BASE_URL_PREFIX}/saml/logout`,
      (req, res, next) => {
        if (req.session.returnTo) {
          req.query.RelayState = req.session.returnTo;
        } else if (req.query.successRedirect) {
          req.query.RelayState = req.query.successRedirect;
        }
        next();
      },
      (req, res, next) => {
        const successRedirect = req.query.successRedirect;
        samlStrategy.logout(req as any, () => {
          req.logout(err => {
            if (err) {
              return next(err);
            }
            res.redirect(successRedirect as string);
          });
        });
      },
    );

    this.app.get(`${BASE_URL_PREFIX}/saml/logout/callback`, bodyParser.urlencoded({ extended: false }), (req, res, next) => {
      req.logout(err => {
        if (err) {
          return next(err);
        }

        let successRedirect, failureRedirect;
        if (isValidUrl(req.body.RelayState)) {
          successRedirect = req.body.RelayState;
        }

        if (req.session.messages?.length > 0) {
          failureRedirect = successRedirect + `?failMessage=${req.session.messages[0]}`;
        } else {
          failureRedirect = successRedirect + `?failMessage='SAML_UNKNOWN_ERROR'`;
        }
        if (failureRedirect) {
          res.redirect(failureRedirect);
        } else {
          res.redirect(successRedirect);
        }
      });
    });

    this.app.post(`${BASE_URL_PREFIX}/saml/login/callback`, bodyParser.urlencoded({ extended: false }), (req, res, next) => {
      let successRedirect, failureRedirect;
      if (isValidUrl(req.body.RelayState)) {
        successRedirect = req.body.RelayState;
      }

      if (req.session.messages?.length > 0) {
        failureRedirect = successRedirect + `?failMessage=${req.session.messages[0]}`;
      } else {
        failureRedirect = successRedirect + `?failMessage='SAML_UNKNOWN_ERROR'`;
      }

      passport.authenticate('saml', {
        successReturnToOrRedirect: successRedirect,
        failureRedirect: failureRedirect,
        failureMessage: true,
      })(req, res, next);
    });
  }

  private initializeRoutes(controllers: Function[]) {
    useExpressServer(this.app, {
      routePrefix: BASE_URL_PREFIX,
      cors: {
        origin: ORIGIN,
        credentials: CREDENTIALS,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      },
      controllers: controllers,
      defaultErrorHandler: false,
    });
  }

  private initializeSwagger(controllers: Function[]) {
    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
      additionalConverters: additionalConverters,
    });

    const routingControllersOptions = {
      routePrefix: `${BASE_URL_PREFIX}`,
      controllers: controllers,
    };

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: {
        schemas: schemas as { [schema: string]: unknown },
        securitySchemes: {
          basicAuth: {
            scheme: 'basic',
            type: 'http',
          },
        },
      },
      info: {
        title: `${APP_NAME} Proxy API`,
        description: '',
        version: '1.0.0',
      },
    });

    this.app.use(`${BASE_URL_PREFIX}/swagger.json`, (req, res) => res.json(spec));
    this.app.use(`${BASE_URL_PREFIX}/api-docs`, swaggerUi.serve, swaggerUi.setup(spec));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeDataFolders() {
    const databaseDir: string = join(__dirname, '../data/database');
    if (!existsSync(databaseDir)) {
      mkdirSync(databaseDir, { recursive: true });
    }
    const logsDir: string = join(__dirname, '../data/logs');
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }
    const sessionsDir: string = join(__dirname, '../data/sessions');
    if (!existsSync(sessionsDir)) {
      mkdirSync(sessionsDir, { recursive: true });
    }
  }
}

export default App;
