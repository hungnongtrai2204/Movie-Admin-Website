'use client';

import FileDashboard from '@/app/shared/file/dashboard';
import { metaObject } from '@/config/site.config';
import JobDashboard from '../shared/job-dashboard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_CINEMA_SYSTEM, API_MOVIE, API_SHOWTIME, API_TICKET } from '@/API';

// export const metadata = {
//   ...metaObject(),
// };

export default function FileDashboardPage() {
  const [movies, setMovies] = useState([]);
  const [cinemaSystems, setCinemaSystems] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const calcTotalPrice = (price, listSeat) => {
    let total = 0;
    for (const seat of listSeat) {
      total += price * (seat.seatType == 'Thuong' ? 1 : 2);
    }
    return total;
  };
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
    const fetchAllTicket = async () => {
      const { data } = await axios.get(API_TICKET + '/ticket');
      console.log('Order', data);
      setIsLoading(true);

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

    fetchMovie();
    fetchCinema();
    fetchShowtimes();
  }, []);
  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <JobDashboard
        movies={movies}
        cinemaSystems={cinemaSystems}
        showtimes={showtimes}
        orders={orders}
      />
    );
  }
}
