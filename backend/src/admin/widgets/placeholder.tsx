import { defineWidgetConfig } from "@medusajs/admin-sdk"

const PlaceholderWidget = () => {
  return null
}

export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default PlaceholderWidget