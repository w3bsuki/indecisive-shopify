import { storefront } from './storefront-client';
import { logger } from '../logger';
import {
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_ACCESS_TOKEN_RENEW,
  CUSTOMER_ACCESS_TOKEN_DELETE,
  CUSTOMER_CREATE,
  CUSTOMER_UPDATE,
  CUSTOMER_RECOVER,
  CUSTOMER_RESET_BY_URL,
  CUSTOMER_QUERY,
  CUSTOMER_ORDERS_QUERY,
  CUSTOMER_ORDER_QUERY,
  VALIDATE_CUSTOMER_ACCESS_TOKEN,
  CUSTOMER_ADDRESS_CREATE,
  CUSTOMER_ADDRESS_UPDATE,
  CUSTOMER_ADDRESS_DELETE,
  CUSTOMER_DEFAULT_ADDRESS_UPDATE,
  CUSTOMER_METAFIELDS_QUERY,
  CUSTOMER_METAFIELD_QUERY,
  CUSTOMER_METAFIELD_UPSERT,
  CUSTOMER_METAFIELD_DELETE
} from './customer-queries';
import type { Money, Image } from './storefront-client';

// Customer types
export interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

export interface CustomerAddress {
  id: string;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  province?: string | null;
  provinceCode?: string | null;
  country?: string | null;
  countryCodeV2?: string | null;
  zip?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export interface Customer {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName: string;
  phone?: string | null;
  acceptsMarketing: boolean;
  defaultAddress?: CustomerAddress | null;
  addresses?: {
    edges: Array<{
      node: CustomerAddress;
    }>;
  };
}

export interface CustomerUserError {
  field?: string[] | null;
  message: string;
  code?: string;
}

// Customer Metafield types
export interface CustomerMetafield {
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
  updatedAt: string;
}

export interface CustomerMetafieldInput {
  namespace: string;
  key: string;
  value: string;
  type?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  processedAt: string;
  fulfillmentStatus: string;
  financialStatus: string;
  currentTotalPrice: Money;
  totalShippingPrice?: Money;
  subtotalPrice?: Money;
  totalTax?: Money;
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        variant?: {
          id: string;
          title: string;
          price: Money;
          image?: Image;
          product: {
            handle: string;
          };
        };
      };
    }>;
  };
  shippingAddress?: CustomerAddress;
}

// Response types
export interface CustomerAuthResult {
  success: boolean;
  customerAccessToken?: CustomerAccessToken;
  customer?: Customer;
  errors?: CustomerUserError[];
}

export interface CustomerResult {
  success: boolean;
  customer?: Customer;
  errors?: CustomerUserError[];
}

export interface AddressResult {
  success: boolean;
  address?: CustomerAddress;
  errors?: CustomerUserError[];
}

export interface MetafieldResult {
  success: boolean;
  metafield?: CustomerMetafield;
  errors?: CustomerUserError[];
}

export interface MetafieldsResult {
  success: boolean;
  metafields?: CustomerMetafield[];
  errors?: CustomerUserError[];
}

// Authentication functions
export async function authenticateCustomer(
  email: string,
  password: string
): Promise<CustomerAuthResult> {
  try {
    const { customerAccessTokenCreate } = await storefront<{
      customerAccessTokenCreate: {
        customerAccessToken?: CustomerAccessToken;
        customerUserErrors: CustomerUserError[];
      };
    }>(CUSTOMER_ACCESS_TOKEN_CREATE, {
      input: { email, password }
    });

    if (customerAccessTokenCreate.customerUserErrors.length > 0) {
      return {
        success: false,
        errors: customerAccessTokenCreate.customerUserErrors
      };
    }

    return {
      success: true,
      customerAccessToken: customerAccessTokenCreate.customerAccessToken
    };
  } catch (error) {
    logger.error('Shopify authentication error:', error);
    return {
      success: false,
      errors: [{ message: 'Authentication failed. Please try again.' }]
    };
  }
}

