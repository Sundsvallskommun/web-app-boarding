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

export interface Permissions {
  canEditAdmin: boolean;
  canViewAdmin: boolean;
  isManager: boolean;
}

export interface User {
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  role: 'admin' | 'developer' | 'user';
  permissions: Permissions;
}

export interface UserApiResponse {
  data: User;
  message: string;
}

export interface Stakeholder {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  title: string;
}

export interface Mentor {
  userId: string;
  name: string;
}

export interface EmployeeChecklistPhase {
  id: string;
  name: string;
  bodyText: string;
  timeToComplete: string;
  roleType: 'NEW_EMPLOYEE' | 'NEW_MANAGER' | 'MANAGER_FOR_NEW_EMPLOYEE' | 'MANAGER_FOR_NEW_MANAGER';
  sortOrder: number;
  tasks: EmployeeChecklistTask[];
}

export interface EmployeeChecklistTask {
  id: string;
  heading: string;
  text: string;
  sortOrder: number;
  roleType: 'NEW_EMPLOYEE' | 'NEW_MANAGER' | 'MANAGER_FOR_NEW_EMPLOYEE' | 'MANAGER_FOR_NEW_MANAGER';
  questionType:
    | 'YES_OR_NO'
    | 'YES_OR_NO_WITH_TEXT'
    | 'COMPLETED_OR_NOT_RELEVANT'
    | 'COMPLETED_OR_NOT_RELEVANT_WITH_TEXT';
  customTask: boolean;
  responseText: string;
  fulfilmentStatus: 'EMPTY' | 'TRUE' | 'FALSE';
  updated: string;
  updatedBy: string;
}

export interface CustomTaskCreateRequest {
  heading: string;
  text: string;
  questionType:
    | 'YES_OR_NO'
    | 'YES_OR_NO_WITH_TEXT'
    | 'COMPLETED_OR_NOT_RELEVANT'
    | 'COMPLETED_OR_NOT_RELEVANT_WITH_TEXT';
  sortOrder: number;
  createdBy: string;
}

export interface EmployeeChecklist {
  id: string;
  employee: Stakeholder;
  manager: Stakeholder;
  completed: boolean;
  locked: boolean;
  mentor: Mentor;
  delegatedTo: string[];
  phases: EmployeeChecklistPhase[];
  created: string;
  updated: string;
  startDate: string;
  endDate: string;
  expirationDate: string;
}

export interface EmployeeChecklistApiResponse {
  data: EmployeeChecklist;
  message: string;
}

export interface OrganizationCreateRequest {
  organizationName: string;
  organizationNumber: number;
  communicationChannels: ('EMAIL' | 'NO_COMMUNICATION')[];
}

export interface CustomTask {
  id: string;
  heading: string;
  text: string;
  sortOrder: number;
  roleType: 'NEW_EMPLOYEE' | 'NEW_MANAGER' | 'MANAGER_FOR_NEW_EMPLOYEE' | 'MANAGER_FOR_NEW_MANAGER';
  questionType:
    | 'YES_OR_NO'
    | 'YES_OR_NO_WITH_TEXT'
    | 'COMPLETED_OR_NOT_RELEVANT'
    | 'COMPLETED_OR_NOT_RELEVANT_WITH_TEXT';
  created: string;
  updated: string;
  lastSavedBy: string;
}

export interface StatusType {
  statusCode: number;
  reasonPhrase: string;
}

export interface Detail {
  status: StatusType;
  information: string;
}

export interface EmployeeChecklistResponse {
  summary: string;
  details: Detail[];
}

export interface ChecklistCreateRequest {
  name: string;
  displayName: string;
  organizationNumber: number;
  roleType: 'NEW_EMPLOYEE' | 'NEW_MANAGER' | 'MANAGER_FOR_NEW_EMPLOYEE' | 'MANAGER_FOR_NEW_MANAGER';
  createdBy: string;
}

export interface PhaseCreateRequest {
  name: string;
  bodyText: string;
  timeToComplete: string;
  roleType: 'NEW_EMPLOYEE' | 'NEW_MANAGER' | 'MANAGER_FOR_NEW_EMPLOYEE' | 'MANAGER_FOR_NEW_MANAGER';
  permission: 'SUPERADMIN' | 'ADMIN';
  sortOrder: number;
  createdBy: string;
}

export interface TaskCreateRequest {
  heading: string;
  text: string;
  sortOrder: number;
  roleType: 'NEW_EMPLOYEE' | 'NEW_MANAGER' | 'MANAGER_FOR_NEW_EMPLOYEE' | 'MANAGER_FOR_NEW_MANAGER';
  permission: 'SUPERADMIN' | 'ADMIN';
  questionType:
    | 'YES_OR_NO'
    | 'YES_OR_NO_WITH_TEXT'
    | 'COMPLETED_OR_NOT_RELEVANT'
    | 'COMPLETED_OR_NOT_RELEVANT_WITH_TEXT';
  createdBy: string;
}

export interface OrganizationUpdateRequest {
  organizationName: string;
  communicationChannels: ('EMAIL' | 'NO_COMMUNICATION')[];
}

export interface Checklist {
  id: string;
  roleType: 'NEW_EMPLOYEE' | 'NEW_MANAGER' | 'MANAGER_FOR_NEW_EMPLOYEE' | 'MANAGER_FOR_NEW_MANAGER';
  name: string;
  displayName: string;
  version: number;
  lifeCycle: 'CREATED' | 'ACTIVE' | 'DEPRECATED' | 'RETIRED';
  created: string;
  updated: string;
  lastSavedBy: string;
  phases: Phase[];
}

