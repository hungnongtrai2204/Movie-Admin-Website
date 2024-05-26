'use client';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { Button } from 'rizzui';
import PageHeader from '@/app/shared/page-header';
import OrdersTable from '@/app/shared/ecommerce/order/order-list/table';
import { PiPlusBold } from 'react-icons/pi';
import { orderData } from '@/data/order-data';
import { metaObject } from '@/config/site.config';
import ExportButton from '@/app/shared/export-button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_TICKET } from '@/API';

// export const metadata = {
//   ...metaObject('Orders'),
// };

const pageHeader = {
  title: 'Đơn Hàng',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Đơn Hàng',
    },
    {
      href: routes.eCommerce.orders,
      name: 'Danh Sách Đơn Hàng',
    },
    {
      name: 'Danh Sách',
    },
  ],
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const calcTotalPrice = (price, listSeat) => {
      let total = 0;
      for (const seat of listSeat) {
        total += price * (seat.seatType == 'Thuong' ? 1 : 2);
      }
      return total;
    };
    const fetchAllTicket = async () => {
      setIsLoading(true);
      const { data } = await axios.get(API_TICKET + '/ticket');
      console.log(data);
      setOrders(
        data.map((ticket) => ({
          id: ticket.ticketId,
          name: ticket.userName,
          email: ticket.email,
          movieImage: ticket.movieImage,
          movieName: ticket.movieName,
          theatercomplex: ticket.listSeat[0].theaterComplexName,
          theater: ticket.listSeat[0].theaterName,
          avatar:
            'https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-15.webp',
          items: 83,
          price: calcTotalPrice(ticket.price, ticket.listSeat),
          status: 'Cancelled',
          createdAt: ticket.premiereDate,
          updatedAt: '2023-08-10T22:39:21.113Z',
          products: ticket.listSeat.map((seat) => ({
            id: seat.seatId,
            name: 'Ghế: ' + seat.seatName,
            category: seat.seatType == 'Thuong' ? 'Loại: Thường' : 'Loại: Vip',
            image: ticket.movieImage,
            price: seat.seatType == 'Thuong' ? ticket.price : 2 * ticket.price,
            quantity: 1,
          })),
        }))
      );
      setIsLoading(false);
    };
    fetchAllTicket();
  }, []);
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton
            data={orderData}
            fileName="order_data"
            header="Order ID,Name,Email,Avatar,Items,Price,Status,Created At,Updated At"
          />
          <Link
            href={routes.eCommerce.createProduct}
            className="w-full @lg:w-auto"
          >
            <Button as="span" className="w-full @lg:w-auto">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Thêm Đơn Hàng
            </Button>
          </Link>
        </div>
      </PageHeader>

      {isLoading ? <div>Loading...</div> : <OrdersTable data={orders} />}
    </>
  );
}