export async function renewCustomerToken(
  accessToken: string
): Promise<CustomerAuthResult> {
  try {
    const { customerAccessTokenRenew } = await storefront<{
      customerAccessTokenRenew: {
        customerAccessToken?: CustomerAccessToken;
        userErrors: CustomerUserError[];
      };
    }>(CUSTOMER_ACCESS_TOKEN_RENEW, {
      customerAccessToken: accessToken
    });

    if (customerAccessTokenRenew.userErrors.length > 0) {
      return {
        success: false,
        errors: customerAccessTokenRenew.userErrors
      };
    }

    return {
      success: true,
      customerAccessToken: customerAccessTokenRenew.customerAccessToken
    };
  } catch (_error) {
    return {
      success: false,
      errors: [{ message: 'Token renewal failed.' }]
    };
  }
}

export async function logoutCustomer(
  accessToken: string
): Promise<{ success: boolean; errors?: CustomerUserError[] }> {
  try {
    const { customerAccessTokenDelete } = await storefront<{
      customerAccessTokenDelete: {
        deletedAccessToken?: string;
        userErrors: CustomerUserError[];
      };
    }>(CUSTOMER_ACCESS_TOKEN_DELETE, {
      customerAccessToken: accessToken
    });

    if (customerAccessTokenDelete.userErrors.length > 0) {
      return {
        success: false,
        errors: customerAccessTokenDelete.userErrors
      };
    }

    return { success: true };
  } catch (_error) {
    return {
      success: false,
      errors: [{ message: 'Logout failed.' }]
    };
  }
}

export async function createCustomer(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
  acceptsMarketing: boolean = false
): Promise<CustomerAuthResult> {
  try {
    const { customerCreate } = await storefront<{
      customerCreate: {
        customer?: Customer;
        customerUserErrors: CustomerUserError[];
      };
    }>(CUSTOMER_CREATE, {
      input: {
        email,
        password,
        firstName,
        lastName,
        acceptsMarketing
      }
    });

    if (customerCreate.customerUserErrors.length > 0) {
      return {
        success: false,
        errors: customerCreate.customerUserErrors
      };
    }

    return {
      success: true,
      customer: customerCreate.customer
    };
  } catch (_error) {
    return {
      success: false,
      errors: [{ message: 'Registration failed. Please try again.' }]
    };
  }
}

export async function updateCustomer(
  accessToken: string,
  updates: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    acceptsMarketing?: boolean;
  }
): Promise<CustomerResult> {
  try {
    const { customerUpdate } = await storefront<{
      customerUpdate: {
        customer?: Customer;
        customerUserErrors: CustomerUserError[];
      };
    }>(CUSTOMER_UPDATE, {
      customerAccessToken: accessToken,
      customer: updates
    });

    if (customerUpdate.customerUserErrors.length > 0) {
      return {
        success: false,
        errors: customerUpdate.customerUserErrors
      };
    }

    return {
      success: true,
      customer: customerUpdate.customer
    };
  } catch (_error) {
    return {
      success: false,
      errors: [{ message: 'Update failed. Please try again.' }]
    };
  }
}

export async function recoverCustomerPassword(
  email: string
): Promise<{ success: boolean; errors?: CustomerUserError[] }> {
  try {
    const { customerRecover } = await storefront<{
      customerRecover: {
        customerUserErrors: CustomerUserError[];
      };
    }>(CUSTOMER_RECOVER, { email });

    if (customerRecover.customerUserErrors.length > 0) {
      return {
        success: false,
        errors: customerRecover.customerUserErrors
      };
    }

    return { success: true };
  } catch (_error) {
    return {
      success: false,
      errors: [{ message: 'Password recovery failed. Please try again.' }]
    };
  }
}

export async function resetCustomerPassword(
  resetUrl: string,
  password: string
): Promise<CustomerAuthResult> {
  try {
    const { customerResetByUrl } = await storefront<{
      customerResetByUrl: {
        customer?: Customer;
        customerAccessToken?: CustomerAccessToken;
        customerUserErrors: CustomerUserError[];
      };
    }>(CUSTOMER_RESET_BY_URL, {
      resetUrl,
      password
    });

    if (customerResetByUrl.customerUserErrors.length > 0) {
      return {
        success: false,
        errors: customerResetByUrl.customerUserErrors
      };
    }

    return {
      success: true,
      customer: customerResetByUrl.customer,
      customerAccessToken: customerResetByUrl.customerAccessToken
    };
  } catch (_error) {
    return {
      success: false,
      errors: [{ message: 'Password reset failed. Please try again.' }]
    };
  }
}

