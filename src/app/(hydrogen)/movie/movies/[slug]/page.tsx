import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import ProductDetails from '@/app/shared/ecommerce/product/product-details';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Product Details'),
};

export default function ProductDetailsPage({ params }: any) {
  const pageHeader = {
    title: 'Phim',
    breadcrumb: [
      {
        href: routes.movie.dashboard,
        name: 'Phim',
      },
      {
        href: routes.movie.movies,
        name: 'Shop',
      },
      {
        name: params.slug,
      },
    ],
  };
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ProductDetails />
    </>
  );
}
