import { z } from "zod"

export const createListProductsQueryType = z.object({
  fields: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  handle: z.union([z.string(), z.array(z.string())]).optional(),
  category_id: z.union([z.string(), z.array(z.string())]).optional(),
  collection_id: z.union([z.string(), z.array(z.string())]).optional(),
  type_id: z.union([z.string(), z.array(z.string())]).optional(),
  tag_id: z.union([z.string(), z.array(z.string())]).optional(),
  sales_channel_id: z.union([z.string(), z.array(z.string())]).optional(),
  region_id: z.string().optional(),
  currency_code: z.string().optional(),
})