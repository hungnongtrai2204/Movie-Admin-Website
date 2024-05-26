import { Controller, useFormContext } from 'react-hook-form';
import { Input } from 'rizzui';
import cn from '@/utils/class-names';
import FormGroup from '@/app/shared/form-group';
import {
  categoryOption,
  typeOption,
} from '@/app/shared/ecommerce/product/create-edit/form-utils';
import dynamic from 'next/dynamic';
import SelectLoader from '@/components/loader/select-loader';
import QuillLoader from '@/components/loader/quill-loader';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_CINEMA_SYSTEM } from '@/API';
const Select = dynamic(() => import('rizzui').then((mod) => mod.Select), {
  ssr: false,
  loading: () => <SelectLoader />,
});
const QuillEditor = dynamic(() => import('@/components/ui/quill-editor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[143px]" />,
});

export default function ProductSummary({ className }: { className?: string }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const [cinemaSystems, setCinemaSystems] = useState([]);
  const [theaterComplexes, setTheaterComplexes] = useState([]);
  const [theaters, setTheaters] = useState([]);

  const [cinemaSelect, setCinemaSelect] = useState(null);
  const [theaterComplexSelect, setTheaterComplexSelect] = useState(null);
  const [theaterIdSelect, setTheaterIdSelect] = useState(null);

  const categoryOption = [
    {
      value: 'fruits',
      label: 'Fruits',
    },
    {
      value: 'grocery',
      label: 'Grocery',
    },
    {
      value: 'meat',
      label: 'Meat',
    },
    {
      value: 'cat food',
      label: 'Cat Food',
    },
  ];

  useEffect(() => {
    const fetchCinema = async () => {
      const { data } = await axios.get(API_CINEMA_SYSTEM + '/cinemaSystem');
      setCinemaSystems(
        data.map((cinema: { name: any; _id: any }) => ({
          value: cinema.name,
          label: cinema.name,
          id: cinema._id,
        }))
      );
    };
    fetchCinema();
  }, []);

  useEffect(() => {
    const cinemaId = cinemaSystems.find(
      (cinema) => cinema.value == cinemaSelect
    )?.id;
    console.log(cinemaId);
    const fetchTheaterComplex = async () => {
      const { data } = await axios.get(
        API_CINEMA_SYSTEM + '/theaterComplex/cinema/' + cinemaId
      );
      setTheaterComplexes(
        data.map((theaterComp) => ({
          value: theaterComp.name,
          label: theaterComp.name,
          id: theaterComp._id,
        }))
      );
    };
    if (cinemaId) {
      fetchTheaterComplex();
    }
  }, [cinemaSelect]);

  useEffect(() => {
    const theaterComplexId = theaterComplexes.find(
      (theaterComp) => theaterComp.value == theaterComplexSelect
    )?.id;
    const fetchTheater = async () => {
      const { data } = await axios.get(
        API_CINEMA_SYSTEM + '/theaterComplex/theaterlist/' + theaterComplexId
      );
      setTheaters(
        data.map((theater) => ({
          value: theater.name,
          label: theater.name,
          id: theater._id,
        }))
      );
    };
    if (theaterComplexId) {
      fetchTheater();
    }
  }, [theaterComplexSelect]);

  console.log('SELECT', cinemaSelect, theaterComplexSelect);

  return (
    <FormGroup
      title="Sơ lược"
      description="Chỉnh sửa mô tả ghế của bạn và thông tin cần thiết từ đây"
      className={cn(className)}
    >
      <Input
        label="Tên"
        placeholder="Tên ghế"
        {...register('title')}
        error={errors.title?.message as string}
      />

      <Controller
        name="categories"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            options={cinemaSystems}
            value={value}
            onChange={(value) => {
              onChange(value);
              setCinemaSelect(value);
              setTheaterComplexSelect(null);
              setTheaterIdSelect(null);
            }}
            label="Danh sách hệ thống rạp"
            error={errors?.categories?.message as string}
            getOptionValue={(option) => option.value}
            inPortal={false}
          />
        )}
      />

      <Controller
        name="type"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            dropdownClassName="!z-0"
            options={theaterComplexes}
            value={value}
            onChange={(value) => {
              onChange(value);
              setTheaterComplexSelect(value);
              setTheaterIdSelect(null);
            }}
            label="Danh sách cụm rạp"
            error={errors?.type?.message as string}
            getOptionValue={(option) => option.value}
          />
        )}
      />

      <Controller
        name="theater"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            dropdownClassName="!z-0"
            options={theaters}
            value={value}
            onChange={(value) => {
              onChange(value);
              for (const theater of theaters) {
                if (theater.value == value) {
                  setTheaterIdSelect(theater.id);
                  break;
                }
              }
            }}
            label="Danh sách rạp"
            error={errors?.type?.message as string}
            getOptionValue={(option) => option.value}
          />
        )}
      />
      {/* <div style={{ display: '' }}>
        {theaterIdSelect && (
          <Controller
            name="theaterId"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                dropdownClassName="!z-0"
                options={theaters}
                value={theaterIdSelect}
                // onChange={(value) => {
                //   onChange(value);
                // }}
                label="Danh sách rạp"
                error={errors?.type?.message as string}
                getOptionValue={(option) => option.id}
                getOptionDisplayValue={(option) => option.id}
              />
            )}
          />
        )}
      </div> */}

      {/* <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <QuillEditor
            value={value}
            onChange={onChange}
            label="Mô Tả"
            className="col-span-full [&_.ql-editor]:min-h-[100px]"
            labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
          />
        )}
      /> */}

      {theaterIdSelect && theaterIdSelect != '' && (
        <Input
          label="Mã rạp"
          placeholder="Mã Rạp"
          {...register('sku')}
          value={theaterIdSelect}
          autoFocus
          error={errors.sku?.message as string}
        />
      )}
    </FormGroup>
  );
}
