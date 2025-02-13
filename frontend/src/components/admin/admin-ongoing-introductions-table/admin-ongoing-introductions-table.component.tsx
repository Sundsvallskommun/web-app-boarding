import React, { useEffect, useMemo, useState } from 'react';
import { useOngoingChecklists } from '@services/checklist-service/use-ongoing-checklists';
import { Button, Input, Pagination, SearchField, SortMode, Table } from '@sk-web-gui/react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { OngoingEmployeeChecklist } from '@data-contracts/backend/data-contracts';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Spinner } from '@sk-web-gui/spinner';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';

interface OngoingIntroductionsForm {
  sortOrder: SortMode.ASC | SortMode.DESC;
  sortColumn: string;
  currentPage: number;
  pageSize: number;
  searchTerm: string;
}

export const AdminOngoingIntroductionsTable: React.FC = () => {
  const { register, watch, setValue, getValues } = useForm<OngoingIntroductionsForm>({
    defaultValues: {
      sortColumn: 'employeeName',
      sortOrder: SortMode.ASC,
      pageSize: 15,
      currentPage: 1,
      searchTerm: '',
    },
  });

  const { sortOrder, sortColumn, currentPage, pageSize, searchTerm } = watch();

  const router = useRouter();
  const { t } = useTranslation();

  const [isDirty, setIsDirty] = useState<boolean>(false);

  const { data, refresh } = useOngoingChecklists(
    currentPage,
    pageSize,
    sortColumn,
    sortOrder === 'ascending' ? 'ASC' : 'DESC'
  );

  const onChangeHandler = (event: React.BaseSyntheticEvent) => {
    setValue('searchTerm', event.target.value);
    setIsDirty(true);
  };

  const onResetHandler = () => {
    setValue('searchTerm', '');
    setIsDirty(false);
    refresh('');
  };

  const onSearchHandler = () => {
    refresh(getValues().searchTerm);
    setIsDirty(false);
  };

  const getDeepColumn = (column: string, object: OngoingEmployeeChecklist) => {
    const columns: (keyof OngoingEmployeeChecklist)[] = column.split('.') as (keyof OngoingEmployeeChecklist)[];
    let value = object as any;
    columns.forEach((col) => {
      if (value && value[col]) {
        value = value[col];
      } else {
        value = 0;
      }
    });
    return value;
  };

  const handleSorting = (column: string) => {
    if (sortColumn !== column) {
      setValue('sortColumn', column);
    } else {
      setValue('sortOrder', sortOrder === SortMode.ASC ? SortMode.DESC : SortMode.ASC);
    }
  };

  useEffect(() => {
    refresh('');
  }, [pageSize, currentPage, sortOrder, sortColumn]);

  const dataRows = useMemo(() => {
    return data.checklists
      .sort((a: OngoingEmployeeChecklist, b: OngoingEmployeeChecklist) => {
        const order = sortOrder === SortMode.ASC ? -1 : 1;
        return (
          getDeepColumn(sortColumn, a) < getDeepColumn(sortColumn, b) ? order
          : getDeepColumn(sortColumn, a) > getDeepColumn(sortColumn, b) ? order * -1
          : 0
        );
      })
      .map((checklist: OngoingEmployeeChecklist, idx: number) => {
        return (
          <Table.Row key={`row-${idx}`} className="bg-background-content">
            <Table.Column>{checklist.employeeName}</Table.Column>
            <Table.Column>{checklist.employeeUsername}</Table.Column>
            <Table.Column>{checklist.departmentName}</Table.Column>
            <Table.Column>{checklist.managerName}</Table.Column>
            <Table.Column>{dayjs(checklist.employmentDate).format('DD MMMM YYYY')}</Table.Column>
            <Table.Column className="justify-end">
              <Button
                data-cy={`table-row-button-${idx}`}
                iconButton
                variant="tertiary"
                onClick={() => {
                  router.push(`./${checklist.employeeUsername}`);
                }}
              >
                <Icon name="arrow-right" />
              </Button>
            </Table.Column>
          </Table.Row>
        );
      });
  }, [data, sortOrder, sortColumn]);

  return (
    <div>
      <div className="flex my-24">
        <SearchField
          {...register('searchTerm')}
          data-cy="ongoing-introductions-table-search-field"
          placeholder={t('common:search_by_employee')}
          value={searchTerm}
          onChange={onChangeHandler}
          onReset={onResetHandler}
          onSearch={onSearchHandler}
          showSearchButton={isDirty}
          size="md"
          className="w-[36rem]"
        />

        <p className="text-small mx-24 my-12" data-cy="ongoing-introductions-count">
          {t('common:displayed_introductions', { count: data._meta.totalRecords })}
        </p>
      </div>

      {!data ?
        <Spinner />
      : <div>
          <Table
            className="mb-40 bg-background-content border-1 border-divider"
            background={true}
            data-cy="ongoing-introductions-table"
          >
            <Table.Header
              className="bg-background-content border-1 border-b-inverted-secondary-outline-hover"
              data-cy="ongoing-introductions-table-header"
            >
              <Table.HeaderColumn aria-sort={sortColumn === 'employeeName' ? sortOrder : 'none'}>
                <Table.SortButton
                  isActive={sortColumn === 'employeeName'}
                  sortOrder={sortOrder}
                  onClick={() => handleSorting('employeeName')}
                >
                  {t('common:employee')}
                </Table.SortButton>
              </Table.HeaderColumn>

              <Table.HeaderColumn aria-sort={sortColumn === 'employeeUsername' ? sortOrder : 'none'}>
                <Table.SortButton
                  isActive={sortColumn === 'employeeUsername'}
                  sortOrder={sortOrder}
                  onClick={() => handleSorting('employeeUsername')}
                >
                  {t('common:username')}
                </Table.SortButton>
              </Table.HeaderColumn>

              <Table.HeaderColumn aria-sort={sortColumn === 'departmentName' ? sortOrder : 'none'}>
                <Table.SortButton
                  isActive={sortColumn === 'departmentName'}
                  sortOrder={sortOrder}
                  onClick={() => handleSorting('departmentName')}
                >
                  {t('common:department')}
                </Table.SortButton>
              </Table.HeaderColumn>

              <Table.HeaderColumn aria-sort={sortColumn === 'managerName' ? sortOrder : 'none'}>
                <Table.SortButton
                  isActive={sortColumn === 'managerName'}
                  sortOrder={sortOrder}
                  onClick={() => handleSorting('managerName')}
                >
                  {t('common:manager')}
                </Table.SortButton>
              </Table.HeaderColumn>

              <Table.HeaderColumn aria-sort={sortColumn === 'employmentDate' ? sortOrder : 'none'}>
                <Table.SortButton
                  isActive={sortColumn === 'employmentDate'}
                  sortOrder={sortOrder}
                  onClick={() => handleSorting('employmentDate')}
                >
                  {t('common:start_date')}
                </Table.SortButton>
              </Table.HeaderColumn>

              <Table.HeaderColumn></Table.HeaderColumn>
            </Table.Header>

            <Table.Body>{dataRows.map((row) => row)}</Table.Body>

            <Table.Footer className="flex justify-start" data-cy="ongoing-introductions-table-footer">
              <div className="w-1/3">
                <label className="sk-table-bottom-section-label pr-3" htmlFor="pagiPageSize">
                  {t('common:rows_per_page')}
                </label>

                <Input
                  {...register('pageSize')}
                  hideExtra={false}
                  size="sm"
                  id="pagePageSize"
                  type="number"
                  min={1}
                  max={100}
                  className="max-w-[6.5rem]"
                  value={`${pageSize}`}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    event.target.value && setValue('pageSize', parseInt(event.target.value))
                  }
                />
              </div>

              <div className="w-1/3">
                <Pagination
                  {...register('currentPage')}
                  className="sk-table-pagination"
                  pages={Math.ceil(data._meta.totalRecords / pageSize)}
                  activePage={currentPage}
                  showConstantPages
                  pagesAfter={1}
                  pagesBefore={1}
                  changePage={(page: number) => {
                    setValue('currentPage', page);
                  }}
                  fitContainer
                />
              </div>
            </Table.Footer>
          </Table>
        </div>
      }
    </div>
  );
};