// Customer data fetching
export async function getCustomer(accessToken: string): Promise<Customer | null> {
  try {
    const { customer } = await storefront<{
      customer: Customer;
    }>(CUSTOMER_QUERY, {
      customerAccessToken: accessToken
    });

    return customer;
  } catch (_error) {
    return null;
  }
}

export async function getCustomerOrders(
  accessToken: string,
  first: number = 10,
  after?: string
): Promise<{
  orders: Order[];
  pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
} | null> {
  try {
    const { customer } = await storefront<{
      customer: {
        id: string;
        orders: {
          edges: Array<{ node: Order; cursor: string }>;
          pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
        };
      };
    }>(CUSTOMER_ORDERS_QUERY, {
      customerAccessToken: accessToken,
      first,
      after
    });

    if (!customer || !customer.orders) {
      return null;
    }

    return {
      orders: customer.orders.edges.map(edge => edge.node),
      pageInfo: customer.orders.pageInfo
    };
  } catch (_error) {
    return null;
  }
}

export async function getCustomerOrder(
  accessToken: string,
  orderId: string
): Promise<Order | null> {
  try {
    const { node } = await storefront<{
      node: Order;
    }>(CUSTOMER_ORDER_QUERY, {
      customerAccessToken: accessToken,
      id: orderId
    });

    return node;
  } catch (_error) {
    return null;
  }
}

export async function validateCustomerToken(accessToken: string): Promise<boolean> {
  try {
    const { customer } = await storefront<{
      customer: { id: string } | null;
    }>(VALIDATE_CUSTOMER_ACCESS_TOKEN, {
      customerAccessToken: accessToken
    });

    return !!customer;
  } catch (_error) {
    return false;
  }
}

// Address management
export async function createCustomerAddress(
  accessToken: string,
  address: Omit<CustomerAddress, 'id'>
): Promise<AddressResult> {
  try {
    const { customerAddressCreate } = await storefront<{
      customerAddressCreate: {
        customerAddress?: CustomerAddress;
        customerUserErrors: CustomerUserError[];
      };
    }>(CUSTOMER_ADDRESS_CREATE, {
      customerAccessToken: accessToken,
      address
    });

    if (customerAddressCreate.customerUserErrors.length > 0) {
      return {
        success: false,
        errors: customerAddressCreate.customerUserErrors
      };
    }

    return {
      success: true,
      address: customerAddressCreate.customerAddress
    };
  } catch (_error) {
    return {
      success: false,
      errors: [{ message: 'Failed to create address.' }]
    };
  }
}

export async function updateCustomerAddress(
  accessToken: string,
  addressId: string,
  address: Omit<CustomerAddress, 'id'>
): Promise<AddressResult> {
  try {
    const { customerAddressUpdate } = await storefront<{
      customerAddressUpdate: {
        customerAddress?: CustomerAddress;
        customerUserErrors: CustomerUserError[];
      };
    }>(CUSTOMER_ADDRESS_UPDATE, {
      customerAccessToken: accessToken,
      id: addressId,
      address
    });

    if (customerAddressUpdate.customerUserErrors.length > 0) {
      return {
        success: false,
        errors: customerAddressUpdate.customerUserErrors
      };
    }

    return {
      success: true,
      address: customerAddressUpdate.customerAddress
    };
  } catch (_error) {
    return {
      success: false,
      errors: [{ message: 'Failed to update address.' }]
    };
  }
}

export async function deleteCustomerAddress(
  accessToken: string,
  addressId: string
): Promise<{ success: boolean; errors?: CustomerUserError[] }> {
  try {
    const { customerAddressDelete } = await storefront<{
      customerAddressDelete: {
        deletedCustomerAddressId?: string;
        customerUserErrors: CustomerUserError[];
      };
    }>(CUSTOMER_ADDRESS_DELETE, {
      customerAccessToken: accessToken,
      id: addressId
    });

    if (customerAddressDelete.customerUserErrors.length > 0) {
      return {
        success: false,
        errors: customerAddressDelete.customerUserErrors
      };
    }

    return { success: true };
  } catch (_error) {
    return {
      success: false,
      errors: [{ message: 'Failed to delete address.' }]
    };
  }
}

