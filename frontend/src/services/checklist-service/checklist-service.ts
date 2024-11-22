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
      if (e.response.status === 404) {
        return [];
      } else {
        console.error('Something went wrong when fetching checklists as manager.');
        throw e;
      }
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
    if (currentView === 0) {
      count = phase.tasks.filter(
        (task: Task) =>
          task.fulfilmentStatus === 'TRUE' &&
          (task.roleType === 'MANAGER_FOR_NEW_EMPLOYEE' || task.roleType === 'MANAGER_FOR_NEW_MANAGER')
      ).length;
    } else {
      count = phase.tasks.filter(
        (task: Task) =>
          task.fulfilmentStatus === 'TRUE' && (task.roleType === 'NEW_EMPLOYEE' || task.roleType === 'NEW_MANAGER')
      ).length;
    }
    phaseArray.push(count);
  });
  return phaseArray;
};

export const updateTaskFulfilmentStatus: (
  checklistId: string,
  taskId: string,
  fulfilmentStatus: string,
  username: string
) => Promise<EmployeeChecklistTask> = async (
  checklistId: string,
  taskId: string,
  fulfilmentStatus: string,
  username: string
) => {
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
      return response.data.data;
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
) => Promise<{ status: number }> = async (
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
      return { status: response.status };
    })
    .catch((e) => {
      console.error('Something went wrong when adding a custom task.');
      throw e;
    });
};

export const delegateChecklist: (checklistId: string, email: string) => Promise<{ status: number }> = async (
  checklistId: string,
  email: string
) => {
  return apiService
    .post<{ status: number }>(`/employee-checklists/${checklistId}/delegate-to/${email}`, {})
    .then((response) => {
      return { status: response.status };
    })
    .catch((e) => {
      console.error('Something went wrong when delegating checklist.');
      throw e;
    });
};

export const removeDelegation: (checklistId: string, email: string) => Promise<{ status: number }> = async (
  checklistId: string,
  email: string
) => {
  return apiService
    .delete<{ status: number }>(`/employee-checklists/${checklistId}/delegated-to/${email}`)
    .then((response) => {
      return { status: response.status };
    })
    .catch((e) => {
      console.error('Something went wrong when removing delegation.');
      throw e;
    });
};

export const assignMentor: (checklistId: string, mentorData: Mentor) => Promise<EmployeeChecklist> = async (
  checklistId: string,
  mentorData: Mentor
) => {
  return apiService
    .put<ApiResponse<EmployeeChecklist>>(`/employee-checklists/${checklistId}/mentor`, mentorData)
    .then((response) => {
      return response.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when assigning a mentor.');
      throw e;
    });
};

export const removeMentor: (checklistId: string) => Promise<{ status: number }> = async (checklistId: string) => {
  return apiService
    .delete<{ status: number }>(`/employee-checklists/${checklistId}/mentor`)
    .then((res) => {
      return { status: res.status };
    })
    .catch((e) => {
      console.error('Something went wrong when removing mentor.');
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
