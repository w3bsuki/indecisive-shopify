export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale?: boolean;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange?: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  images?: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyProductVariant;
    }>;
  };
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  seo?: {
    title?: string;
    description?: string;
  };
  tags?: string[];
  featuredImage?: ShopifyImage;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice?: Money;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image?: ShopifyImage;
}

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: ShopifyImage;
  products?: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
    pageInfo: PageInfo;
  };
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor?: string;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount?: Money;
  };
  lines: {
    edges: Array<{
      node: CartLine;
    }>;
  };
}

export interface CartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    price: Money;
    product: {
      id: string;
      title: string;
      handle: string;
      featuredImage?: ShopifyImage;
    };
  };
}

export interface ProductsResponse {
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
    pageInfo: PageInfo;
  };
}

export interface ProductResponse {
  product: ShopifyProduct;
}

export interface CollectionsResponse {
  collections: {
    edges: Array<{
      node: ShopifyCollection;
    }>;
  };
}

export interface CollectionProductsResponse {
  collection: ShopifyCollection;
}

export interface CartCreateResponse {
  cartCreate: {
    cart: ShopifyCart;
    userErrors: Array<{
      field?: string[];
      message: string;
    }>;
  };
}

export interface CartMutationResponse {
  cart: ShopifyCart;
  userErrors: Array<{
    field?: string[];
    message: string;
  }>;
}