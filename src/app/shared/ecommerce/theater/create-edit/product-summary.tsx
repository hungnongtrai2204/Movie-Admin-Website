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

  const [cinemaSelect, setCinemaSelect] = useState(null);

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

  return (
    <FormGroup
      title="Sơ lược"
      description="Chỉnh sửa mô tả rạp của bạn và thông tin cần thiết từ đây"
      className={cn(className)}
    >
      <Input
        label="Tên"
        placeholder="Tên rạp"
        {...register('title')}
        error={errors.title?.message as string}
      />
      {/* <Input
        label="Địa Chỉ"
        placeholder="Địa Chỉ Cụm Rạp"
        {...register('sku')}
        error={errors.sku?.message as string}
      /> */}

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
            }}
            label="Danh sách cụm rạp"
            error={errors?.type?.message as string}
            getOptionValue={(option) => option.value}
          />
        )}
      />

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
    </FormGroup>
  );
}
