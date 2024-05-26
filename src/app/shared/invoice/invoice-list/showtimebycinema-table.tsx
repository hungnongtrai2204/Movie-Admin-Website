'use client';

import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTable } from '@/hooks/use-table';
import { useColumn } from '@/hooks/use-column';
import { Button } from 'rizzui';
import ControlledTable from '@/components/controlled-table';
import { getColumns } from '@/app/shared/invoice/invoice-list/showtimebycinema-columns';
import CinemaField from '@/components/controlled-table/cinema-field';
import { renderOptionDisplayValue } from '../form-utils';
import { API_CINEMA_SYSTEM, API_MOVIE, API_SHOWTIME } from '@/API';
import axios from 'axios';
import TheaterComplexField from '@/components/controlled-table/theater-complex-field';
import TheaterField from '@/components/controlled-table/theater-field';
import MovieField from '@/components/controlled-table/movie-field';
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

export default function ShowtimeByCinemaTable({ data = [] }: { data: any[] }) {
  const [pageSize, setPageSize] = useState(10);

  const [cinemaSystems, setCinemaSystems] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaterComplexes, setTheaterComplexes] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [showtimes, setShowtimes] = useState([]);

  const [cinema, setCinema] = useState();
  const [theaterComplex, setTheaterComplex] = useState();
  const [theater, setTheater] = useState();
  const [movie, setMovie] = useState();

  useEffect(() => {
    const fetchCinema = async () => {
      const { data } = await axios.get(API_CINEMA_SYSTEM + '/cinemaSystem');
      setCinemaSystems(
        data.map((cinema: { name: any; _id: any }) => ({
          value: cinema._id,
          label: cinema.name,
        }))
      );
      setCinema(data[0].name);
    };
    fetchCinema();
  }, []);

  useEffect(() => {
    const fetchMovie = async () => {
      const { data } = await axios.get(API_MOVIE + '/movies');
      setMovies(
        data.map((movie: { name: any; _id: any }) => ({
          value: movie._id,
          label: movie.name,
        }))
      );
    };
    fetchMovie();
  }, []);

  useEffect(() => {
    const cinemaSelectedId = cinemaSystems?.find(
      (cine) => cine.label == cinema
    )?.value;
    const fetchTheaterComplex = async () => {
      const { data } = await axios.get(
        API_CINEMA_SYSTEM + '/theaterComplex/cinema/' + cinemaSelectedId
      );
      setTheaterComplexes(
        data.map((theaterComplex: {}) => ({
          value: theaterComplex._id,
          label: theaterComplex.name,
        }))
      );
      setTheaterComplex(null);
      setTheaters([]);
    };
    const fetchShowtimByCinema = async () => {
      const { data } = await axios.get(
        API_CINEMA_SYSTEM + '/cinemaSystem/showtimes/' + cinemaSelectedId
      );
      const showTimesList = [];
      for (const theaterComplex of data.lstTheaterComplexes) {
        for (const m of theaterComplex.listMovie) {
          for (const show of m.showtimesByMovie) {
            console.log('Show', show);
            showTimesList.push({
              id: show.showtimesId,
              name: m.movieName,
              status: show.isDone ? 'Đã chiếu' : 'Chưa chiếu',
              type: '',
              avatar: m.movieImage,
              createdAt: show.premiereDate,
              userName: show.theaterName,
              showtimeId: show.showtimesId,
              price: show.ticketPrice,
              cinemaName: data.cinema.name,
              theaterComplexName: theaterComplex.theaterComplexName,
            });
          }
        }
      }
      setShowtimes(showTimesList);
    };
    if (cinemaSelectedId) {
      fetchTheaterComplex();
      fetchShowtimByCinema();
    }
  }, [cinema]);

  useEffect(() => {
    const theaterComplexId = theaterComplexes?.find(
      (theaterCom) => theaterCom.label == theaterComplex
    )?.value;
    const fetchTheater = async () => {
      const { data } = await axios.get(
        API_CINEMA_SYSTEM + '/theaterComplex/theaterlist/' + theaterComplexId
      );
      // console.log(data);
      setTheaters(
        data.map((theater: {}) => ({
          value: theater._id,
          label: theater.name,
        }))
      );
    };
    if (theaterComplexId) {
      fetchTheater();
    }
  }, [theaterComplex]);

  // useEffect(() => {
  //   const theaterId = theaters?.find((thea) => thea.label == theater)?.value;
  //   const fetchSeat = async () => {
  //     const { data } = await axios.get(
  //       API_CINEMA_SYSTEM + '/seat/theater/' + theaterId
  //     );
  //     console.log('SEAT', data);
  //     setSeats(
  //       data.map((seat: {}) => ({
  //         id: seat._id,
  //         name: seat.name,
  //         status: seat.isBook ? 'Đã đặt' : 'Còn trống',
  //         type: seat.type,
  //         avatar: '',
  //         createdAt: seat.createdAt,
  //         userName: seat?.user?.fullname,
  //       }))
  //     );
  //   };
  //   if (theaterId) {
  //     fetchSeat();
  //   }
  // }, [theater]);

  useEffect(() => {
    const fetchShowtimes = async () => {
      const { data } = await axios.get(API_SHOWTIME + '/showtimes');
      setShowtimes(
        data.map((showtime: {}) => ({
          id: showtime._id,
          name: showtime.movieName,
          status: showtime.isDone ? 'Đã chiếu' : 'Chưa chiếu',
          type: '',
          avatar: showtime.movieImage,
          createdAt: showtime.premiereDate,
          userName: showtime.theaterName,
          showtimeId: showtime._id,
          price: showtime.ticketPrice,
        }))
      );
    };

    const fetchShowtimesByMovie = async (movieId) => {
      const { data } = await axios.get(
        API_SHOWTIME + '/showtimes/movie/' + movieId
      );
      setShowtimes(
        data.map((showtime: {}) => ({
          id: showtime._id,
          name: showtime.movieName,
          status: showtime.isDone ? 'Đã chiếu' : 'Chưa chiếu',
          type: '',
          avatar: showtime.movieImage,
          createdAt: showtime.premiereDate,
          userName: showtime.theaterName,
          showtimeId: showtime._id,
          price: showtime.ticketPrice,
        }))
      );
    };

    if (movie && movie != '') {
      const movieId = movies?.find((m) => m.label == movie)?.value;
      fetchShowtimesByMovie(movieId);
    } else {
      fetchShowtimes();
    }
  }, [movie]);

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
  } = useTable(showtimes, pageSize, filterState);

  const columns = React.useMemo(
    () =>
      getColumns({
        showtimes,
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
        // data={[]}
        isLoading={isLoading}
        showLoadingText={true}
        // @ts-ignore
        columns={visibleColumns}
        paginatorOptions={{
          pageSize,
          setPageSize,
          total: showtimes?.length,
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
          <>
            <CinemaField
              options={cinemaSystems}
              value={cinema}
              onChange={(value) => {
                // updateFilter('status', value);
                setCinema(value);
                setTheater(null);
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
            {/* <TheaterComplexField
              options={theaterComplexes}
              value={theaterComplex}
              onChange={(value) => {
                // updateFilter('status', value);
                setTheaterComplex(value);
                setTheater(null);
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
            /> */}
            {/* <TheaterField
              options={theaters}
              value={theater}
              onChange={(value) => {
                // updateFilter('status', value);
                setTheater(value);
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
            /> */}
            {/* <MovieField
              options={movies}
              value={movie}
              onChange={(value) => {
                setMovie(value);
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
            /> */}
          </>
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
