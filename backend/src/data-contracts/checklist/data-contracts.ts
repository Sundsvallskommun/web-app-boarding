/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Model for a phase item in the sort order structure */
export interface PhaseItem {
  /** The id for the item */
  id?: string;
  /**
   * The sort order position for the item
   * @format int32
   */
  position: number;
  /** List containing sort order for the task items connected to the phase */
  taskOrder?: TaskItem[];
}

/** Model for custom sort order request */
export interface SortorderRequest {
  /** List containing sort order for phase items */
  phaseOrder?: PhaseItem[];
}

/** Model for a task item in the sort order structure */
export interface TaskItem {
  /** The id for the item */
  id?: string;
  /**
   * The sort order position for the item
   * @format int32
   */
  position: number;
}

export interface Problem {
  /** @format uri */
  instance?: string;
  /** @format uri */
  type?: string;
  title?: string;
  detail?: string;
  /** @format int32 */
  status?: number;
}

export interface ConstraintViolationProblem {
  /** @format uri */
  type?: string;
  /** @format int32 */
  status?: number;
  violations?: Violation[];
  title?: string;
  /** @format uri */
  instance?: string;
  detail?: string;
  causeAsProblem?: ThrowableProblem;
}

export interface ThrowableProblem {
  /** @format uri */
  type?: string;
  title?: string;
  /** @format int32 */
  status?: number;
  detail?: string;
  /** @format uri */
  instance?: string;
  causeAsProblem?: any;
}

export interface Violation {
  field?: string;
  message?: string;
}

/** Model for a mentor on an employee checklist */
export interface Mentor {
  /**
   * The user-id of the mentor
   * @minLength 1
   */
  userId: string;
  /**
   * The name of the mentor
   * @minLength 1
   */
  name: string;
}

export enum Permission {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
}

/** Model for phase create request */
export interface PhaseCreateRequest {
  /**
   * The name of the phase
   * @minLength 1
   */
  name: string;
  /** The body text of the phase */
  bodyText?: string;
  /** The time to complete the phase */
  timeToComplete?: string;
  /** The permission needed to administrate the phase */
  permission: Permission;
  /**
   * The sort order of the phase
   * @format int32
   */
  sortOrder: number;
  /**
   * The id of the user creating the phase
   * @minLength 1
   */
  createdBy: string;
}

export enum CommunicationChannel {
  EMAIL = 'EMAIL',
  NO_COMMUNICATION = 'NO_COMMUNICATION',
}

/** Model for organizational unit create request */
export interface OrganizationCreateRequest {
  /**
   * The name of the unit
   * @minLength 1
   */
  organizationName: string;
  /**
   * The organization number of the unit
   * @format int32
   */
  organizationNumber: number;
  /** @uniqueItems true */
  communicationChannels?: CommunicationChannel[];
}

/** Model for custom task create request */
export interface CustomTaskCreateRequest {
  /**
   * The heading of the task
   * @minLength 1
   */
  heading: string;
  /** Optional reference to use as value for the headings anchor element */
  headingReference?: string;
  /** The body text of the task */
  text?: string;
  /** The question type of the task */
  questionType: QuestionType;
  /** The role that shall perform the task */
  roleType?: RoleType;
  /**
   * The sort order for the task
   * @format int32
   */
  sortOrder: number;
  /**
   * The id of the user creating the custom task
   * @minLength 1
   */
  createdBy: string;
}

export enum QuestionType {
  YES_OR_NO = 'YES_OR_NO',
  YES_OR_NO_WITH_TEXT = 'YES_OR_NO_WITH_TEXT',
  COMPLETED_OR_NOT_RELEVANT = 'COMPLETED_OR_NOT_RELEVANT',
  COMPLETED_OR_NOT_RELEVANT_WITH_TEXT = 'COMPLETED_OR_NOT_RELEVANT_WITH_TEXT',
}

export enum RoleType {
  NEW_EMPLOYEE = 'NEW_EMPLOYEE',
  NEW_MANAGER = 'NEW_MANAGER',
  MANAGER_FOR_NEW_EMPLOYEE = 'MANAGER_FOR_NEW_EMPLOYEE',
  MANAGER_FOR_NEW_MANAGER = 'MANAGER_FOR_NEW_MANAGER',
}

