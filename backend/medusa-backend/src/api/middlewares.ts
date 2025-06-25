import type { MiddlewaresConfig } from "@medusajs/framework/http"
import { validateAndTransformQuery } from "@medusajs/framework/utils"
import { createListProductsQueryType } from "./validators/list-products"

export const config: MiddlewaresConfig = {
  routes: [
    {
      method: ["GET"],
      matcher: "/store/products",
      middlewares: [
        validateAndTransformQuery(
          createListProductsQueryType,
          {
            defaults: {
              fields: "*variants",
              limit: 50,
              offset: 0,
            },
            isList: true,
          }
        ),
      ],
    },
  ],
}