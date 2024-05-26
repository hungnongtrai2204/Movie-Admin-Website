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
import { API_CINEMA_SYSTEM, API_MOVIE } from '@/API.js';
import axios from 'axios';
import CinemasTable from '@/app/shared/ecommerce/product/product-list/cinema-table';

// export const metadata = {
//   ...metaObject('Products'),
// };

const pageHeader = {
  title: 'Danh Sách Hệ Thống Rạp',
  breadcrumb: [
    {
      href: routes.cinemaSystem.dashboard,
      name: 'Hệ Thống Rạp',
    },
    {
      href: routes.cinemaSystem.cinemasystems,
      name: 'Danh Sách Hệ Thống Rạp',
    },
    {
      name: 'Danh Sách',
    },
  ],
};

export default function ProductsPage() {
  const [cinemaSystems, setCinemaSystems] = useState([]);
  useEffect(() => {
    const fetchCinema = async () => {
      const { data } = await axios.get(API_CINEMA_SYSTEM + '/cinemaSystem');
      console.log(data);
      setCinemaSystems(
        data.map(
          (cinema: {
            createdAt: any;
            nowShowing: any;
            rating: any;
            aliases: any;
            logo: any;
            name: any;
            _id: any;
          }) => ({
            id: cinema._id,
            name: cinema.name,
            category: 'Category',
            image: cinema.logo,
            sku: cinema.aliases,
            openingDay: cinema.createdAt,
            status: 'showing',
            rating: [9 - 5],
          })
        )
      );
    };
    fetchCinema();
  }, []);

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton
            data={cinemaSystems}
            fileName="movie_data"
            header="ID,Tên,Danh Mục,Hình Đại Diện,Alias,Ngày Phát Hàng,Trạng Thái,Đánh Giá"
          />
          <Link
            href={routes.cinemaSystem.createCinemaSystem}
            className="w-full @lg:w-auto"
          >
            <Button as="span" className="w-full @lg:w-auto">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Thêm Hệ Thống Rạp
            </Button>
          </Link>
        </div>
      </PageHeader>

      {cinemaSystems.length > 0 && <CinemasTable data={cinemaSystems} />}
    </>
  );
}