/** Model for custom task */
export interface CustomTask {
  /** The id of the task */
  id?: string;
  /** The heading of the task */
  heading?: string;
  /** Reference to use as value for the headings anchor element (if present) */
  headingReference?: string;
  /** The body text of the task */
  text?: string;
  /**
   * The sort order for the task
   * @format int32
   */
  sortOrder?: number;
  /** The role type of the task */
  roleType?: RoleType;
  /** The question type of the task */
  questionType?: QuestionType;
  /**
   * The date and time the task was created
   * @format date-time
   */
  created?: string;
  /**
   * The date and time the task was last updated
   * @format date-time
   */
  updated?: string;
  /** The id of the user that last modified the custom task */
  lastSavedBy?: string;
}

export type DefaultHttpStatusCode = HttpStatusCode;

/** Model for employee checklist triggering detailed status */
export interface Detail {
  /** Status for action of creating the employee checklist */
  status?: DefaultHttpStatusCode | HttpStatus;
  /** Descriptive text for of the creation outcome */
  information?: string;
}

/** Model for employee checklist triggering response */
export interface EmployeeChecklistResponse {
  /** Summary for execution */
  summary?: string;
  /** Details for each user specific creation */
  details?: Detail[];
}

export enum HttpStatus {
  Value100CONTINUE = '100 CONTINUE',
  Value101SWITCHINGPROTOCOLS = '101 SWITCHING_PROTOCOLS',
  Value102PROCESSING = '102 PROCESSING',
  Value103EARLYHINTS = '103 EARLY_HINTS',
  Value200OK = '200 OK',
  Value201CREATED = '201 CREATED',
  Value202ACCEPTED = '202 ACCEPTED',
  Value203NONAUTHORITATIVEINFORMATION = '203 NON_AUTHORITATIVE_INFORMATION',
  Value204NOCONTENT = '204 NO_CONTENT',
  Value205RESETCONTENT = '205 RESET_CONTENT',
  Value206PARTIALCONTENT = '206 PARTIAL_CONTENT',
  Value207MULTISTATUS = '207 MULTI_STATUS',
  Value208ALREADYREPORTED = '208 ALREADY_REPORTED',
  Value226IMUSED = '226 IM_USED',
  Value300MULTIPLECHOICES = '300 MULTIPLE_CHOICES',
  Value301MOVEDPERMANENTLY = '301 MOVED_PERMANENTLY',
  Value302FOUND = '302 FOUND',
  Value303SEEOTHER = '303 SEE_OTHER',
  Value304NOTMODIFIED = '304 NOT_MODIFIED',
  Value307TEMPORARYREDIRECT = '307 TEMPORARY_REDIRECT',
  Value308PERMANENTREDIRECT = '308 PERMANENT_REDIRECT',
  Value400BADREQUEST = '400 BAD_REQUEST',
  Value401UNAUTHORIZED = '401 UNAUTHORIZED',
  Value402PAYMENTREQUIRED = '402 PAYMENT_REQUIRED',
  Value403FORBIDDEN = '403 FORBIDDEN',
  Value404NOTFOUND = '404 NOT_FOUND',
  Value405METHODNOTALLOWED = '405 METHOD_NOT_ALLOWED',
  Value406NOTACCEPTABLE = '406 NOT_ACCEPTABLE',
  Value407PROXYAUTHENTICATIONREQUIRED = '407 PROXY_AUTHENTICATION_REQUIRED',
  Value408REQUESTTIMEOUT = '408 REQUEST_TIMEOUT',
  Value409CONFLICT = '409 CONFLICT',
  Value410GONE = '410 GONE',
  Value411LENGTHREQUIRED = '411 LENGTH_REQUIRED',
  Value412PRECONDITIONFAILED = '412 PRECONDITION_FAILED',
  Value413CONTENTTOOLARGE = '413 CONTENT_TOO_LARGE',
  Value413PAYLOADTOOLARGE = '413 PAYLOAD_TOO_LARGE',
  Value414URITOOLONG = '414 URI_TOO_LONG',
  Value415UNSUPPORTEDMEDIATYPE = '415 UNSUPPORTED_MEDIA_TYPE',
  Value416REQUESTEDRANGENOTSATISFIABLE = '416 REQUESTED_RANGE_NOT_SATISFIABLE',
  Value417EXPECTATIONFAILED = '417 EXPECTATION_FAILED',
  Value418IAMATEAPOT = '418 I_AM_A_TEAPOT',
  Value421MISDIRECTEDREQUEST = '421 MISDIRECTED_REQUEST',
  Value422UNPROCESSABLECONTENT = '422 UNPROCESSABLE_CONTENT',
  Value422UNPROCESSABLEENTITY = '422 UNPROCESSABLE_ENTITY',
  Value423LOCKED = '423 LOCKED',
  Value424FAILEDDEPENDENCY = '424 FAILED_DEPENDENCY',
  Value425TOOEARLY = '425 TOO_EARLY',
  Value426UPGRADEREQUIRED = '426 UPGRADE_REQUIRED',
  Value428PRECONDITIONREQUIRED = '428 PRECONDITION_REQUIRED',
  Value429TOOMANYREQUESTS = '429 TOO_MANY_REQUESTS',
  Value431REQUESTHEADERFIELDSTOOLARGE = '431 REQUEST_HEADER_FIELDS_TOO_LARGE',
  Value451UNAVAILABLEFORLEGALREASONS = '451 UNAVAILABLE_FOR_LEGAL_REASONS',
  Value500INTERNALSERVERERROR = '500 INTERNAL_SERVER_ERROR',
  Value501NOTIMPLEMENTED = '501 NOT_IMPLEMENTED',
  Value502BADGATEWAY = '502 BAD_GATEWAY',
  Value503SERVICEUNAVAILABLE = '503 SERVICE_UNAVAILABLE',
  Value504GATEWAYTIMEOUT = '504 GATEWAY_TIMEOUT',
  Value505HTTPVERSIONNOTSUPPORTED = '505 HTTP_VERSION_NOT_SUPPORTED',
  Value506VARIANTALSONEGOTIATES = '506 VARIANT_ALSO_NEGOTIATES',
  Value507INSUFFICIENTSTORAGE = '507 INSUFFICIENT_STORAGE',
  Value508LOOPDETECTED = '508 LOOP_DETECTED',
  Value509BANDWIDTHLIMITEXCEEDED = '509 BANDWIDTH_LIMIT_EXCEEDED',
  Value510NOTEXTENDED = '510 NOT_EXTENDED',
  Value511NETWORKAUTHENTICATIONREQUIRED = '511 NETWORK_AUTHENTICATION_REQUIRED',
}

