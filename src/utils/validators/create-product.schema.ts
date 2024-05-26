import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema } from '@/utils/validators/common-rules';

export const productFormSchema = z.object({
  title: z.string().optional(),
  sku: z.string().optional(),
  type: z.string({ required_error: messages.productTypeIsRequired }).optional(),
  categories: z.string().optional(),
  movies: z.string().optional(),
  theater: z.string().optional(),
  theaterId: z.string().optional(),
  description: z.string().optional(),
  productImages: z.array(fileSchema).optional(),
  price: z.coerce.number().optional(),
  costPrice: z.coerce.number().optional(),
  retailPrice: z.coerce.number().optional(),
  salePrice: z.coerce.number().optional(),
  inventoryTracking: z.string().optional(),
  currentStock: z.number().or(z.string()).optional(),
  lowStock: z.number().or(z.string()).optional(),
  productAvailability: z.string().optional(),
  tradeNumber: z.number().or(z.string()).optional(),
  manufacturerNumber: z.number().or(z.string()).optional(),
  brand: z.string().optional(),
  upcEan: z.number().or(z.string()).optional(),
  customFields: z
    .array(
      z.object({
        label: z.string().optional(),
        value: z.string().optional(),
      })
    )
    .optional(),

  freeShipping: z.boolean().optional(),
  shippingPrice: z.coerce.number().optional(),
  locationBasedShipping: z.boolean().optional(),
  locationShipping: z
    .array(
      z.object({
        name: z.string().optional(),
        shippingCharge: z.number().or(z.string()).optional(),
      })
    )
    .optional(),
  pageTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  productUrl: z.string().optional(),
  isPurchaseSpecifyDate: z.boolean().optional(),
  isLimitDate: z.boolean().optional(),
  dateFieldName: z.string().optional(),
  availableDate: z.date().optional(),
  endDate: z.date().optional(),
  productVariants: z
    .array(
      z.object({
        name: z.string().optional(),
        value: z.string().optional(),
      })
    )
    .optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateProductInput = z.infer<typeof productFormSchema>;