export interface Organization {
  id: string;
  organizationName: string;
  organizationNumber: number;
  checklists: Checklist[];
  communicationChannels: ('EMAIL' | 'NO_COMMUNICATION')[];
  created: string;
  updated: string;
}

export interface Phase {
  id: string;
  name: string;
  bodyText: string;
  timeToComplete: string;
  roleType: 'NEW_EMPLOYEE' | 'NEW_MANAGER' | 'MANAGER_FOR_NEW_EMPLOYEE' | 'MANAGER_FOR_NEW_MANAGER';
  permission: 'SUPERADMIN' | 'ADMIN';
  sortOrder: number;
  tasks: Task[];
  created: string;
  updated: string;
  lastSavedBy: string;
}

export interface Task {
  id: string;
  heading: string;
  text: string;
  sortOrder: string;
  roleType: 'NEW_EMPLOYEE' | 'NEW_MANAGER' | 'MANAGER_FOR_NEW_EMPLOYEE' | 'MANAGER_FOR_NEW_MANAGER';
  questionType:
    | 'YES_OR_NO'
    | 'YES_OR_NO_WITH_TEXT'
    | 'COMPLETED_OR_NOT_RELEVANT'
    | 'COMPLETED_OR_NOT_RELEVANT_WITH_TEXT';
  permission: 'SUPERADMIN' | 'ADMIN';
  created: string;
  updated: string;
  lastSavedBy: string;
  fulfilmentStatus: 'EMPTY' | 'TRUE' | 'FALSE';
}

export interface EmployeeChecklistTaskUpdateRequest {
  fulfilmentStatus: 'EMPTY' | 'TRUE' | 'FALSE';
  responseText: string;
  updatedBy: string;
}

export interface EmployeeChecklistPhaseUpdateRequest {
  tasksFulfilmentStatus: 'EMPTY' | 'TRUE' | 'FALSE';
  updatedBy: string;
}

export interface CustomTaskUpdateRequest {
  heading: string;
  text: string;
  questionType:
    | 'YES_OR_NO'
    | 'YES_OR_NO_WITH_TEXT'
    | 'COMPLETED_OR_NOT_RELEVANT'
    | 'COMPLETED_OR_NOT_RELEVANT_WITH_TEXT';
  sortOrder: number;
  updatedBy: string;
}

export interface ChecklistUpdateRequest {
  displayName: string;
  roleType: 'NEW_EMPLOYEE' | 'NEW_MANAGER' | 'MANAGER_FOR_NEW_EMPLOYEE' | 'MANAGER_FOR_NEW_MANAGER';
  updatedBy: string;
}

export interface PhaseUpdateRequest {
  name: string;
  bodyText: string;
  timeToComplete: string;
  roleType: 'NEW_EMPLOYEE' | 'NEW_MANAGER' | 'MANAGER_FOR_NEW_EMPLOYEE' | 'MANAGER_FOR_NEW_MANAGER';
  permission: 'SUPERADMIN' | 'ADMIN';
  sortOrder: number;
  updatedBy: string;
}

export interface TaskUpdateRequest {
  heading: string;
  text: string;
  sortOrder: number;
  roleType: 'NEW_EMPLOYEE' | 'NEW_MANAGER' | 'MANAGER_FOR_NEW_EMPLOYEE' | 'MANAGER_FOR_NEW_MANAGER';
  permission: 'SUPERADMIN' | 'ADMIN';
  questionType:
    | 'YES_OR_NO'
    | 'YES_OR_NO_WITH_TEXT'
    | 'COMPLETED_OR_NOT_RELEVANT'
    | 'COMPLETED_OR_NOT_RELEVANT_WITH_TEXT';
  updatedBy: string;
}

export interface Correspondence {
  messageId: string;
  recipient: string;
  attempts: number;
  correspondenceStatus: 'SENT' | 'NOT_SENT' | 'ERROR' | 'WILL_NOT_SEND';
  communicationChannel: 'EMAIL' | 'NO_COMMUNICATION';
  sent: string;
}

export interface DelegatedEmployeeChecklistResponse {
  employeeChecklists: EmployeeChecklist[];
}

export interface Employee {
  personid: string;
  givenname: string;
  lastname: string;
  fullname: string;
  address: string;
  postalCode: string;
  city: string;
  workPhone: string;
  mobilePhone: string;
  extraMobilePhone: string;
  aboutMe: string;
  email: string;
  mailNickname: string;
  company: string;
  companyId: number;
  orgTree: string;
  referenceNumber: string;
  isManager: boolean;
  loginName: string;
}

export interface EmployeeApiResponse {
  data: Employee;
  message: string;
}

export interface Template {
  id: string;
  name: string;
  displayName: string;
  version: number;
  lifeCycle: 'CREATED' | 'ACTIVE' | 'DEPRECATED' | 'RETIRED';
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  created: string;
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  updated: string;
  lastSavedBy: string;
  phases: Phase[];
}

export interface OrgTree {
  organizationId: string;
  orgId: number;
  treeLevel: number;
  orgDisplayName?: string;
  orgName?: string;
  parentId: number;
  organizations?: OrgTree[];
}

export interface OrgTemplate {
  id: string;
  organizationName: string;
  organizationNumber: number;
  checklists: Template[];
  communicationChannels: 'EMAIL' | 'NO_COMMUNICATION';
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  created: string;
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  updated: string;
}

export interface OrgTreeApiResponse {
  data: OrgTree;
  message: string;
}

export interface OrgTemplateApiResponse {
  data: OrgTemplate;
  message: string;
}
