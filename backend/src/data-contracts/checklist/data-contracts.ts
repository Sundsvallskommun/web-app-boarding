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

/** Model for a mentor on an employee checklist */
export interface Mentor {
  /** The user-id of the mentor */
  userId: string;
  /** The name of the mentor */
  name: string;
}

export interface Problem {
  title?: string;
  detail?: string;
  /** @format uri */
  instance?: string;
  /** @format uri */
  type?: string;
  parameters?: Record<string, object>;
  status?: StatusType;
}

export interface StatusType {
  /** @format int32 */
  statusCode?: number;
  reasonPhrase?: string;
}

export interface ConstraintViolationProblem {
  cause?: ThrowableProblem;
  stackTrace?: {
    classLoaderName?: string;
    moduleName?: string;
    moduleVersion?: string;
    methodName?: string;
    fileName?: string;
    /** @format int32 */
    lineNumber?: number;
    className?: string;
    nativeMethod?: boolean;
  }[];
  /** @format uri */
  type?: string;
  status?: StatusType;
  violations?: Violation[];
  title?: string;
  message?: string;
  detail?: string;
  /** @format uri */
  instance?: string;
  parameters?: Record<string, object>;
  suppressed?: {
    stackTrace?: {
      classLoaderName?: string;
      moduleName?: string;
      moduleVersion?: string;
      methodName?: string;
      fileName?: string;
      /** @format int32 */
      lineNumber?: number;
      className?: string;
      nativeMethod?: boolean;
    }[];
    message?: string;
    localizedMessage?: string;
  }[];
  localizedMessage?: string;
}

export interface ThrowableProblem {
  cause?: ThrowableProblem;
  stackTrace?: {
    classLoaderName?: string;
    moduleName?: string;
    moduleVersion?: string;
    methodName?: string;
    fileName?: string;
    /** @format int32 */
    lineNumber?: number;
    className?: string;
    nativeMethod?: boolean;
  }[];
  message?: string;
  title?: string;
  detail?: string;
  /** @format uri */
  instance?: string;
  /** @format uri */
  type?: string;
  parameters?: Record<string, object>;
  status?: StatusType;
  suppressed?: {
    stackTrace?: {
      classLoaderName?: string;
      moduleName?: string;
      moduleVersion?: string;
      methodName?: string;
      fileName?: string;
      /** @format int32 */
      lineNumber?: number;
      className?: string;
      nativeMethod?: boolean;
    }[];
    message?: string;
    localizedMessage?: string;
  }[];
  localizedMessage?: string;
}

export interface Violation {
  field?: string;
  message?: string;
}

/** Model for a employee specific checklist */
export interface EmployeeChecklist {
  /**
   * The id of the employee checklist
   * @example "5a6c3e4e-c320-4006-b448-1fd4121df828"
   */
  id?: string;
  /** Model for a stakeholder (employee or manager) to an employee checklist */
  employee?: Stakeholder;
  /** Model for a stakeholder (employee or manager) to an employee checklist */
  manager?: Stakeholder;
  /** Signal if all tasks in the checklist has been completed or not */
  completed?: boolean;
  /** Signal if the checklist is locked or not */
  locked?: boolean;
  /** Model for a mentor on an employee checklist */
  mentor?: Mentor;
  /** Contains the email to the delegate(s) if the checklist is delegated */
  delegatedTo?: string[];
  /** Phases in the checklist */
  phases?: EmployeeChecklistPhase[];
  /**
   * The created date and time of the checklist
   * @format date-time
   * @example "2023-11-22T15:30:00+03:00"
   */
  created?: string;
  /**
   * The last update date and time of the checklist
   * @format date-time
   * @example "2023-11-22T15:30:00+03:00"
   */
  updated?: string;
  /**
   * The date when the fulfilment of the checklist was started
   * @format date
   * @example "2023-11-22"
   */
  startDate?: string;
  /**
   * The date when the fulfilment of the checklist was finished
   * @format date
   * @example "2023-11-22"
   */
  endDate?: string;
  /**
   * The expiration date of the checklist
   * @format date
   * @example "2023-11-22"
   */
  expirationDate?: string;
}