export interface HttpStatusCode {
  error?: boolean;
  is1xxInformational?: boolean;
  is2xxSuccessful?: boolean;
  is3xxRedirection?: boolean;
  is4xxClientError?: boolean;
  is5xxServerError?: boolean;
}

/** Model for checklist create request */
export interface ChecklistCreateRequest {
  /**
   * The name of the checklist
   * @minLength 1
   */
  name: string;
  /**
   * The display name of the checklist
   * @minLength 1
   */
  displayName: string;
  /**
   * The organization that the checklist is created for
   * @format int32
   */
  organizationNumber: number;
  /**
   * The id of the user creating the checklist
   * @minLength 1
   */
  createdBy: string;
}

/** Model for task create request */
export interface TaskCreateRequest {
  /**
   * The name of the task
   * @minLength 1
   */
  heading: string;
  /** Optional reference to use as value for the headings anchor element */
  headingReference?: string;
  /** The body text of the task */
  text?: string;
  /**
   * The sort order of the task
   * @format int32
   */
  sortOrder: number;
  /** The role type of the task */
  roleType: RoleType;
  /** The permission needed to administrate the task */
  permission: Permission;
  /** The question type of the task */
  questionType: QuestionType;
  /**
   * The id of the user creating the task
   * @minLength 1
   */
  createdBy: string;
  /**
   * Indicates if the task is optional or not
   * @default false
   */
  optional?: boolean;
}

/** Model for phase update request */
export interface PhaseUpdateRequest {
  /** The name of the phase */
  name?: string;
  /** The body text of the phase */
  bodyText?: string;
  /** The time to complete the phase */
  timeToComplete?: string;
  /** The permission needed to administrate the phase */
  permission?: Permission;
  /**
   * The sort order of the phase
   * @format int32
   */
  sortOrder?: number;
  /**
   * The id of the user updating the phase
   * @minLength 1
   */
  updatedBy: string;
}

