import { createContext, useContext, useState } from 'react';
import { Checklist, EmployeeChecklist } from '@data-contracts/backend/data-contracts';
import { User } from '@data-contracts/backend/data-contracts';

export interface AppContextInterface {
  user: User;
  setUser: (user: User) => void;

  checklist: Checklist;
  setChecklist: (checklist: Checklist) => void;

  asManagerChecklists: EmployeeChecklist[];
  setAsManagerChecklists: (asManagerChecklists: EmployeeChecklist[]) => void;

  asEmployeeChecklists: EmployeeChecklist;
  setAsEmployeeChecklists: (asEmployeeChecklists: EmployeeChecklist) => void;

  delegatedChecklists: EmployeeChecklist[];
  setDelegatedChecklists: (delegatedChecklists: EmployeeChecklist[]) => void;

  isCookieConsentOpen: boolean;
  setIsCookieConsentOpen: (isOpen: boolean) => void;

  setDefaults: () => void;
}

const AppContext = createContext<AppContextInterface>(null);

export function AppWrapper({ children }) {
  const [user, setUser] = useState<User>();
  const [checklist, setChecklist] = useState<Checklist>();
  const [asManagerChecklists, setAsManagerChecklists] = useState<EmployeeChecklist[]>([]);
  const [asEmployeeChecklists, setAsEmployeeChecklists] = useState<EmployeeChecklist>();
  const [delegatedChecklists, setDelegatedChecklists] = useState<EmployeeChecklist[]>([]);

  const contextDefaults = {
    isCookieConsentOpen: true,
  };
  const setDefaults = () => {
    setIsCookieConsentOpen(contextDefaults.isCookieConsentOpen);
  };

  const [isCookieConsentOpen, setIsCookieConsentOpen] = useState(true);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser: (user: User) => setUser(user),

        checklist,
        setChecklist: (checklist: Checklist) => setChecklist(checklist),

        asManagerChecklists,
        setAsManagerChecklists: (asManagerChecklists: EmployeeChecklist[]) =>
          setAsManagerChecklists(asManagerChecklists),

        asEmployeeChecklists,
        setAsEmployeeChecklists: (asEmployeeChecklists: EmployeeChecklist) =>
          setAsEmployeeChecklists(asEmployeeChecklists),

        delegatedChecklists,
        setDelegatedChecklists: (delegatedChecklists: EmployeeChecklist[]) =>
          setDelegatedChecklists(delegatedChecklists),

        isCookieConsentOpen,
        setIsCookieConsentOpen: (isOpen: boolean) => setIsCookieConsentOpen(isOpen),

        setDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