/** Model for a employee checklist phase */
export interface EmployeeChecklistPhase {
  /**
   * The id of the phase
   * @example "5a6c3e4e-c320-4006-b448-1fd4121df828"
   */
  id?: string;
  /**
   * The name of the phase
   * @example "Första veckan"
   */
  name?: string;
  /**
   * The body text of the phase
   * @example "Detta är en beskrivning av vad som ska göras under första veckan"
   */
  bodyText?: string;
  /**
   * The time to complete the phase
   * @example "P1M"
   */
  timeToComplete?: string;
  /**
   * The sort order for the phase
   * @format int32
   * @example 1
   */
  sortOrder?: number;
  /** Tasks in the phase */
  tasks?: EmployeeChecklistTask[];
}

/** Model for a employee checklist task */
export interface EmployeeChecklistTask {
  /**
   * The id of the task
   * @example "5a6c3e4e-c320-4006-b448-1fd4121df828"
   */
  id?: string;
  /**
   * The heading of the task
   * @example "Bjud på fika"
   */
  heading?: string;
  /**
   * The body text of the task
   * @example "Detta är en beskrivning av ett uppdrag"
   */
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
  /**
   * The task response text
   * @example "Jag har bjudit på fika"
   */
  responseText?: string;
  /** The status of the task fulfilment */
  fulfilmentStatus?: FulfilmentStatus;
  /**
   * The date and time the task was last updated
   * @format date-time
   * @example "2023-11-22T15:30:00+03:00"
   */
  updated?: string;
  /**
   * Identifier for the person that last updated the task
   * @example "joe01doe"
   */
  updatedBy?: string;
}

/**
 * The status of the task fulfilment
 * @example "TRUE"
 */
export enum FulfilmentStatus {
  EMPTY = 'EMPTY',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
}

/** The question type of the task */
export enum QuestionType {
  YES_OR_NO = 'YES_OR_NO',
  YES_OR_NO_WITH_TEXT = 'YES_OR_NO_WITH_TEXT',
  COMPLETED_OR_NOT_RELEVANT = 'COMPLETED_OR_NOT_RELEVANT',
  COMPLETED_OR_NOT_RELEVANT_WITH_TEXT = 'COMPLETED_OR_NOT_RELEVANT_WITH_TEXT',
}

/** The role type of the task */
export enum RoleType {
  NEW_EMPLOYEE = 'NEW_EMPLOYEE',
  NEW_MANAGER = 'NEW_MANAGER',
  MANAGER_FOR_NEW_EMPLOYEE = 'MANAGER_FOR_NEW_EMPLOYEE',
  MANAGER_FOR_NEW_MANAGER = 'MANAGER_FOR_NEW_MANAGER',
}

/** Model for a stakeholder (employee or manager) to an employee checklist */
export interface Stakeholder {
  /**
   * The person id for the stakeholder
   * @example "5a6c3e4e-c320-4006-b448-1fd4121df828"
   */
  id?: string;
  /**
   * The first name for the stakeholder
   * @example "John"
   */
  firstName?: string;
  /**
   * The last name for the stakeholder
   * @example "Doe"
   */
  lastName?: string;
  /**
   * The email address for the stakeholder
   * @example "email.address@noreply.com"
   */
  email?: string;
  /**
   * The username for the stakeholder
   * @example "abc12def"
   */
  username?: string;
}

/** The permission needed to administrate the phase */
export enum Permission {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
}

/** Model for phase create request */
export interface PhaseCreateRequest {
  /**
   * The name of the phase
   * @example "Första veckan"
   */
  name: string;
  /**
   * The body text of the phase
   * @example "Detta är en beskrivning av vad som ska göras under första veckan"
   */
  bodyText?: string;
  /**
   * The time to complete the phase
   * @example "P1M"
   */
  timeToComplete?: string;
  /** The permission needed to administrate the phase */
  permission: Permission;
  /**
   * The sort order of the phase
   * @format int32
   * @example 1
   */
  sortOrder: number;
  /** The id of the user creating the phase */
  createdBy: string;
}

