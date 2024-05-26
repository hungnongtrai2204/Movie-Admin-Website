import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import CreateEditProduct from '@/app/shared/ecommerce/seat/create-edit';
import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui';
import { routes } from '@/config/routes';

export const metadata = {
  ...metaObject('Create Product'),
};

const pageHeader = {
  title: 'Thêm Lịch Chiếu Phim',
  breadcrumb: [
    {
      href: routes.showtime.dashboard,
      name: 'Lịch Chiếu Phim',
    },
    {
      href: routes.showtime.showtimes,
      name: 'Danh Sách Lịch Chiếu Phim',
    },
    {
      name: 'Thêm',
    },
  ],
};

export default function CreateProductPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.showtime.createShowtime}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Thêm Lịch Chiếu Phim
          </Button>
        </Link>
      </PageHeader>

      <CreateEditProduct />
    </>
  );
}
