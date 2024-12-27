export const managedIntroductions = {
  data: [
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaiaa',
      employee: {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-iaaaaaaaaaaa',
        firstName: 'Manne',
        lastName: 'New Manager',
        email: 'new.manager@noreply.com',
        username: 'man01man',
        title: 'Chef över adminstratörer',
      },
      manager: {
        id: 'aaaaaaaa-aaaa-aaai-aaaa-aaaaaaaaaaaa',
        firstName: 'Anna',
        lastName: 'Chef',
        email: 'anna.chef@noreply.com',
        username: 'ann01che',
      },
      completed: false,
      locked: false,
      mentor: {},
      delegatedTo: [],
      phases: [
        {
          id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaiaaaaaaa',
          name: 'Inför första arbetsdagen',
          bodyText:
            'Syftet med introduktionen är att ge din nya medarbetare all den information, kunskap och kontaktnät som den  behöver för att så snabbt möjligt komma in i sin nya roll och bli produktiv.',
          timeToComplete: 'P-1D',
          sortOrder: 1,
          tasks: [
            {
              id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaiaaaaaa',
              heading: 'Inför första arbetsdagen, Aktivitet 1',
              text: 'Inför första arbetsdagen, Aktivitet 1',
              sortOrder: 1,
              roleType: 'MANAGER_FOR_NEW_EMPLOYEE',
              questionType: 'COMPLETED_OR_NOT_RELEVANT',
              customTask: false,
              responseText: '',
              fulfilmentStatus: 'TRUE',
              updated: '2024-12-10T13:57:00.087242+01:00',
              updatedBy: 'ann01che',
            },
            {
              id: 'aaaaaaaa-aaaa-aaaa-aata-aaaaaaaaaaaa',
              heading: 'Inför första arbetsdagen, Aktivitet 2',
              text: 'Inför första arbetsdagen, Aktivitet 2',
              sortOrder: 2,
              roleType: 'MANAGER_FOR_NEW_EMPLOYEE',
              questionType: 'COMPLETED_OR_NOT_RELEVANT',
              customTask: false,
              responseText: '',
              fulfilmentStatus: 'TRUE',
              updated: '2024-12-11T08:35:57.094861+01:00',
              updatedBy: 'ann01che',
            },
          ],
        },
        {
          id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaata',
          name: 'Första dagen',
          bodyText: '',
          timeToComplete: 'P1D',
          sortOrder: 2,
          tasks: [
            {
              id: 'aaaaataa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
              heading: 'Första dagen, Aktivitet 1',
              text: 'Första dagen, Aktivitet 1',
              sortOrder: 1,
              roleType: 'MANAGER_FOR_NEW_EMPLOYEE',
              questionType: 'COMPLETED_OR_NOT_RELEVANT',
              customTask: false,
              responseText: '',
              fulfilmentStatus: 'TRUE',
              updated: '2024-12-10T13:56:56.721929+01:00',
              updatedBy: 'ann01che',
            },
            {
              id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaagaaaaaaa',
              heading: 'Första dagen, Aktivitet 2',
              text: 'Första dagen, Aktivitet 2',
              sortOrder: 2,
              roleType: 'MANAGER_FOR_NEW_EMPLOYEE',
              questionType: 'COMPLETED_OR_NOT_RELEVANT',
              customTask: false,
              responseText: '',
              fulfilmentStatus: 'TRUE',
              updated: '2024-12-11T08:26:25.07102+01:00',
              updatedBy: 'ann01che',
            },
          ],
        },
        {
          id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaggaaaaaa',
          name: 'Ny chef',
          bodyText: '',
          timeToComplete: 'P6M',
          sortOrder: 5,
          tasks: [
            {
              id: 'aaaaaaaa-aagg-aaaa-aaaa-aaaaaaaaaaaa',
              heading: 'Ny chef, Aktivitet 1',
              text: 'Ny chef, Aktivitet 1',
              sortOrder: 1,
              roleType: 'MANAGER_FOR_NEW_MANAGER',
              questionType: 'COMPLETED_OR_NOT_RELEVANT',
              customTask: false,
              responseText: '',
              fulfilmentStatus: 'TRUE',
              updated: '2024-12-10T13:56:51.060621+01:00',
              updatedBy: 'ann01che',
            },
            {
              id: 'aaaaaaaa-raaa-aaaa-aaaa-aaaaaaaaaaaa',
              heading: 'Ny chef, Aktivitet 2',
              text: 'Ny chef, Aktivitet 2',
              sortOrder: 2,
              roleType: 'MANAGER_FOR_NEW_MANAGER',
              questionType: 'COMPLETED_OR_NOT_RELEVANT',
              customTask: false,
              responseText: '',
              fulfilmentStatus: 'TRUE',
              updated: '2024-12-11T08:27:17.188391+01:00',
              updatedBy: 'ann01che',
            },
          ],
        },
        {
          id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaraaaaaaa',
          name: 'Om din anställning',
          bodyText: '',
          timeToComplete: 'P6M',
          sortOrder: 9,
          tasks: [
            {
              id: 'aaaraaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
              heading: 'Om din anställning, Aktivitet 1',
              text: 'Om din anställning, Aktivitet 1',
              sortOrder: 2,
              roleType: 'NEW_EMPLOYEE',
              questionType: 'COMPLETED_OR_NOT_RELEVANT',
              customTask: false,
              responseText: '',
              fulfilmentStatus: 'TRUE',
              updated: '2024-12-10T13:46:16.389305+01:00',
              updatedBy: 'jep11jep',
            },
            {
              id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaara',
              heading: 'Om din anställning, Aktivitet 2',
              text: 'Om din anställning, Aktivitet 2',
              sortOrder: 3,
              roleType: 'NEW_EMPLOYEE',
              questionType: 'COMPLETED_OR_NOT_RELEVANT',
              customTask: false,
              responseText: '',
              fulfilmentStatus: 'TRUE',
              updated: '2024-12-11T08:56:37.581972+01:00',
              updatedBy: 'jep11jep',
            },
          ],
        },
        {
          id: 'aaaaaaaa-avaa-aaaa-aaaa-aaaaaaaaaaaa',
          name: 'Nyanställd chef',
          bodyText: '',
          timeToComplete: 'P6M',
          sortOrder: 14,
          tasks: [
            {
              id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaavaaaaaaa',
              heading: 'Nyanställd chef, Aktivitet 1',
              text: 'Nyanställd chef, Aktivitet 1',
              sortOrder: 1,
              roleType: 'NEW_MANAGER',
              questionType: 'COMPLETED_OR_NOT_RELEVANT',
              customTask: false,
              responseText: '',
              fulfilmentStatus: 'FALSE',
              updated: '2024-12-09T10:39:46.805966+01:00',
              updatedBy: 'man01man',
            },
            {
              id: 'aaaaaaaa-aaaa-abaa-aaaa-aaaaaaaaaaaa',
              heading: 'Nyanställd chef, Aktivitet 2',
              text: 'Nyanställd chef, Aktivitet 2',
              sortOrder: 3,
              roleType: 'NEW_MANAGER',
              questionType: 'COMPLETED_OR_NOT_RELEVANT',
              customTask: false,
              fulfilmentStatus: 'EMPTY',
            },
          ],
        },
      ],
      created: '2024-11-21T13:41:05.901492+01:00',
      updated: '2024-12-10T15:34:10.827261+01:00',
      startDate: '2024-12-10',
      endDate: '2025-06-10',
      expirationDate: '2025-09-10',
    },
    {
      id: 'bbbbbbbb-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      employee: {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-abaaaaaaaaaa',
        firstName: 'Elon',
        lastName: 'New Employee-One',
        email: 'new.employee.one@noreply.com',
        username: 'emp01emp',
        title: 'Skoladministratör',
      },
      manager: {
        id: 'aaaaaaaa-aaaa-ahaa-aaaa-aaaaaaaaaaaa',
        firstName: 'Anna',
        lastName: 'Chef',
        email: 'anna.chef@noreply.com',
        username: 'ann01che',
      },
      completed: false,
      locked: false,
      mentor: {},
      delegatedTo: [],
      phases: [
        {
          id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaahaaaaaa',
          name: 'Inför första arbetsdagen',
          bodyText:
            'Syftet med introduktionen är att ge din nya medarbetare all den information, kunskap och kontaktnät som den  behöver för att så snabbt möjligt komma in i sin nya roll och bli produktiv.',
          timeToComplete: 'P-1D',
          sortOrder: 1,
          tasks: [
            {
              id: 'aaaaaaaa-aaha-aaaa-aaaa-aaaaaaaaaaaa',
              heading: 'Inför första arbetsdagen, Aktivitet 1',
              text: 'Inför första arbetsdagen, Aktivitet 1',
              sortOrder: 1,
              roleType: 'MANAGER_FOR_NEW_EMPLOYEE',
              questionType: 'COMPLETED_OR_NOT_RELEVANT',
              customTask: false,
              responseText: '',
              fulfilmentStatus: 'FALSE',
              updated: '2024-12-11T09:43:44.101832+01:00',
              updatedBy: 'ann01che',
            },
            {
              id: 'aaaaaaha-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
              heading: 'Inför första arbetsdagen, Aktivitet 2',
              text: 'Inför första arbetsdagen, Aktivitet 2',
              sortOrder: 2,
              roleType: 'MANAGER_FOR_NEW_EMPLOYEE',
              questionType: 'COMPLETED_OR_NOT_RELEVANT',
              customTask: false,
              responseText: '',
              fulfilmentStatus: 'FALSE',
              updated: '2024-12-12T08:55:10.234823+01:00',
              updatedBy: 'ann01che',
            },
          ],
        },
        {
          id: 'aaahhaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          name: 'Första dagen',
          bodyText: '',
          timeToComplete: 'P1D',
          sortOrder: 2,
          tasks: [
            {
              id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaahhaaaaaaa',
              heading: 'Första dagen, Aktivitet 1',
              text: 'Aktivitet 1',
              sortOrder: 1,
              roleType: 'MANAGER_FOR_NEW_EMPLOYEE',
              questionType: 'COMPLETED_OR_NOT_RELEVANT',
              customTask: false,
              fulfilmentStatus: 'EMPTY',
            },
            {
              id: 'aaaaaaaa-aaja-aaaa-aaaa-aaaaaaaaaaaa',
              heading: 'Första dagen, Aktivitet 2',
              text: 'Aktivitet 2',
              sortOrder: 2,
              roleType: 'MANAGER_FOR_NEW_EMPLOYEE',
              questionType: 'COMPLETED_OR_NOT_RELEVANT',
              customTask: false,
              fulfilmentStatus: 'EMPTY',
            },
          ],
        },
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
              fulfilmentStatus: 'TRUE',
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
              fulfilmentStatus: 'TRUE',
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
  ],
  status: 200,
  message: 'success',
};

export const searchEmployeeResponse = {
  data: {
    personid: 'aaaaaaaa-aaaa-asdc-aaaa-aaaaajjaaaaa',
    givenname: 'Användare',
    lastname: 'Användarsson',
    fullname: 'Användarsson Användare',
    address: '',
    postalCode: '',
    city: '',
    aboutMe: 'Jag är en testperson.',
    email: 'anv01anv@example.com',
    mailNickname: 'anv01anv',
    company: 'Sundsvalls kommun',
    companyId: 1,
    orgTree: 'Sundsvalls kommun',
    isManager: false,
    loginName: 'PERSONAL\\anv01anv',
  },
  status: 200,
  message: 'success',
};

export const delegatedIntroductionResponse = {
  status: 201,
};