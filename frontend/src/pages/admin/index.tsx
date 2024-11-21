import Main from '@layouts/main/main.component';
import AdminLayout from '@layouts/admin-layout/admin-layout.component';
import { Input, Pagination, SearchField, Select, SortMode, Table } from '@sk-web-gui/react';
import React, { useEffect, useState } from 'react';
import { useOrgTree } from '@services/organization-service';
import { OrganizationMenu } from '@components/organization-menu/organization-menu.component';

const tableData = [
  {
    name: 'Anna Andersson',
    username: 'ann21and',
    operation: 'Verksamhet B',
    supervisor: 'Pelle Karlsson',
    delegated: '',
    hireDate: '2023-03-11',
    gallras: '2023-03-11',
  },
  {
    name: 'Anna Carlsson',
    username: 'ann21and',
    operation: 'Verksamhet B',
    supervisor: 'Pelle Karlsson',
    delegated: '',
    hireDate: '2023-03-11',
    gallras: '2023-03-11',
  },
  {
    name: 'Anna Carlsson',
    username: 'ann21and',
    operation: 'Verksamhet B',
    supervisor: 'Pelle Karlsson',
    delegated: 'Lisa Nilsson',
    hireDate: '2023-03-11',
    gallras: '2023-03-11',
  },
  {
    name: 'Anna Carlsson',
    username: 'ann21and',
    operation: 'Verksamhet B',
    supervisor: 'Pelle Karlsson',
    delegated: '',
    hireDate: '2023-03-11',
    gallras: '2023-03-11',
  },
  {
    name: 'Anna Carlsson',
    username: 'ann21and',
    operation: 'Verksamhet B',
    supervisor: 'Pelle Karlsson',
    delegated: '',
    hireDate: '2023-03-11',
    gallras: '2023-03-11',
  },
  {
    name: 'Anna Carlsson',
    username: 'ann21and',
    operation: 'Verksamhet B',
    supervisor: 'Pelle Karlsson',
    delegated: 'Lisa Nilsson',
    hireDate: '2023-03-11',
    gallras: '2023-03-11',
  },
  {
    name: 'Anna Andersson',
    username: 'ann21and',
    operation: 'Verksamhet B',
    supervisor: 'Pelle Karlsson',
    delegated: '',
    hireDate: '2023-03-11',
    gallras: '2023-03-11',
  },
  {
    name: 'Anna Bengtsson',
    username: 'ann21and',
    operation: 'Verksamhet B',
    supervisor: 'Pelle Karlsson',
    delegated: '',
    hireDate: '2023-03-11',
    gallras: '2023-03-11',
  },
  {
    name: 'Anna Carlsson',
    username: 'ann21and',
    operation: 'Verksamhet B',
    supervisor: 'Pelle Karlsson',
    delegated: 'Lisa Nilsson',
    hireDate: '2023-03-11',
    gallras: '2023-03-10',
  },
  {
    name: 'Anna Andersson',
    username: 'ann21and',
    operation: 'Verksamhet C',
    supervisor: 'Pelle Karlsson',
    delegated: '',
    hireDate: '2023-03-10',
    gallras: '2023-03-11',
  },
  {
    name: 'Anna Carlsson',
    username: 'ann21and',
    operation: 'Verksamhet A',
    supervisor: 'Pelle Karlsson',
    delegated: '',
    hireDate: '2023-03-11',
    gallras: '2023-03-11',
  },
];

