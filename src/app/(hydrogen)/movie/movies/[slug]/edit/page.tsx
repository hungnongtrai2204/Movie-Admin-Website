'use client';

import Link from 'next/link';
import { Metadata } from 'next';
import { PiPlusBold } from 'react-icons/pi';
import { productData } from '@/app/shared/ecommerce/product/create-edit/form-utils';
import CreateEditProduct from '@/app/shared/ecommerce/product/create-edit';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import { Button } from 'rizzui';
import { routes } from '@/config/routes';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_MOVIE } from '@/API';
import { url } from 'inspector';

type Props = {
  params: { slug: string };
};

/**
 * for dynamic metadata
 * @link: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   // read route params
//   const slug = params.slug;

//   return metaObject(`Edit ${slug}`);
// }

const pageHeader = {
  title: 'Chỉnh Sửa Phim',
  breadcrumb: [
    {
      href: routes.movie.dashboard,
      name: 'Phim',
    },
    {
      href: routes.movie.movies,
      name: 'Danh Sách Phim',
    },
    {
      name: 'Chỉnh Sửa',
    },
  ],
};

export default function EditProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const [movie, setMovie] = useState();
  useEffect(() => {
    const fetchMovieByid = async () => {
      console.log(params.slug);
      const { data } = await axios.get(API_MOVIE + '/movies/' + params.slug);
      console.log('data', data.movie);
      setMovie({
        title: data.movie.name,
        // productImages: [
        //   {
        //     url: 'https://movienew.cybersoft.edu.vn/hinhanh/mai-2024_gp01.jpg',
        //   },
        // ],
      });
    };
    fetchMovieByid();
  }, []);
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.movie.createMovie}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Thêm Phim
          </Button>
        </Link>
      </PageHeader>

      {movie && <CreateEditProduct slug={params.slug} product={movie} />}
    </>
  );
}
