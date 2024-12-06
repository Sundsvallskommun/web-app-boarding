import { createContext, ReactNode, useContext, useState } from 'react';
import { EmployeeChecklist } from '@data-contracts/backend/data-contracts';

export interface AppContextInterface {
  delegatedChecklists: EmployeeChecklist[];
  setDelegatedChecklists: (delegatedChecklists: EmployeeChecklist[]) => void;

  isCookieConsentOpen: boolean;
  setIsCookieConsentOpen: (isOpen: boolean) => void;

  setDefaults: () => void;
}

const AppContext = createContext<AppContextInterface>({
  delegatedChecklists: [],
  isCookieConsentOpen: false,
  setIsCookieConsentOpen: () => ({}),
  setDefaults: () => ({}),
  setDelegatedChecklists: () => [],
});

export function AppWrapper({ children }: { children: ReactNode }) {
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
