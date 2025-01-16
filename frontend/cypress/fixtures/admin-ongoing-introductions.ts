export const adminOngoingIntroductions = {
  data: {
    checklists: [
      {
        employeeName: 'Employee One',
        employeeUsername: 'man00man',
        managerName: 'Man Manager',
        departmentName: 'Department One',
        delegatedTo: [],
        employmentDate: '2021-12-10',
        purgeDate: '2026-12-14',
      },
      {
        employeeName: 'Employee Two',
        employeeUsername: 'man00man',
        managerName: 'Man Manager',
        departmentName: 'Department One',
        delegatedTo: [],
        employmentDate: '2021-12-14',
        purgeDate: '2025-06-10',
      },
      {
        employeeName: 'Employee Three',
        employeeUsername: 'man00man',
        managerName: 'Man Manager',
        departmentName: 'Department One',
        delegatedTo: [],
        employmentDate: '2021-12-10',
        purgeDate: '2026-12-14',
      },
    ],
    _meta: {
      page: 0,
      limit: 15,
      count: 3,
      totalRecords: 3,
      totalPages: 1,
    },
  },
  status: 200,
  message: 'success',
};

export const adminOngoingIntroductionsSearchResponse = {
  data: {
    checklists: [
      {
        employeeName: 'Employee Two',
        employeeUsername: 'man00man',
        managerName: 'Man Manager',
        departmentName: 'Department One',
        delegatedTo: [],
        employmentDate: '2021-12-14',
        purgeDate: '2025-06-10',
      },
    ],
    _meta: {
      page: 0,
      limit: 15,
      count: 1,
      totalRecords: 1,
      totalPages: 1,
    },
  },
  status: 200,
  message: 'success',
};