/** Model for a phase */
export interface Phase {
  /** The id of the phase */
  id?: string;
  /** The name of the phase */
  name?: string;
  /** The body text of the phase */
  bodyText?: string;
  /** The time to complete the phase */
  timeToComplete?: string;
  /** The permission needed to administrate the phase */
  permission?: Permission;
  /**
   * The sort order of the phase
   * @format int32
   */
  sortOrder?: number;
  /** Tasks in the phase */
  tasks?: Task[];
  /**
   * The created date and time of the phase
   * @format date-time
   */
  created?: string;
  /**
   * The last update date and time of the phase
   * @format date-time
   */
  updated?: string;
  /** The id of the user that last modified the phase */
  lastSavedBy?: string;
}

/** Task model */
export interface Task {
  /** The id of the task */
  id?: string;
  /** The heading of the task */
  heading?: string;
  /** Reference to use as value for the headings anchor element (if present) */
  headingReference?: string;
  /** The body text of the task */
  text?: string;
  /**
   * The sort order of the task
   * @format int32
   */
  sortOrder?: number;
  /** The role type eligible for the task */
  roleType?: RoleType;
  /** The question type of the task */
  questionType?: QuestionType;
  /** The permission needed to administrate the task */
  permission?: Permission;
  /**
   * The date and time the task was created
   * @format date-time
   */
  created?: string;
  /**
   * The date and time the task was last updated
   * @format date-time
   */
  updated?: string;
  /** The id of the user that last modified the task */
  lastSavedBy?: string;
  /** Indicates if the task is optional or not */
  optional?: boolean;
}

/** Model for organizational unit update request */
export interface OrganizationUpdateRequest {
  /** The name of the unit */
  organizationName?: string;
  /** @uniqueItems true */
  communicationChannels?: CommunicationChannel[];
}

/** Model for checklist */
export interface Checklist {
  /** The id of the checklist */
  id?: string;
  /** The name of the checklist */
  name?: string;
  /** The display name of the checklist */
  displayName?: string;
  /**
   * The version of the checklist
   * @format int32
   */
  version?: number;
  /** The lifecycle of the checklist */
  lifeCycle?: LifeCycle;
  /**
   * The created date and time of the checklist
   * @format date-time
   */
  created?: string;
  /**
   * The last update date and time of the checklist
   * @format date-time
   */
  updated?: string;
  /** The id of the user that last modified the checklist */
  lastSavedBy?: string;
  /** Phases in the checklist */
  phases?: Phase[];
}

export enum LifeCycle {
  CREATED = 'CREATED',
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
  RETIRED = 'RETIRED',
}

/** Model for an organizational unit */
export interface Organization {
  /** The id of the unit */
  id?: string;
  /** The name of the unit */
  organizationName?: string;
  /**
   * The organization number of the unit
   * @format int32
   */
  organizationNumber?: number;
  checklists?: Checklist[];
  /** @uniqueItems true */
  communicationChannels?: CommunicationChannel[];
  /**
   * The date and time the unit was created
   * @format date-time
   */
  created?: string;
  /**
   * The date and time the unit was updated
   * @format date-time
   */
  updated?: string;
}

/** Model for update request of fulfilment for a task */
export interface EmployeeChecklistTaskUpdateRequest {
  /** The status of the task fulfilment */
  fulfilmentStatus?: FulfilmentStatus;
  /** The response text for the task fulfilment */
  responseText?: string;
  /**
   * Identifier for the person that is performing the update
   * @minLength 1
   */
  updatedBy: string;
}

export enum FulfilmentStatus {
  EMPTY = 'EMPTY',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  NOT_RELEVANT = 'NOT_RELEVANT',
}