/** Valid channels to use when communicating with the organization */
export enum CommunicationChannel {
  EMAIL = 'EMAIL',
  NO_COMMUNICATION = 'NO_COMMUNICATION',
}

/** Model for organizational unit create request */
export interface OrganizationCreateRequest {
  /**
   * The name of the unit
   * @example "Sundsvall Energi"
   */
  organizationName: string;
  /**
   * The organization number of the unit
   * @format int32
   * @example 5345
   */
  organizationNumber: number;
  /** @uniqueItems true */
  communicationChannels?: CommunicationChannel[];
}

/** Model for custom task create request */
export interface CustomTaskCreateRequest {
  /**
   * The heading of the task
   * @example "Bjud på fika"
   */
  heading: string;
  /**
   * The body text of the task
   * @example "Detta är en beskrivning av ett uppdrag"
   */
  text?: string;
  /** The question type of the task */
  questionType: QuestionType;
  /**
   * The sort order for the task
   * @format int32
   */
  sortOrder: number;
  /** The id of the user creating the custom task */
  createdBy: string;
}

/** Model for custom task */
export interface CustomTask {
  /**
   * The id of the task
   * @example "5a6c3e4e-c320-4006-b448-1fd4121df828"
   */
  id?: string;
  /**
   * The heading of the task
   * @example "Bjud på fika"
   */
  heading?: string;
  /**
   * The body text of the task
   * @example "Detta är en beskrivning av ett uppdrag"
   */
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
   * @example "2023-11-22T15:30:00+03:00"
   */
  created?: string;
  /**
   * The date and time the task was last updated
   * @format date-time
   * @example "2023-11-22T15:30:00+03:00"
   */
  updated?: string;
  /** The id of the user that last modified the custom task */
  lastSavedBy?: string;
}

/** Model for employee checklist triggering detailed status */
export interface Detail {
  status?: StatusType;
  /**
   * Descriptive text for of the creation outcome
   * @example "Employee with loginname abc123 processed successfully."
   */
  information?: string;
}

/** Model for employee checklist triggering response */
export interface EmployeeChecklistResponse {
  /**
   * Summary for execution
   * @example "Successful execution"
   */
  summary?: string;
  /** Details for each user specific creation */
  details?: Detail[];
}

/** Model for checklist create request */
export interface ChecklistCreateRequest {
  /**
   * The name of the checklist
   * @example "Checklist_A"
   */
  name: string;
  /**
   * The display name of the checklist
   * @example "Display name"
   */
  displayName: string;
  /**
   * The organization that the checklist is created for
   * @format int32
   * @example 11
   */
  organizationNumber: number;
  /** The id of the user creating the checklist */
  createdBy: string;
}

/** Model for task create request */
export interface TaskCreateRequest {
  /**
   * The name of the task
   * @example "Name of the task"
   */
  heading: string;
  /**
   * The body text of the task
   * @example "Body text of the task"
   */
  text?: string;
  /**
   * The sort order of the task
   * @format int32
   * @example 1
   */
  sortOrder: number;
  /** The role type of the task */
  roleType: RoleType;
  /** The permission needed to administrate the phase */
  permission: Permission;
  /** The question type of the task */
  questionType: QuestionType;
  /** The id of the user creating the task */
  createdBy: string;
}

/** Model for phase update request */
export interface PhaseUpdateRequest {
  /**
   * The name of the phase
   * @example "Första veckan"
   */
  name?: string;
  /**
   * The body text of the phase
   * @example "Detta är en beskrivning av vad som ska göras under första veckan"
   */
  bodyText?: string;
  /**
   * The time to complete the phase
   * @example "P1M"
   */
  timeToComplete?: string;
  /** The permission needed to administrate the phase */
  permission?: Permission;
  /**
   * The sort order of the phase
   * @format int32
   * @example 1
   */
  sortOrder?: number;
  /** The id of the user updating the phase */
  updatedBy: string;
}

