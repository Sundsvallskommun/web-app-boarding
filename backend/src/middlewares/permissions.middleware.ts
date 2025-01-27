import { Organization } from '@/data-contracts/checklist/data-contracts';
import { getOrganization } from '@/services/organization.service';
import { HttpException } from '@exceptions/HttpException';
import { InternalRoleMap, Permissions } from '@interfaces/users.interface';
import { getPermissions } from '@services/authorization.service';
import { logger } from '@utils/logger';
import { NextFunction, Request, Response } from 'express';

type KeyOfMap<M extends Map<unknown, unknown>> = M extends Map<infer K, unknown> ? K : never;

export const hasAllPermissions = (permissions: Array<keyof Permissions>) => async (req: Request, res: Response, next: NextFunction) => {
  const userPermissions = req.user?.permissions || [];
  if (permissions.every(permission => userPermissions[permission])) {
    next();
  } else {
    logger.error('Missing permissions');
    next(new HttpException(403, 'Missing permissions'));
  }
};

export const hasSomePermission = (permissions: Array<keyof Permissions>) => async (req: Request, res: Response, next: NextFunction) => {
  const userPermissions = req.user?.permissions || [];
  if (permissions.some(permission => userPermissions[permission])) {
    next();
  } else {
    logger.error('Missing permissions');
    next(new HttpException(403, 'Missing permissions'));
  }
};

export const hasRoles = (roles: Array<KeyOfMap<InternalRoleMap>>) => async (req: Request, res: Response, next: NextFunction) => {
  const endpointPermissions = getPermissions(roles);
  const userPermissions = getPermissions(req.user?.groups || []);
  if (Object.keys(endpointPermissions).every(permission => (endpointPermissions[permission] ? userPermissions[permission] : true))) {
    next();
  } else {
    logger.error('Missing permissions');
    next(new HttpException(403, 'Missing permissions'));
  }
};

export const hasOrgPermissions = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Middleware hasOrgPermissions');
  console.log('Req url', req.url);
  const userOrgId = req.user.organizationId;
  const params = req.params;
  console.log('Checking permissions for org', userOrgId, params);
  const { orgId } = req.params;

  const organization: Organization = await getOrganization(parseInt(orgId, 10), req.user);
  const userIsGlobalAdmin = req.user.role === 'global_admin';
  const userCanEditOrg = req.user.children.includes(orgId);
  const allowed = userIsGlobalAdmin || userCanEditOrg;

  if (allowed) {
    next();
  } else {
    logger.error('Missing permissions');
    next(new HttpException(403, 'Missing permissions'));
  }
};

export const hasOrgTemplatePermissions = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Middleware hasOrgTemplatePermissions');
  const userOrgId = req.user.organizationId;
  const params = req.params;
  console.log('Checking permissions for org template', userOrgId, params);
  const { orgId, templateId } = req.params;

  const organization: Organization = await getOrganization(parseInt(orgId, 10), req.user);
  const userIsGlobalAdmin = req.user.role === 'global_admin';
  const templateIsInOrg = organization?.checklists?.find(c => c.id === templateId);
  const userCanEditOrg = req.user.role === 'department_admin' && req.user.children.includes(orgId);
  const allowed = userIsGlobalAdmin || (templateIsInOrg && userCanEditOrg);

  if (allowed) {
    next();
  } else {
    logger.error('Missing permissions');
    next(new HttpException(403, 'Missing permissions'));
  }
};