/** Model for a employee checklist task */
export interface EmployeeChecklistTask {
  /** The id of the task */
  id?: string;
  /** The heading of the task */
  heading?: string;
  /** Reference to use as value for the headings anchor element (if present) */
  headingReference?: string;
  /** The body text of the task */
  text?: string;
  /**
   * The sort order for the task
   * @format int32
   */
  sortOrder?: number;
  /** The role type of the task */
  roleType?: RoleType;
  /** The question type of the task */
  questionType?: QuestionType;
  /** Tells if the task is only applies to the current checklist or not */
  customTask?: boolean;
  /** Indicates if the task is optional or not */
  optional?: boolean;
  /** The task response text */
  responseText?: string;
  /** The status of the task fulfilment */
  fulfilmentStatus?: FulfilmentStatus;
  /**
   * The date and time the task was last updated
   * @format date-time
   */
  updated?: string;
  /** Identifier for the person that last updated the task */
  updatedBy?: string;
}

/** Model for update request on an employee checklist phase */
export interface EmployeeChecklistPhaseUpdateRequest {
  /** The value to be set on all tasks in the phase */
  tasksFulfilmentStatus?: FulfilmentStatus;
  /**
   * Identifier for the person that is performing the update
   * @minLength 1
   */
  updatedBy: string;
}

/** Model for a employee checklist phase */
export interface EmployeeChecklistPhase {
  /** The id of the phase */
  id?: string;
  /** The name of the phase */
  name?: string;
  /** The body text of the phase */
  bodyText?: string;
  /** The time to complete the phase */
  timeToComplete?: string;
  /**
   * The sort order for the phase
   * @format int32
   */
  sortOrder?: number;
  /** Tasks in the phase */
  tasks?: EmployeeChecklistTask[];
}

/** Model for custom task update request */
export interface CustomTaskUpdateRequest {
  /** The heading of the task */
  heading?: string;
  /** Optional reference to use as value for the headings anchor element */
  headingReference?: string;
  /** The body text of the task */
  text?: string;
  /** The question type of the task */
  questionType?: QuestionType;
  /** The role that shall perform the task */
  roleType?: RoleType;
  /**
   * The sort order for the task
   * @format int32
   */
  sortOrder?: number;
  /**
   * The id of the user updating the custom task
   * @minLength 1
   */
  updatedBy: string;
}

/** Model for checklist update request */
export interface ChecklistUpdateRequest {
  /** The name of the checklist */
  displayName?: string;
  /**
   * The id of the user updating the checklist
   * @minLength 1
   */
  updatedBy: string;
}

/** Model for task update request */
export interface TaskUpdateRequest {
  /** The name of the task */
  heading?: string;
  /** Optional reference to use as value for the headings anchor element */
  headingReference?: string;
  /** The body text of the task */
  text?: string;
  /**
   * The sort order of the task
   * @format int32
   */
  sortOrder?: number;
  /** The role type of the task */
  roleType?: RoleType;
  /** The permission needed to administrate the task */
  permission?: Permission;
  /** The question type of the task */
  questionType?: QuestionType;
  /**
   * The id of the user updating the task
   * @minLength 1
   */
  updatedBy: string;
  /** Indicates if the task is optional or not */
  optional?: boolean;
}

/** Model for correspondence */
export interface Correspondence {
  /** Id for message */
  messageId?: string;
  /** Message recipient */
  recipient?: string;
  /**
   * Attempt count
   * @format int32
   */
  attempts?: number;
  /** Status for correspondence */
  correspondenceStatus?: CorrespondenceStatus;
  /** Communicationschannel used for message */
  communicationChannel?: CommunicationChannel;
  /**
   * Timestamp when message was sent
   * @format date-time
   */
  sent?: string;
}

export enum CorrespondenceStatus {
  SENT = 'SENT',
  NOT_SENT = 'NOT_SENT',
  ERROR = 'ERROR',
  WILL_NOT_SEND = 'WILL_NOT_SEND',
}

/** Model for summarized information for an ongoing employee checklist */
export interface OngoingEmployeeChecklist {
  /** The employee first name and last name concatenated */
  employeeName?: string;
  /** The employee username */
  employeeUsername?: string;
  /** The employees managers first name and last name concatenated  */
  managerName?: string;
  /** The organization name */
  departmentName?: string;
  /** The names of the person(s) which have been delegated the checklist */
  delegatedTo?: string[];
  /**
   * The employment date of the employee
   * @format date
   */
  employmentDate?: string;
  /**
   * The purge date for the checklist
   * @format date
   */
  purgeDate?: string;
}