/** Model for a phase */
export interface Phase {
  /**
   * The id of the phase
   * @example "5a6c3e4e-c320-4006-b448-1fd4121df828"
   */
  id?: string;
  /**
   * The name of the phase
   * @example "Första veckan"
   */
  name?: string;
  /**
   * The body text of the phase
   * @example "Detta är en beskrivning av vad som ska göras under första veckan"
   */
  bodyText?: string;
  /**
   * The time to complete the phase
   * @example "P1M"
   */
  timeToComplete?: string;
  /** The permission needed to administrate the phase */
  permission?: Permission;
  /**
   * The sort order of the phase
   * @format int32
   * @example 1
   */
  sortOrder?: number;
  /** Tasks in the phase */
  tasks?: Task[];
  /**
   * The created date and time of the phase
   * @format date-time
   * @example "2023-11-22T15:30:00+03:00"
   */
  created?: string;
  /**
   * The last update date and time of the phase
   * @format date-time
   * @example "2023-11-22T15:30:00+03:00"
   */
  updated?: string;
  /** The id of the user that last modified the phase */
  lastSavedBy?: string;
}

/** Task model */
export interface Task {
  /**
   * The id of the task
   * @example "5a6c3e4e-c320-4006-b448-1fd4121df828"
   */
  id?: string;
  /**
   * The heading of the task
   * @example "Bjud på fika"
   */
  heading?: string;
  /**
   * The body text of the task
   * @example "Detta är en beskrivning av ett uppdrag"
   */
  text?: string;
  /**
   * The sort order of the task
   * @format int32
   * @example 1
   */
  sortOrder?: number;
  /** The role type of the task */
  roleType?: RoleType;
  /** The question type of the task */
  questionType?: QuestionType;
  /** The permission needed to administrate the phase */
  permission?: Permission;
  /**
   * The date and time the task was created
   * @format date-time
   * @example "2023-11-22T15:30:00+03:00"
   */
  created?: string;
  /**
   * The date and time the task was last updated
   * @format date-time
   * @example "2023-11-22T15:30:00+03:00"
   */
  updated?: string;
  /** The id of the user that last modified the task */
  lastSavedBy?: string;
}

/** Model for organizational unit update request */
export interface OrganizationUpdateRequest {
  /**
   * The name of the unit
   * @example "Sundsvall Energi"
   */
  organizationName?: string | null;
  /** @uniqueItems true */
  communicationChannels?: CommunicationChannel[];
}

/** Model for checklist */
export interface Checklist {
  /**
   * The id of the checklist
   * @example "5a6c3e4e-c320-4006-b448-1fd4121df828"
   */
  id?: string;
  /**
   * The name of the checklist
   * @example "Checklist_A"
   */
  name?: string;
  /**
   * The display name of the checklist
   * @example "Display name"
   */
  displayName?: string;
  /**
   * The version of the checklist
   * @format int32
   * @example 1
   */
  version?: number;
  /** The lifecycle of the checklist */
  lifeCycle?: LifeCycle;
  /**
   * The created date and time of the checklist
   * @format date-time
   * @example "2023-11-22T15:30:00+03:00"
   */
  created?: string;
  /**
   * The last update date and time of the checklist
   * @format date-time
   * @example "2023-11-22T15:30:00+03:00"
   */
  updated?: string;
  /** The id of the user that last modified the checklist */
  lastSavedBy?: string;
  /** Phases in the checklist */
  phases?: Phase[];
}

/** The lifecycle of the checklist */
export enum LifeCycle {
  CREATED = 'CREATED',
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
  RETIRED = 'RETIRED',
}

