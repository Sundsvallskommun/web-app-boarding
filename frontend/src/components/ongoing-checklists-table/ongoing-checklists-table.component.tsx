import { EmployeeChecklist } from '@data-contracts/backend/data-contracts';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Avatar, Button, Checkbox, Input, Pagination, SortMode, Table } from '@sk-web-gui/react';
import { Spinner } from '@sk-web-gui/spinner';
import { getChecklistStatusLabel } from '@utils/get-checklist-status';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Divider from '@sk-web-gui/divider';
import { DelegateMultipleChecklistsModal } from '@components/delegate-checklists-modal/delegate-checklists-modal.component';

interface OngoingChecklistsTableProps {
  data: EmployeeChecklist[];
  delegatedChecklists: boolean;
}

export const OngoingChecklistsTable: React.FC<OngoingChecklistsTableProps> = (props) => {
  const { data, delegatedChecklists } = props;
  const methods = useForm();
  const router = useRouter();
  const [_pageSize, setPageSize] = React.useState<number>(12);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [sortColumn, setSortColumn] = React.useState<string>('employee.firstName');
  const [sortOrder, setSortOrder] = React.useState(SortMode.ASC);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { checked, checkAll } = methods.watch();

  const handleCheckAll = () => {
    if (checked?.length && checkAll) {
      methods.setValue('checked', []);
    } else {
      methods.setValue(
        'checked',
        data.map((checklist: EmployeeChecklist) => checklist.id)
      );
    }
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  const getDeepColumn = (column: string, object: EmployeeChecklist) => {
    const columns: (keyof EmployeeChecklist)[] = column.split('.') as (keyof EmployeeChecklist)[];
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
      setSortColumn(column);
    } else {
      setSortOrder(sortOrder === SortMode.ASC ? SortMode.DESC : SortMode.ASC);
    }
  };

  const datarows = data
    .sort((a: EmployeeChecklist, b: EmployeeChecklist) => {
      const order = sortOrder === SortMode.ASC ? -1 : 1;
      return (
        getDeepColumn(sortColumn, a) < getDeepColumn(sortColumn, b) ? order
        : getDeepColumn(sortColumn, a) > getDeepColumn(sortColumn, b) ? order * -1
        : 0
      );
    })
    .slice((currentPage - 1) * _pageSize, currentPage * _pageSize)
    .map((d: EmployeeChecklist, idx: number) => {
      return (
        <Table.Row key={`row-${idx}`} className="bg-background-content">
          {!delegatedChecklists && (
            <Table.Column>
              <Checkbox {...methods.register('checked')} value={d.id} />
            </Table.Column>
          )}
          <Table.Column>
            <div className="flex gap-8">
              <Avatar initials={`${d.employee.firstName[0]}${d.employee.lastName[0]}`} rounded />
              <div>
                <strong>{d.employee.firstName + ' ' + d.employee.lastName}</strong> ({d.employee.username})
                <p>{d.employee.title}</p>
              </div>
            </div>
          </Table.Column>
          <Table.Column>{getChecklistStatusLabel(d, true)}</Table.Column>
          <Table.Column>{getChecklistStatusLabel(d, false)}</Table.Column>
          <Table.Column>{d.startDate}</Table.Column>
          <Table.Column className="justify-end">
            <Button
              iconButton
              onClick={() => {
                router.push(`/${d.employee.username}`);
              }}
            >
              <Icon name="arrow-right" />
            </Button>
          </Table.Column>
        </Table.Row>
      );
    });

  return !data ?
      <Spinner />
    : <div>
        <Table className="mb-40 bg-background-content border-1 border-divider" background={true}>
          <Table.Header className="bg-background-content border-1 border-b-inverted-secondary-outline-hover">
            {!delegatedChecklists && (
              <Table.HeaderColumn>
                <Checkbox {...methods.register('checkAll')} onClick={handleCheckAll} />
              </Table.HeaderColumn>
            )}

            <Table.HeaderColumn aria-sort={sortColumn === 'employee.firstName' ? sortOrder : 'none'}>
              <Table.SortButton
                isActive={sortColumn === 'employee.firstName'}
                sortOrder={sortOrder}
                onClick={() => handleSorting('employee.firstName')}
              >
                Anställd
              </Table.SortButton>
            </Table.HeaderColumn>

            <Table.HeaderColumn aria-sort={sortColumn === 'managerStatus' ? sortOrder : 'none'}>
              <Table.SortButton
                isActive={sortColumn === 'managerStatus'}
                sortOrder={sortOrder}
                onClick={() => handleSorting('managerStatus')}
              >
                Status chef
              </Table.SortButton>
            </Table.HeaderColumn>

            <Table.HeaderColumn aria-sort={sortColumn === 'employeeStatus' ? sortOrder : 'none'}>
              <Table.SortButton
                isActive={sortColumn === 'employeeStatus'}
                sortOrder={sortOrder}
                onClick={() => handleSorting('employeeStatus')}
              >
                Status anställd
              </Table.SortButton>
            </Table.HeaderColumn>

            <Table.HeaderColumn aria-sort={sortColumn === 'startDate' ? sortOrder : 'none'}>
              <Table.SortButton
                isActive={sortColumn === 'startDate'}
                sortOrder={sortOrder}
                onClick={() => handleSorting('startDate')}
              >
                Anställningsdatum
              </Table.SortButton>
            </Table.HeaderColumn>

            <Table.HeaderColumn></Table.HeaderColumn>
          </Table.Header>

          <Table.Body>{datarows.map((row) => row)}</Table.Body>

          {data.length > 12 && (
            <Table.Footer className="flex justify-start">
              <div className="w-1/3">
                <label className="sk-table-bottom-section-label pr-3" htmlFor="pagiPageSize">
                  Rader per sida
                </label>

                <Input
                  hideExtra={false}
                  size="sm"
                  id="pagePageSize"
                  type="number"
                  min={1}
                  max={100}
                  className="max-w-[6.5rem]"
                  value={`${_pageSize}`}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    event.target.value && setPageSize(parseInt(event.target.value))
                  }
                />
              </div>

              <div className="w-1/3">
                <Pagination
                  className="sk-table-pagination"
                  pages={Math.ceil(data.length / _pageSize)}
                  activePage={currentPage}
                  showConstantPages
                  pagesAfter={1}
                  pagesBefore={1}
                  changePage={(page: number) => setCurrentPage(page)}
                  fitContainer
                />
              </div>
            </Table.Footer>
          )}
        </Table>
        {checked?.length ?
          <div className="flex w-full justify-center">
            <div className="absolute bottom-40 rounded-button bg-inverted-background-content text-white font-bold py-16 px-24 flex">
              <span className="content-center mr-8">
                {checked.length} {checked.length > 1 ? 'valda' : 'vald'}
              </span>
              <Button
                className="mx-16"
                onClick={() => {
                  methods.setValue('checkAll', false);
                  methods.setValue('checked', []);
                }}
                variant="secondary"
                inverted
              >
                Avmarkera alla
              </Button>
              <Divider className="mx-16 my-0 mr-32 bg-inverted-divider" orientation="vertical" />
              <Button color="primary" onClick={() => setIsOpen(true)} inverted>
                <DelegateMultipleChecklistsModal
                  checklistIds={methods.getValues('checked')}
                  onClose={closeHandler}
                  isOpen={isOpen}
                />
              </Button>
            </div>
          </div>
        : null}
      </div>;
};
