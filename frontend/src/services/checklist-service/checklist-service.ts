import { ApiResponse, apiService } from '@services/api-service';
import {
  CustomTask,
  CustomTaskCreateRequest,
  DelegatedEmployeeChecklistResponse,
  EmployeeChecklist,
  EmployeeChecklistTask,
  Mentor,
  Phase,
  Task,
  Employee,
} from '@data-contracts/backend/data-contracts';
import { FieldValues } from 'react-hook-form';

export const getChecklistAsEmployee: (username: string) => Promise<EmployeeChecklist> = async (username: string) => {
  return await apiService
    .get<ApiResponse<EmployeeChecklist>>(`/employee-checklists/employee/${username}`)
    .then((res) => {
      return res.data.data;
    })
    .catch((e) => {
      return e;
    });
};

export const getChecklistsAsManager: (username: string) => Promise<EmployeeChecklist[]> = async (username: string) => {
  return apiService
    .get<ApiResponse<EmployeeChecklist[]>>(`/employee-checklists/manager/${username}`)
    .then((response) => {
      return response.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when fetching checklists as manager.');
      throw e;
    });
};

export const getDelegatedChecklists: (username: string) => Promise<DelegatedEmployeeChecklistResponse> = async (
  username: string
) => {
  return apiService
    .get<ApiResponse<DelegatedEmployeeChecklistResponse>>(`/employee-checklists/delegated-to/${username}`)
    .then((response) => {
      return response.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when fetching delegated checklists.');
      throw e;
    });
};

export const countFinishedTasks = (phases: Phase[], currentView: number) => {
  let phaseArray = [];
  phases.map((phase: Phase) => {
    let count = 0;
    phase.tasks.map((task: Task) => {
      if (task.fulfilmentStatus === 'TRUE') {
        if (currentView === 0) {
          if (task.roleType === 'MANAGER') count++;
        } else {
          if (task.roleType === 'EMPLOYEE') count++;
        }
      }
    });
    phaseArray.push(count);
  });
  return phaseArray;
};

export const updateTaskFulfilmentStatus: (
  checklistId: string,
  taskId: string,
  fulfilmentStatus: string,
  username: string
) => Promise<any> = async (checklistId: string, taskId: string, fulfilmentStatus: string, username: string) => {
  const fulfilmentStatusData = {
    fulfilmentStatus: fulfilmentStatus,
    responseText: '',
    updatedBy: username,
  };

  return apiService
    .patch<ApiResponse<EmployeeChecklistTask>>(
      `/employee-checklists/${checklistId}/tasks/${taskId}`,
      fulfilmentStatusData
    )
    .then((response) => {
      return response;
    })
    .catch((e) => {
      console.error('Something went wrong when patching fulfilment status.');
      throw e;
    });
};

export const addCustomTask: (
  checklistId: string,
  phaseId: string,
  username: string,
  taskData: FieldValues
) => Promise<any> = async (
  checklistId: string,
  phaseId: string,
  username: string,
  taskData: CustomTaskCreateRequest
) => {
  const customTaskData: CustomTaskCreateRequest = {
    heading: taskData.heading,
    text: taskData.text,
    questionType: taskData.questionType,
    sortOrder: 0,
    createdBy: username,
  };

  return apiService
    .post<ApiResponse<CustomTask>>(`/employee-checklists/${checklistId}/phases/${phaseId}/customtasks`, customTaskData)
    .then((response) => {
      return response;
    })
    .catch((e) => {
      console.error('Something went wrong when adding a custom task.');
      throw e;
    });
};

export const assignMentor: (checklistId: string, mentorData: Mentor) => Promise<any> = async (
  checklistId: string,
  mentorData: any
) => {
  return apiService
    .put<ApiResponse<EmployeeChecklist>>(`/employee-checklists/${checklistId}/mentor`, mentorData)
    .then((response) => {
      return response;
    })
    .catch((e) => {
      console.error('Something went wrong when assigning a mentor.');
      throw e;
    });
};

export const getEmployee: (username: string) => Promise<Employee> = async (username: string) => {
  return apiService
    .get<ApiResponse<Employee>>(`/portalpersondata/personal/${username}`)
    .then((response) => {
      return response.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when fetching employee.');
      throw e;
    });
};