export async function setDefaultCustomerAddress(
  accessToken: string,
  addressId: string
): Promise<CustomerResult> {
  try {
    const { customerDefaultAddressUpdate } = await storefront<{
      customerDefaultAddressUpdate: {
        customer?: Customer;
        customerUserErrors: CustomerUserError[];
      };
    }>(CUSTOMER_DEFAULT_ADDRESS_UPDATE, {
      customerAccessToken: accessToken,
      addressId
    });

    if (customerDefaultAddressUpdate.customerUserErrors.length > 0) {
      return {
        success: false,
        errors: customerDefaultAddressUpdate.customerUserErrors
      };
    }

    return {
      success: true,
      customer: customerDefaultAddressUpdate.customer
    };
  } catch (_error) {
    return {
      success: false,
      errors: [{ message: 'Failed to set default address.' }]
    };
  }
}

// Customer Metafield functions
export async function getCustomerMetafields(
  accessToken: string,
  namespace?: string,
  keys?: string[]
): Promise<MetafieldsResult> {
  try {
    const { customerMetafields } = await storefront<{
      customerMetafields: {
        customer: {
          id: string;
          metafields: {
            edges: Array<{
              node: CustomerMetafield;
            }>;
          };
        };
      };
    }>(CUSTOMER_METAFIELDS_QUERY, {
      customerAccessToken: accessToken,
      namespace,
      keys
    });

    const metafields = customerMetafields.customer?.metafields.edges.map(edge => edge.node) || [];

    return {
      success: true,
      metafields
    };
  } catch (_error) {
    return {
      success: false,
      errors: [{ message: 'Failed to fetch customer metafields.' }]
    };
  }
}

export async function getCustomerMetafield(
  accessToken: string,
  namespace: string,
  key: string
): Promise<MetafieldResult> {
  try {
    const { customerMetafield } = await storefront<{
      customerMetafield: {
        customer: {
          id: string;
          metafield: CustomerMetafield | null;
        };
      };
    }>(CUSTOMER_METAFIELD_QUERY, {
      customerAccessToken: accessToken,
      namespace,
      key
    });

    return {
      success: true,
      metafield: customerMetafield.customer?.metafield || undefined
    };
  } catch (_error) {
    return {
      success: false,
      errors: [{ message: 'Failed to fetch customer metafield.' }]
    };
  }
}

export async function upsertCustomerMetafield(
  accessToken: string,
  metafield: CustomerMetafieldInput
): Promise<MetafieldResult> {
  try {
    const { customerMetafieldUpsert } = await storefront<{
      customerMetafieldUpsert: {
        metafield: CustomerMetafield | null;
        userErrors: CustomerUserError[];
      };
    }>(CUSTOMER_METAFIELD_UPSERT, {
      customerAccessToken: accessToken,
      metafield: {
        ...metafield,
        type: metafield.type || 'single_line_text_field' // Default type
      }
    });

    if (customerMetafieldUpsert.userErrors.length > 0) {
      return {
        success: false,
        errors: customerMetafieldUpsert.userErrors
      };
    }

    return {
      success: true,
      metafield: customerMetafieldUpsert.metafield || undefined
    };
  } catch (_error) {
    return {
      success: false,
      errors: [{ message: 'Failed to upsert customer metafield.' }]
    };
  }
}

export async function deleteCustomerMetafield(
  accessToken: string,
  metafieldId: string
): Promise<{ success: boolean; errors?: CustomerUserError[] }> {
  try {
    const { customerMetafieldDelete } = await storefront<{
      customerMetafieldDelete: {
        deletedMetafieldId: string | null;
        userErrors: CustomerUserError[];
      };
    }>(CUSTOMER_METAFIELD_DELETE, {
      customerAccessToken: accessToken,
      metafieldId
    });

    if (customerMetafieldDelete.userErrors.length > 0) {
      return {
        success: false,
        errors: customerMetafieldDelete.userErrors
      };
    }

    return {
      success: true
    };
  } catch (_error) {
    return {
      success: false,
      errors: [{ message: 'Failed to delete customer metafield.' }]
    };
  }
}