export const Admin: React.FC = () => {
  const [currentData, setCurrentData] = useState(tableData);
  const [_pageSize, setPageSize] = React.useState<number>(12);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [sortColumn, setSortColumn] = React.useState<string>('');
  const [sortOrder, setSortOrder] = React.useState(SortMode.ASC);
  const [rowHeight, setRowHeight] = React.useState<string>('normal');

  const [term, setTerm] = useState('');
  const [dirty, setDirty] = useState(false);

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
          <Table.Column className="font-bold">{d.name}</Table.Column>
          <Table.Column>{d.username}</Table.Column>
          <Table.Column>{d.operation}</Table.Column>
          <Table.Column>{d.supervisor}</Table.Column>
          <Table.Column>{!d.delegated ? '-' : d.delegated}</Table.Column>
          <Table.Column>{d.hireDate}</Table.Column>
          <Table.Column>{d.gallras}</Table.Column>
        </Table.Row>
      );
    });

  const handleSelect = (value: any) => {
    if (!value) {
      setCurrentData(tableData);
      return;
    }

    const filtered = tableData.filter((data) => data.operation === value);
    setCurrentData(filtered);
  };

  const onChangeHandler = (event: React.BaseSyntheticEvent) => {
    setTerm(event.target.value);
    setDirty(true);
  };

  const onSearchHandler = () => {
    const filtered = currentData.filter((data) => data.name.toLowerCase().includes(term.toLowerCase()));
    setCurrentData(filtered);
    setDirty(false);
  };

  return (
    <AdminLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - Admin`}>
      <Main>
        <h2 className="m-40">Pågående introduktioner</h2>

        <div className="mx-40 mb-24">
          <div className="flex mb-3">
            <span className="font-bold">Verksamhet</span>
          </div>

          <div className="flex justify-between">
            <Select size="md" onSelectValue={(value) => handleSelect(value)}>
              <Select.Option key="1" value="">
                Alla
              </Select.Option>
              {tableData
                .filter((obj, index) => {
                  return index === tableData.findIndex((o) => obj.operation === o.operation);
                })
                .map((data, index) => (
                  <Select.Option key={index} value={data.operation}>
                    {data.operation}
                  </Select.Option>
                ))}
            </Select>

            <SearchField
              size="md"
              value={term}
              onChange={onChangeHandler}
              showSearchButton={dirty}
              onSearch={onSearchHandler}
              placeholder="Sök efter namn i listan"
            />
          </div>
        </div>

        <Table
          className="mx-40 mb-40 shadow bg-background-content border-1 border-divider"
          background={true}
          dense={rowHeight === 'dense'}
        >
          <Table.Header className="bg-background-content border-1 border-b-secondary-outline-hover">
            <Table.HeaderColumn
              aria-sort={sortColumn === 'name' ? sortOrder : 'none'}
              className="bg-background-content"
            >
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

            <Table.HeaderColumn aria-sort={sortColumn === 'operation' ? sortOrder : 'none'}>
              <Table.SortButton
                isActive={sortColumn === 'operation'}
                sortOrder={sortOrder}
                onClick={() => handleSorting('operation')}
              >
                Verksamhet
              </Table.SortButton>
            </Table.HeaderColumn>

            <Table.HeaderColumn aria-sort={sortColumn === 'supervisor' ? sortOrder : 'none'}>
              <Table.SortButton
                isActive={sortColumn === 'supervisor'}
                sortOrder={sortOrder}
                onClick={() => handleSorting('supervisor')}
              >
                Chef
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
          </Table.Header>

          <Table.Body>
            {datarows.map((row) => {
              return row;
            })}
          </Table.Body>

          <Table.Footer>
            <div className="sk-table-bottom-section">
              <label className="sk-table-bottom-section-label" htmlFor="pagiPageSize">
                Rader per sida:
              </label>
              <Input
                hideExtra={false}
                size="sm"
                id="pagePageSize"
                type="number"
                min={1}
                max={100}
                className="max-w-[6rem]"
                value={`${_pageSize}`}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  event.target.value && setPageSize(parseInt(event.target.value))
                }
              />
            </div>

            <div className="sk-table-paginationwrapper">
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
            <div className="sk-table-bottom-section">
              <label className="sk-table-bottom-section-label" htmlFor="pagiRowHeight">
                Radhöjd:
              </label>
              <Select
                id="pagiRowHeight"
                size="sm"
                value={rowHeight}
                onSelectValue={(value: string) => setRowHeight(value)}
                variant="tertiary"
              >
                <Select.Option value={'normal'}>Normal</Select.Option>
                <Select.Option value={'dense'}>Tät</Select.Option>
              </Select>
            </div>
          </Table.Footer>
        </Table>
      </Main>
    </AdminLayout>
  );
};

export default Admin;
