'use client';

import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTable } from '@/hooks/use-table';
import { useColumn } from '@/hooks/use-column';
import { Button } from 'rizzui';
import ControlledTable from '@/components/controlled-table';
import { getColumns } from '@/app/shared/invoice/invoice-list/theater-complex-columns';
import CinemaField from '@/components/controlled-table/cinema-field';
import { renderOptionDisplayValue } from '../form-utils';
import { API_CINEMA_SYSTEM } from '@/API';
import axios from 'axios';
const FilterElement = dynamic(
  () => import('@/app/shared/invoice/invoice-list/filter-theater-complex'),
  { ssr: false }
);
const TableFooter = dynamic(() => import('@/app/shared/table-footer'), {
  ssr: false,
});

const filterState = {
  amount: ['', ''],
  createdAt: [null, null],
  dueDate: [null, null],
  status: '',
};

const statusOptions = [
  {
    value: 'Paid',
    label: 'Paid',
  },
  {
    value: 'pending',
    label: 'Pending',
  },
  {
    value: 'overdue',
    label: 'Overdue',
  },
  {
    value: 'draft',
    label: 'Draft',
  },
];

export default function TheaterComplexTable({ data = [] }: { data: any[] }) {
  const [pageSize, setPageSize] = useState(10);
  const [cinema, setCinema] = useState();

  const [cinemaSystems, setCinemaSystems] = useState([]);
  const [theaterComplexes, setTheaterComplexes] = useState([]);
  useEffect(() => {
    const fetchCinema = async () => {
      const { data } = await axios.get(API_CINEMA_SYSTEM + '/cinemaSystem');
      setCinemaSystems(
        data.map((cinema: { name: any; _id: any }) => ({
          value: cinema._id,
          label: cinema.name,
        }))
      );
    };
    fetchCinema();
  }, []);

  useEffect(() => {
    const cinemaSelectedId = cinemaSystems?.find(
      (cine) => cine.label == cinema
    )?.value;
    console.log();
    const fetchTheaterComplex = async () => {
      const { data } = await axios.get(
        API_CINEMA_SYSTEM + '/theaterComplex/cinema/' + cinemaSelectedId
      );
      setTheaterComplexes(
        data.map((theaterComplex: {}) => ({
          id: theaterComplex._id,
          name: theaterComplex.name,
          status: 'paid',
          email: theaterComplex.address,
          avatar: theaterComplex.image,
          createdAt: theaterComplex.createdAt,
        }))
      );
    };
    if (cinemaSelectedId) {
      fetchTheaterComplex();
    }
  }, [cinema]);

  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });

  const onDeleteItem = useCallback((id: string) => {
    handleDelete(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    isLoading,
    isFiltered,
    tableData,
    currentPage,
    totalItems,
    handlePaginate,
    filters,
    updateFilter,
    searchTerm,
    handleSearch,
    sortConfig,
    handleSort,
    selectedRowKeys,
    setSelectedRowKeys,
    handleRowSelect,
    handleSelectAll,
    handleDelete,
    handleReset,
  } = useTable(theaterComplexes, pageSize, filterState);

  const columns = React.useMemo(
    () =>
      getColumns({
        data,
        sortConfig,
        checkedItems: selectedRowKeys,
        onHeaderCellClick,
        onDeleteItem,
        onChecked: handleRowSelect,
        handleSelectAll,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedRowKeys,
      onHeaderCellClick,
      sortConfig.key,
      sortConfig.direction,
      onDeleteItem,
      handleRowSelect,
      handleSelectAll,
    ]
  );

  const { visibleColumns, checkedColumns, setCheckedColumns } =
    useColumn(columns);

  return (
    <>
      <ControlledTable
        variant="modern"
        data={tableData}
        isLoading={isLoading}
        showLoadingText={true}
        // @ts-ignore
        columns={visibleColumns}
        paginatorOptions={{
          pageSize,
          setPageSize,
          total: totalItems,
          current: currentPage,
          onChange: (page: number) => handlePaginate(page),
        }}
        filterOptions={{
          searchTerm,
          onSearchClear: () => {
            handleSearch('');
          },
          onSearchChange: (event) => {
            handleSearch(event.target.value);
          },
          hasSearched: isFiltered,
          columns,
          checkedColumns,
          setCheckedColumns,
        }}
        filterElement={
          // <FilterElement
          //   isFiltered={isFiltered}
          //   filters={filters}
          //   updateFilter={updateFilter}
          //   handleReset={handleReset}
          // />
          <CinemaField
            options={cinemaSystems}
            value={cinema}
            onChange={(value) => {
              // updateFilter('status', value);
              setCinema(value);
            }}
            getOptionValue={(option: { value: any }) => option.label}
            getOptionDisplayValue={(option: { value: any; label: any }) =>
              renderOptionDisplayValue(option.label as string)
            }
            displayValue={(selected: string) =>
              renderOptionDisplayValue(selected)
            }
            dropdownClassName="!z-10"
            className={'w-auto'}
          />
        }
        tableFooter={
          <TableFooter
            checkedItems={selectedRowKeys}
            handleDelete={(ids: string[]) => {
              setSelectedRowKeys([]);
              handleDelete(ids);
            }}
          >
            <Button size="sm" className="dark:bg-gray-300 dark:text-gray-800">
              Re-send {selectedRowKeys.length}{' '}
              {selectedRowKeys.length > 1 ? 'Invoices' : 'Invoice'}{' '}
            </Button>
          </TableFooter>
        }
        className="rounded-md border border-muted text-sm shadow-sm [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:h-60 [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:justify-center [&_.rc-table-row:last-child_td.rc-table-cell]:border-b-0 [&_thead.rc-table-thead]:border-t-0"
      />
    </>
  );
}