/** Paged model with summarized information for all ongoing employee checklists */
export interface OngoingEmployeeChecklists {
  checklists?: OngoingEmployeeChecklist[];
  /** PagingMetaData model */
  _meta?: PagingMetaData;
}

/** PagingMetaData model */
export interface PagingMetaData {
  /**
   * Current page
   * @format int32
   */
  page?: number;
  /**
   * Displayed objects per page
   * @format int32
   */
  limit?: number;
  /**
   * Displayed objects on current page
   * @format int32
   */
  count?: number;
  /**
   * Total amount of hits based on provided search parameters
   * @format int64
   */
  totalRecords?: number;
  /**
   * Total amount of pages based on provided search parameters
   * @format int32
   */
  totalPages?: number;
}

export enum Direction {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface OngoingEmployeeChecklistParameters {
  /**
   * Page number
   * @format int32
   * @min 1
   * @default 1
   */
  page?: number;
  /**
   * Result size per page. Maximum allowed value is dynamically configured
   * @format int32
   * @min 1
   */
  limit?: number;
  sortBy?: string[];
  /** The sort order direction */
  sortDirection?: Direction;
  employeeName?: string;
}

/** Model for a employee specific checklist */
export interface EmployeeChecklist {
  /** The id of the employee checklist */
  id?: string;
  /** The employee connected to the checklist */
  employee?: Stakeholder;
  /** The manager connected to the checklist */
  manager?: Stakeholder;
  /** Signal if all tasks in the checklist has been completed or not */
  completed?: boolean;
  /** Signal if the checklist is locked or not */
  locked?: boolean;
  /** The mentor on the checklist */
  mentor?: Mentor;
  /** Contains the email to the delegate(s) if the checklist is delegated */
  delegatedTo?: string[];
  /** Phases in the checklist */
  phases?: EmployeeChecklistPhase[];
  /**
   * The created date and time of the checklist
   * @format date-time
   */
  created?: string;
  /**
   * The last update date and time of the checklist
   * @format date-time
   */
  updated?: string;
  /**
   * The date when the fulfilment of the checklist was started
   * @format date
   */
  startDate?: string;
  /**
   * The date when the fulfilment of the checklist was finished
   * @format date
   */
  endDate?: string;
  /**
   * The expiration date of the checklist
   * @format date
   */
  expirationDate?: string;
}

/** Model for a stakeholder (employee or manager) to an employee checklist */
export interface Stakeholder {
  /** The person id for the stakeholder */
  id?: string;
  /** The first name for the stakeholder */
  firstName?: string;
  /** The last name for the stakeholder */
  lastName?: string;
  /** The email address for the stakeholder */
  email?: string;
  /** The username for the stakeholder */
  username?: string;
  /** The job title for the stakeholder (if applicable) */
  title?: string;
}

/** Model for information about the last execution to initiate employee checklists */
export interface InitiationInformation {
  /** The log id for the execution (used for investigation purpose when searching logs in ELK) */
  logId?: string;
  /** A information summary for the execution */
  summary?: string;
  /**
   * The execution date and time for the initiation
   * @format date-time
   */
  executed?: string;
  /** A list with detailed information for each employee checklist initiation */
  details?: Detail[];
}

/** Model for delegated employee checklist response */
export interface DelegatedEmployeeChecklistResponse {
  /** Delegated employee checklists */
  employeeChecklists?: EmployeeChecklist[];
}

/** Model for an event */
export interface Event {
  logKey?: string;
  eventType?: string;
  municipalityId?: string;
  message?: string;
  owner?: string;
  historyReference?: string;
  sourceType?: string;
  /** @format date-time */
  created?: string;
  /** @format date-time */
  expires?: string;
  metadata?: Metadata[];
}

/** Model for a paginated list of events */
export interface Events {
  /**
   * Current page
   * @format int32
   */
  page?: number;
  /**
   * Displayed objects per page
   * @format int32
   */
  limit?: number;
  /**
   * Displayed objects on current page
   * @format int32
   */
  count?: number;
  /**
   * Total amount of hits based on provided search parameters
   * @format int64
   */
  totalRecords?: number;
  /**
   * Total amount of pages based on provided search parameters
   * @format int32
   */
  totalPages?: number;
  eventList?: Event[];
}

/** Model for a meta data, key-value pair */
export interface Metadata {
  key?: string;
  value?: string;
}
