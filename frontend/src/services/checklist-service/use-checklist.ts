import { EmployeeChecklist } from '@data-contracts/backend/data-contracts';
import { useCrudHelper } from '@utils/use-crud-helpers';
import { useEffect, useState } from 'react';
import { getChecklistAsEmployee } from './checklist-service';

export const useChecklist = (
  username: string
): {
  data: EmployeeChecklist | null;
  loaded: boolean;
  loading: boolean;
  refresh: () => void;
} => {
  const { handleGetOne } = useCrudHelper('checklists');
  const [data, setData] = useState<EmployeeChecklist | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const refresh = () => {
    setLoading(true);
    handleGetOne(() => getChecklistAsEmployee(username))
      .then((res) => {
        if (res) {
          setData(res);
        }
        setLoaded(true);
        setLoading(false);
      })
      .catch(() => {
        setLoaded(false);
        setLoading(false);
      });
  };

  useEffect(() => {
    refresh();
  }, [username]);

  return { data, loaded, loading, refresh };
};
