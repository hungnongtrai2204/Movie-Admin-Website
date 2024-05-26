'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Element } from 'react-scroll';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { Text } from 'rizzui';
import cn from '@/utils/class-names';
import FormNav, {
  formParts,
} from '@/app/shared/ecommerce/cinema/create-edit/form-nav';
import ProductSummary from '@/app/shared/ecommerce/cinema/create-edit/product-summary';
import { defaultValues } from '@/app/shared/ecommerce/cinema/create-edit/form-utils';
import ProductMedia from '@/app/shared/ecommerce/cinema/create-edit/product-media';
import PricingInventory from '@/app/shared/ecommerce/cinema/create-edit/pricing-inventory';
import ProductIdentifiers from '@/app/shared/ecommerce/cinema/create-edit/product-identifiers';
import ShippingInfo from '@/app/shared/ecommerce/cinema/create-edit/shipping-info';
import ProductSeo from '@/app/shared/ecommerce/cinema/create-edit/product-seo';
import DeliveryEvent from '@/app/shared/ecommerce/cinema/create-edit/delivery-event';
import ProductVariants from '@/app/shared/ecommerce/cinema/create-edit/product-variants';
import ProductTaxonomies from '@/app/shared/ecommerce/cinema/create-edit/product-tags';
import FormFooter from '@/components/form-footer';
import {
  CreateProductInput,
  productFormSchema,
} from '@/utils/validators/create-product.schema';
import { useLayout } from '@/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/config/enums';
import axios from 'axios';
import { API_CINEMA_SYSTEM, API_MOVIE } from '@/API.js';

const MAP_STEP_TO_COMPONENT = {
  [formParts.summary]: ProductSummary,
  [formParts.media]: ProductMedia,
};

interface IndexProps {
  slug?: string;
  className?: string;
  product?: CreateProductInput;
}

export default function CreateEditProduct({
  slug,
  product,
  className,
}: IndexProps) {
  const { layout } = useLayout();
  const [isLoading, setLoading] = useState(false);
  const methods = useForm<CreateProductInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues(product),
  });

  const onSubmit: SubmitHandler<CreateProductInput> = (data) => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      // console.log('product_data', data);

      const res = await axios.post(API_CINEMA_SYSTEM + '/cinemaSystem', {
        name: data.title,
        logo: data?.productImages?.[0].url,
      });

      console.log('data', res);

      toast.success(
        <Text as="b">{slug ? 'Cập nhập' : 'Thêm'} hệ thống rạp thành công</Text>
      );
      methods.reset();
    }, 600);
  };

  return (
    <div className="@container">
      <FormNav
        className={cn(
          layout === LAYOUT_OPTIONS.BERYLLIUM && 'z-[999] 2xl:top-[72px]'
        )}
      />
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className={cn(
            'relative z-[19] [&_label.block>span]:font-medium',
            className
          )}
        >
          <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
            {Object.entries(MAP_STEP_TO_COMPONENT).map(([key, Component]) => (
              <Element
                key={key}
                name={formParts[key as keyof typeof formParts]}
              >
                {<Component className="pt-7 @2xl:pt-9 @3xl:pt-11" />}
              </Element>
            ))}
          </div>

          <FormFooter
            isLoading={isLoading}
            submitBtnText={slug ? 'Cập Nhập Hệ Thống Rạp' : 'Thêm Hệ Thống Rạp'}
          />
        </form>
      </FormProvider>
    </div>
  );
}
