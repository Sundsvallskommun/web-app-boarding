import React, { useState } from 'react';
import { getEmployee } from '@services/checklist-service/checklist-service';
import { Avatar, Button, SearchField } from '@sk-web-gui/react';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { FormLabel } from '@sk-web-gui/forms';
import { Mentor } from '@data-contracts/backend/data-contracts';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { getEmployeeDepartment } from '@utils/get-employee-department';

let formSchema = yup.object({
  userId: yup.string().required(),
});

interface SearchEmployeeComponentProps {
  multiple: boolean;
}

interface UserForm {
  userId: string;
  name: string;
  email: string;
}

export const SearchEmployeeComponent: React.FC<SearchEmployeeComponentProps> = ({ multiple }) => {
  const { control } = useFormContext<{ recipients: UserForm[] }>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'recipients',
  });
  const [notFound, setNotFound] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<{ userId: string; name: string; email: string; orgTree: string }>();
  const { register, getValues, setValue, trigger } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      userId: '',
    },
  });

  const { t } = useTranslation();

  const onSearchHandler = () => {
    setNotFound(false);

    getEmployee(getValues('userId'))
      .then((res) => {
        setSearchResult({
          userId: getValues('userId'),
          name: `${res.givenname} ${res.lastname}`,
          email: res.email,
          orgTree: res.orgTree,
        });
      })
      .catch(() => {
        setNotFound(true);
      });
  };

  return (
    <div>
      {!fields.length || multiple ?
        <div>
          <FormLabel>{fields.length || multiple ? '' : t('common:search_by_username')}</FormLabel>
          <SearchField
            {...register('userId')}
            value={getValues('userId')}
            onChange={() => trigger()}
            onSearch={onSearchHandler}
            onReset={() => setSearchResult(undefined)}
            placeholder="Sök"
          />

          {notFound ?
            <p className="text-error">
              <Icon name="info" size="1.5rem" /> {t('common:search_errors.not_found')}
            </p>
          : null}
        </div>
      : null}
      {searchResult ?
        <div className="border-1 border-divider rounded-button p-16 my-16">
          <p>
            <strong>{searchResult.name}</strong> ({searchResult.userId})
          </p>
          <p>{searchResult.email}</p>
          <p>{getEmployeeDepartment(searchResult.orgTree)}</p>
          <Button
            className="mt-8"
            onClick={() => {
              append(searchResult);
              setSearchResult(undefined);
            }}
          >
            {t('common:add')}
          </Button>
        </div>
      : fields.length ?
        <div className="my-16">
          {fields.map((f: Mentor & { id: string; email: string }, index: number) => {
            return (
              <div className="mt-24" key={index}>
                <div className="flex justify-between mb-8 px-2">
                  <div className="flex gap-8">
                    <Avatar rounded />
                    <div>
                      <p className="m-0 p-0 text-small">
                        {f.name} ({f.userId})
                      </p>
                      <p className="text-small">{f.email}</p>
                    </div>
                  </div>

                  <Button
                    iconButton
                    inverted
                    onClick={() => {
                      remove(index);
                      setValue('userId', '');
                    }}
                  >
                    <Icon name="trash" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      : null}
    </div>
  );
};
