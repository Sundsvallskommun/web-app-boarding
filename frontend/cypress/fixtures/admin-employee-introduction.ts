export const adminemployeeIntroduction = {
  data: {
    id: 'bbbbbbbb-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    employee: {
      id: 'aaaaajaa-aaaa-aaaa-aaaa-aaaaaaaahaaa',
      firstName: 'Manne',
      lastName: 'Mansson',
      email: 'new.employee.one@noreply.com',
      username: 'man01man',
      title: 'Skoladministratör',
    },
    manager: {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaahaaaaaaaa',
      firstName: 'Anna',
      lastName: 'Chef',
      email: 'anna.chef@noreply.com',
      username: 'ann01che',
      title: 'Chef',
    },
    completed: false,
    locked: false,
    mentor: {
      userId: 'anv01anv',
      name: 'Användare Användarsson',
    },
    delegatedTo: ['anv01anv@example.com'],
    phases: [
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaajaaaaa',
        name: 'Om din anställning',
        bodyText: '',
        timeToComplete: 'P6M',
        sortOrder: 9,
        tasks: [
          {
            id: 'aaaajaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            heading: 'Om din anställning, Aktivitet 1',
            text: '',
            sortOrder: 1,
            roleType: 'NEW_EMPLOYEE',
            questionType: 'COMPLETED_OR_NOT_RELEVANT',
            customTask: false,
            responseText: '',
            fulfilmentStatus: 'FALSE',
            updated: '2024-12-11T09:44:49.552502+01:00',
            updatedBy: 'ann01che',
          },
          {
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaajjaaaaa',
            heading: 'Om din anställning, Aktivitet 2',
            text: '',
            sortOrder: 2,
            roleType: 'NEW_EMPLOYEE',
            questionType: 'COMPLETED_OR_NOT_RELEVANT',
            customTask: false,
            responseText: '',
            fulfilmentStatus: 'FALSE',
            updated: '2024-12-11T09:52:24.700574+01:00',
            updatedBy: 'ann01che',
          },
          {
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaagajjaaaaa',
            heading: 'Om din anställning, Egen aktivitet',
            headingReference: 'https://www.google.com',
            text: 'Egen aktivitet',
            sortOrder: 2,
            roleType: 'NEW_EMPLOYEE',
            questionType: 'COMPLETED_OR_NOT_RELEVANT',
            customTask: true,
            responseText: '',
            fulfilmentStatus: 'FALSE',
            updated: '2024-12-11T09:52:24.700574+01:00',
            updatedBy: 'ann01che',
          },
        ],
      },
    ],
    created: '2024-11-21T13:43:10.502212+01:00',
    updated: '2024-12-12T08:55:50.237902+01:00',
    startDate: '2024-12-14',
    endDate: '2026-12-14',
    expirationDate: '2027-03-14',
  },
  status: 200,
  message: 'success',
};

export const employeeIntroductionWithoutMentor = {
  data: {
    id: 'bbbbbbbb-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    employee: {
      id: 'aaaaajaa-aaaa-aaaa-aaaa-aaaaaaaahaaa',
      firstName: 'Manne',
      lastName: 'Mansson',
      email: 'new.employee.one@noreply.com',
      username: 'man01man',
      title: 'Skoladministratör',
    },
    manager: {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaahaaaaaaaa',
      firstName: 'Anna',
      lastName: 'Chef',
      email: 'anna.chef@noreply.com',
      username: 'ann01che',
      title: 'Chef',
    },
    completed: false,
    locked: false,
    delegatedTo: ['anv01anv@example.com'],
    phases: [
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaajaaaaa',
        name: 'Om din anställning',
        bodyText: '',
        timeToComplete: 'P6M',
        sortOrder: 9,
        tasks: [
          {
            id: 'aaaajaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            heading: 'Om din anställning, Aktivitet 1',
            text: '',
            sortOrder: 1,
            roleType: 'NEW_EMPLOYEE',
            questionType: 'COMPLETED_OR_NOT_RELEVANT',
            customTask: false,
            responseText: '',
            fulfilmentStatus: 'FALSE',
            updated: '2024-12-11T09:44:49.552502+01:00',
            updatedBy: 'ann01che',
          },
          {
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaajjaaaaa',
            heading: 'Om din anställning, Aktivitet 2',
            text: '',
            sortOrder: 2,
            roleType: 'NEW_EMPLOYEE',
            questionType: 'COMPLETED_OR_NOT_RELEVANT',
            customTask: false,
            responseText: '',
            fulfilmentStatus: 'FALSE',
            updated: '2024-12-11T09:52:24.700574+01:00',
            updatedBy: 'ann01che',
          },
        ],
      },
    ],
    created: '2024-11-21T13:43:10.502212+01:00',
    updated: '2024-12-12T08:55:50.237902+01:00',
    startDate: '2024-12-14',
    endDate: '2026-12-14',
    expirationDate: '2027-03-14',
  },
  status: 200,
  message: 'success',
};

export const addCustomTaskResponse = {
  id: 'aaaadddd-aaaa-aaaa-aaaa-ssssssssssss',
  heading: 'Ny aktivitet',
  headingReference: '',
  text: 'Beskrivning av ny aktivitet',
  sortOrder: 0,
  roleType: 'NEW_EMPLOYEE',
  created: '2024-11-22T12:30:00Z',
  updated: '2024-11-22T12:30:00Z',
  lastSavedBy: 'ann01che',
};

export const editCustomTaskResponse = {
  id: 'aaaadddd-aaaa-aaaa-aaaa-ssssssssssss',
  heading: 'Redigerad aktivitet',
  headingReference: '',
  text: 'Redigerad aktivitet',
  sortOrder: 0,
  roleType: 'NEW_EMPLOYEE',
  created: '2024-11-22T12:30:00Z',
  updated: '2024-11-22T12:30:00Z',
  lastSavedBy: 'ann01che',
};

export const removeDelegationResponse = {
  status: 204,
};

export const assignMentorResponse = {
  status: 202,
};

export const removeAssignedMentorResponse = {
  status: 204,
};

export const removeCustomTaskResponse = {
  status: 204,
};
