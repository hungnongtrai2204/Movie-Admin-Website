'use client';

import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import { routes } from '@/config/routes';
import { Button } from 'rizzui';
import PageHeader from '@/app/shared/page-header';
import ProductsTable from '@/app/shared/ecommerce/product/product-list/table';
import { productsData } from '@/data/products-data';
import { metaObject } from '@/config/site.config';
import ExportButton from '@/app/shared/export-button';
import MoviesTable from '@/app/shared/ecommerce/product/product-list/movie-table';
import { useEffect, useState } from 'react';
import { API_MOVIE } from '@/API.js';
import axios from 'axios';
import TheaterComplexTable from '@/app/shared/invoice/invoice-list/theater-complex-table';
import { invoiceData } from '@/data/invoice-data';
import TheaterTable from '@/app/shared/invoice/invoice-list/theater-table';
import SeatTable from '@/app/shared/invoice/invoice-list/seat-table';
import ShowtimeTable from '@/app/shared/invoice/invoice-list/showtime-table';

// export const metadata = {
//   ...metaObject('Products'),
// };

const pageHeader = {
  title: 'Danh Sách Lịch Chiếu Theo Phim',
  breadcrumb: [
    {
      href: routes.showtime.dashboard,
      name: 'Lịch Chiếu',
    },
    {
      href: routes.showtime.showtimes,
      name: 'Danh Sách Lịch Chiếu Theo Phim',
    },
    {
      name: 'Danh Sách',
    },
  ],
};

export default function ProductsPage() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    const fetchMovie = async () => {
      const { data } = await axios.get(API_MOVIE + '/movies');
      setMovies(
        data.map(
          (movie: {
            openingDay: any;
            nowShowing: any;
            rating: any;
            alias: any;
            image: any;
            name: any;
            _id: any;
          }) => ({
            id: movie._id,
            name: movie.name,
            category: 'Category',
            image: movie.image,
            sku: movie.alias,
            openingDay: movie.openingDay,
            status: movie.nowShowing ? 'showing' : 'soon',
            rating: [movie.rating - 5],
          })
        )
      );
    };
    fetchMovie();
  }, []);

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton
            data={movies}
            fileName="movie_data"
            header="ID,Tên,Danh Mục,Hình Đại Diện,Alias,Ngày Phát Hàng,Trạng Thái,Đánh Giá"
          />
          <Link href={routes.seat.createSeat} className="w-full @lg:w-auto">
            <Button as="span" className="w-full @lg:w-auto">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Thêm Lịch Chiếu
            </Button>
          </Link>
        </div>
      </PageHeader>

      {movies.length > 0 && <ShowtimeTable data={invoiceData} />}
    </>
  );
}