/** Model for an organizational unit */
export interface Organization {
  /**
   * The id of the unit
   * @example "5a6c3e4e-c320-4006-b448-1fd4121df828"
   */
  id?: string;
  /**
   * The name of the unit
   * @example "Sundsvall Energi"
   */
  organizationName?: string;
  /**
   * The organization number of the unit
   * @format int32
   * @example 5345
   */
  organizationNumber?: number;
  checklists?: Checklist[];
  /** @uniqueItems true */
  communicationChannels?: CommunicationChannel[];
  /**
   * The date and time the unit was created
   * @format date-time
   * @example "2023-11-22T15:30:00+02:00"
   */
  created?: string;
  /**
   * The date and time the unit was updated
   * @format date-time
   * @example "2023-11-22T15:30:00+02:00"
   */
  updated?: string;
}

/** Model for update request of fulfilment for a task */
export interface EmployeeChecklistTaskUpdateRequest {
  /** The status of the task fulfilment */
  fulfilmentStatus?: FulfilmentStatus;
  /**
   * The response text for the task fulfilment
   * @example "Har bjudit på fika"
   */
  responseText?: string | null;
  /**
   * Identifier for the person that is performing the update
   * @example "joe01doe"
   */
  updatedBy: string;
}

/** Model for update request on an employee checklist phase */
export interface EmployeeChecklistPhaseUpdateRequest {
  /** The status of the task fulfilment */
  tasksFulfilmentStatus?: FulfilmentStatus;
  /**
   * Identifier for the person that is performing the update
   * @example "joe01doe"
   */
  updatedBy: string;
}

/** Model for custom task update request */
export interface CustomTaskUpdateRequest {
  /**
   * The heading of the task
   * @example "Bjud på fika"
   */
  heading?: string;
  /**
   * The body text of the task
   * @example "Detta är en beskrivning av ett uppdrag"
   */
  text?: string;
  /** The question type of the task */
  questionType?: QuestionType;
  /**
   * The sort order for the task
   * @format int32
   */
  sortOrder?: number;
  /** The id of the user updating the custom task */
  updatedBy: string;
}

/** Model for checklist update request */
export interface ChecklistUpdateRequest {
  /**
   * The name of the checklist
   * @example "New display name"
   */
  displayName?: string;
  /** The id of the user updating the checklist */
  updatedBy: string;
}

/** Model for task update request */
export interface TaskUpdateRequest {
  /** The name of the task */
  heading?: string;
  /** The body text of the task */
  text?: string;
  /**
   * The sort order of the task
   * @format int32
   * @example 1
   */
  sortOrder?: number;
  /** The role type of the task */
  roleType?: RoleType;
  /** The permission needed to administrate the phase */
  permission?: Permission;
  /** The question type of the task */
  questionType?: QuestionType;
  /** The id of the user updating the task */
  updatedBy: string;
}

/** Model for correspondence */
export interface Correspondence {
  /**
   * Id for message
   * @example "3fa85f64-5717-4562-b3fc-2c963f66afa6"
   */
  messageId?: string;
  /**
   * Message recipient
   * @example "email.address@noreply.com"
   */
  recipient?: string;
  /**
   * Attempt count
   * @format int32
   * @example 1
   */
  attempts?: number;
  /** Status for correspondence */
  correspondenceStatus?: CorrespondenceStatus;
  /** Valid channels to use when communicating with the organization */
  communicationChannel?: CommunicationChannel;
  /**
   * Timestamp when message was sent
   * @format date-time
   * @example "2023-11-22T15:30:00+02:00"
   */
  sent?: string;
}

/** Status for correspondence */
export enum CorrespondenceStatus {
  SENT = 'SENT',
  NOT_SENT = 'NOT_SENT',
  ERROR = 'ERROR',
  WILL_NOT_SEND = 'WILL_NOT_SEND',
}

/** Model for delegated employee checklist response */
export interface DelegatedEmployeeChecklistResponse {
  /** Delegated employee checklists */
  employeeChecklists?: EmployeeChecklist[];
}
