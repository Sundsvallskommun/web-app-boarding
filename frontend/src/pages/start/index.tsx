import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useUserStore } from '@services/user-service/user-service';
import { Button, Checkbox, Input, Label, Link, Pagination, SortMode, Table } from '@sk-web-gui/react';
import NextLink from 'next/link';
import { shallow } from 'zustand/shallow';
import React, { useState } from 'react';

const tableData = [
  {
    userId: '1',
    name: 'Anna Andersson',
    username: 'ann21and',
    supervisor: 'Pelle Karlsson',
    supervisorStatus: false,
    workerStatus: true,
    delegated: '',
    hireDate: '2023-02-11',
    gallras: '2023-03-11',
  },
  {
    userId: '2',
    name: 'Anna Bengtsson',
    username: 'ann21ben',
    supervisor: 'Pelle Karlsson',
    supervisorStatus: true,
    workerStatus: false,
    delegated: 'Lisa Nilsson',
    hireDate: '2023-03-12',
    gallras: '2023-04-11',
  },
];

export const Start: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  console.log('user', user);

  const [currentData, setCurrentData] = useState(tableData);
  const [_pageSize, setPageSize] = React.useState<number>(12);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [sortColumn, setSortColumn] = React.useState<string>('name');
  const [sortOrder, setSortOrder] = React.useState(SortMode.ASC);

  const handleSorting = (column: string) => {
    if (sortColumn !== column) {
      setSortColumn(column);
    } else {
      setSortOrder(sortOrder === SortMode.ASC ? SortMode.DESC : SortMode.ASC);
    }
  };

  const datarows = currentData
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
          <Table.Column>
            {' '}
            <Checkbox />{' '}
          </Table.Column>
          <Table.Column>
            <Link href={`start/${d.userId}`} className="font-bold no-underline text-black">
              {' '}
              {d.name}{' '}
            </Link>
          </Table.Column>
          <Table.Column>{d.username}</Table.Column>
          <Table.Column>
            {' '}
            <Label color={d.supervisorStatus ? 'gronsta' : 'error'} inverted rounded>
              {' '}
              {d.supervisorStatus ? 'I fas' : 'Försenad'}{' '}
            </Label>{' '}
          </Table.Column>
          <Table.Column>
            {' '}
            <Label color={d.workerStatus ? 'gronsta' : 'error'} inverted rounded>
              {' '}
              {d.workerStatus ? 'I fas' : 'Försenad'}{' '}
            </Label>{' '}
          </Table.Column>
          <Table.Column>{d.hireDate}</Table.Column>
          <Table.Column>{d.gallras}</Table.Column>
          <Table.Column>{d.delegated ? d.delegated : '-'}</Table.Column>
        </Table.Row>
      );
    });

  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - Start`}>
      <Main>
        <div className="py-10 px-10 2xl:px-0">
          <div className="py-24 flex">
            <div className="w-1/2">
              <h2>Pågående introduktioner</h2>
            </div>

            <div className="w-1/2 text-right">
              <Button color="vattjom">Delegera</Button>
            </div>
          </div>

          <Table className="mb-40 bg-background-content border-1 border-divider" background={true}>
            <Table.Header className="bg-background-content border-1 border-b-inverted-secondary-outline-hover">
              <Table.HeaderColumn>
                <Checkbox />
              </Table.HeaderColumn>

              <Table.HeaderColumn aria-sort={sortColumn === 'name' ? sortOrder : 'none'}>
                <Table.SortButton
                  isActive={sortColumn === 'name'}
                  sortOrder={sortOrder}
                  onClick={() => handleSorting('name')}
                >
                  Namn
                </Table.SortButton>
              </Table.HeaderColumn>

              <Table.HeaderColumn aria-sort={sortColumn === 'username' ? sortOrder : 'none'}>
                <Table.SortButton
                  isActive={sortColumn === 'username'}
                  sortOrder={sortOrder}
                  onClick={() => handleSorting('username')}
                >
                  Användarnamn
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

              <Table.HeaderColumn aria-sort={sortColumn === 'gallras' ? sortOrder : 'none'}>
                <Table.SortButton
                  isActive={sortColumn === 'gallras'}
                  sortOrder={sortOrder}
                  onClick={() => handleSorting('gallras')}
                >
                  Gallras
                </Table.SortButton>
              </Table.HeaderColumn>

              <Table.HeaderColumn aria-sort={sortColumn === 'delegated' ? sortOrder : 'none'}>
                <Table.SortButton
                  isActive={sortColumn === 'delegated'}
                  sortOrder={sortOrder}
                  onClick={() => handleSorting('delegated')}
                >
                  Delegerad till
                </Table.SortButton>
              </Table.HeaderColumn>
            </Table.Header>

            <Table.Body>
              {datarows.map((row) => {
                return row;
              })}
            </Table.Body>

            {tableData.length > 1 && (
              <Table.Footer className="flex justify-start">
                <div className="w-1/3">
                  <label className="sk-table-bottom-section-label pr-3" htmlFor="pagiPageSize">
                    {' '}
                    Rader per sida{' '}
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
                    pages={Math.ceil(tableData.length / _pageSize)}
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

          {user.name ?
            <NextLink href={`/logout`}>
              <Link as="span" variant="link">
                Logga ut
              </Link>
            </NextLink>
          : ''}
        </div>
      </Main>
    </DefaultLayout>
  );
};

export default Start;
