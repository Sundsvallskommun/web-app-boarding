import React, { useState } from 'react';
import { getEmployee } from '@services/checklist-service/checklist-service';
import { Button, SearchField } from '@sk-web-gui/react';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { FormLabel } from '@sk-web-gui/forms';
import Divider from '@sk-web-gui/divider';
import { Mentor } from '@data-contracts/backend/data-contracts';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

let formSchema = yup.object({
  userId: yup.string().required(),
});

export const SearchEmployeeComponent = ({ multiple, fields, append, remove }) => {
  const [notFound, setNotFound] = useState<boolean>(false);
  const { register, getValues, setValue, trigger } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      userId: '',
    },
  });

  const onSearchHandler = () => {
    setNotFound(false);

    getEmployee(getValues('userId'))
      .then((res) => {
        append({
          userId: getValues('userId'),
          name: res.fullname,
          email: res.email,
        });
      })
      .catch(() => {
        setNotFound(true);
      });
  };

  return (
    <div>
      {!fields.length || multiple ?
        <div className="mb-24">
          <FormLabel>{fields.length || multiple ? '' : 'Sök på användarnamn'}</FormLabel>
          <SearchField
            {...register('userId')}
            value={getValues('userId')}
            onChange={() => trigger()}
            onSearch={onSearchHandler}
            placeholder="Sök"
          />

          {notFound ?
            <p className="text-error">
              <Icon name="info" size="1.5rem" /> Sökningen gav ingen träff
            </p>
          : null}
        </div>
      : null}
      {fields.length ?
        <>
          <FormLabel>{fields.length === 1 ? 'Tillagd mottagare' : 'Tillagda mottagare'}</FormLabel>
          <Divider />
          {fields.map((f: Mentor & { id: string; email: string }, index: number) => {
            return (
              <div className="my-14" key={index}>
                <div className="flex justify-between mb-8 px-2">
                  <div>
                    <strong>{f.name}</strong> ({f.userId})<p>{f.email}</p>
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
                <Divider />
              </div>
            );
          })}
        </>
      : null}
    </div>
  );
};
