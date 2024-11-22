import React from 'react';
import { Avatar, Button, Checkbox, Input, Pagination, SortMode, Table } from '@sk-web-gui/react';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Spinner } from '@sk-web-gui/spinner';
import { useRouter } from 'next/router';
import { getChecklistStatusLabel } from '@utils/get-checklist-status';

export const OngoingChecklistsTable = ({ data, delegatedChecklists, fields, watch, append, remove, register }) => {
  const router = useRouter();
  const [_pageSize, setPageSize] = React.useState<number>(12);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [sortColumn, setSortColumn] = React.useState<string>('name');
  const [sortOrder, setSortOrder] = React.useState(SortMode.ASC);

  const checkAll = watch('checkAll');

  const handleCheckAll = () => {
    if (fields.length && checkAll) {
      remove();
    } else {
      data.every((list) => append(list));
    }
  };

  const handleSorting = (column: string) => {
    if (sortColumn !== column) {
      setSortColumn(column);
    } else {
      setSortOrder(sortOrder === SortMode.ASC ? SortMode.DESC : SortMode.ASC);
    }
  };

  const datarows = data
    .sort((a, b) => {
      const order = sortOrder === SortMode.ASC ? -1 : 1;
      return (
        a[sortColumn] < b[sortColumn] ? order
        : a[sortColumn] > b[sortColumn] ? order * -1
        : 0
      );
    })
    .slice((currentPage - 1) * _pageSize, currentPage * _pageSize)
    .map((d, idx: number) => {
      return (
        <Table.Row key={`row-${idx}`} className="bg-background-content">
          {!delegatedChecklists && (
            <Table.Column>
              <Checkbox
                checked={fields.length ? fields.every((field) => field.id === field.id) : false}
                onChange={() => {
                  if (fields.length) {
                    fields.map((f, index) => {
                      if (f.id === d.id) {
                        remove(index);
                      } else {
                        append(d);
                      }
                    });
                  } else {
                    append(d);
                  }
                }}
              />
            </Table.Column>
          )}
          <Table.Column>
            <div className="flex gap-8">
              <Avatar rounded />
              <div>
                <strong>{d.employee.firstName + ' ' + d.employee.lastName}</strong> ({d.employee.username})<p>Titel</p>
              </div>
            </div>
          </Table.Column>
          <Table.Column>{getChecklistStatusLabel(d, true)}</Table.Column>
          <Table.Column>{getChecklistStatusLabel(d, false)}</Table.Column>
          <Table.Column>{d.startDate}</Table.Column>
          <Table.Column className="justify-end">
            <Button iconButton onClick={() => router.push(`start/${d.employee.username}`)}>
              <Icon name="arrow-right" />
            </Button>
          </Table.Column>
        </Table.Row>
      );
    });

  return !data ?
      <Spinner />
    : <Table className="mb-40 bg-background-content border-1 border-divider" background={true}>
        <Table.Header className="bg-background-content border-1 border-b-inverted-secondary-outline-hover">
          {!delegatedChecklists && (
            <Table.HeaderColumn>
              <Checkbox {...register('checkAll')} onClick={handleCheckAll} />
            </Table.HeaderColumn>
          )}

          <Table.HeaderColumn aria-sort={sortColumn === 'name' ? sortOrder : 'none'}>
            <Table.SortButton
              isActive={sortColumn === 'name'}
              sortOrder={sortOrder}
              onClick={() => handleSorting('name')}
            >
              Anställd
            </Table.SortButton>
          </Table.HeaderColumn>

          <Table.HeaderColumn aria-sort={sortColumn === 'supervisorStatus' ? sortOrder : 'none'}>
            <Table.SortButton
              isActive={sortColumn === 'supervisorStatus'}
              sortOrder={sortOrder}
              onClick={() => handleSorting('supervisorStatus')}
            >
              Status chef
            </Table.SortButton>
          </Table.HeaderColumn>

          <Table.HeaderColumn aria-sort={sortColumn === 'workerStatus' ? sortOrder : 'none'}>
            <Table.SortButton
              isActive={sortColumn === 'workerStatus'}
              sortOrder={sortOrder}
              onClick={() => handleSorting('workerStatus')}
            >
              Status anställd
            </Table.SortButton>
          </Table.HeaderColumn>

          <Table.HeaderColumn aria-sort={sortColumn === 'hireDate' ? sortOrder : 'none'}>
            <Table.SortButton
              isActive={sortColumn === 'hireDate'}
              sortOrder={sortOrder}
              onClick={() => handleSorting('hireDate')}
            >
              Anställningsdatum
            </Table.SortButton>
          </Table.HeaderColumn>

          <Table.HeaderColumn></Table.HeaderColumn>
        </Table.Header>

        <Table.Body>
          {datarows.map((row) => {
            return row;
          })}
        </Table.Body>

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
      </Table>;
};
