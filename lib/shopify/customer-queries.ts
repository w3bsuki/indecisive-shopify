// Customer authentication and account queries/mutations for Shopify Storefront API

// Fragment for customer data reusability
const CUSTOMER_FRAGMENT = `
  id
  email
  firstName
  lastName
  displayName
  phone
  acceptsMarketing
  defaultAddress {
    id
    address1
    address2
    city
    province
    provinceCode
    country
    countryCodeV2
    zip
    phone
    firstName
    lastName
  }
`;

// Fragment for customer access token
const CUSTOMER_ACCESS_TOKEN_FRAGMENT = `
  accessToken
  expiresAt
`;

// Mutations
export const CUSTOMER_ACCESS_TOKEN_CREATE = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        ${CUSTOMER_ACCESS_TOKEN_FRAGMENT}
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_RENEW = `
  mutation customerAccessTokenRenew($customerAccessToken: String!) {
    customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
      customerAccessToken {
        ${CUSTOMER_ACCESS_TOKEN_FRAGMENT}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_DELETE = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`;

export const CUSTOMER_CREATE = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        ${CUSTOMER_FRAGMENT}
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

export const CUSTOMER_UPDATE = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        ${CUSTOMER_FRAGMENT}
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

export const CUSTOMER_RECOVER = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

export const CUSTOMER_RESET_BY_URL = `
  mutation customerResetByUrl($resetUrl: String!, $password: String!) {
    customerResetByUrl(resetUrl: $resetUrl, password: $password) {
      customer {
        ${CUSTOMER_FRAGMENT}
      }
      customerAccessToken {
        ${CUSTOMER_ACCESS_TOKEN_FRAGMENT}
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

export const CUSTOMER_ADDRESS_CREATE = `
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
        address1
        address2
        city
        province
        provinceCode
        country
        countryCodeV2
        zip
        phone
        firstName
        lastName
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

export const CUSTOMER_ADDRESS_UPDATE = `
  mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        id
        address1
        address2
        city
        province
        provinceCode
        country
        countryCodeV2
        zip
        phone
        firstName
        lastName
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

export const CUSTOMER_ADDRESS_DELETE = `
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

export const CUSTOMER_DEFAULT_ADDRESS_UPDATE = `
  mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
      customer {
        ${CUSTOMER_FRAGMENT}
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

// Queries
export const CUSTOMER_QUERY = `
  query customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      ${CUSTOMER_FRAGMENT}
      addresses(first: 10) {
        edges {
          node {
            id
            address1
            address2
            city
            province
            provinceCode
            country
            countryCodeV2
            zip
            phone
            firstName
            lastName
          }
        }
      }
    }
  }
`;

export const CUSTOMER_ORDERS_QUERY = `
  query customerOrders($customerAccessToken: String!, $first: Int!, $after: String) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      orders(first: $first, after: $after) {
        edges {
          node {
            id
            orderNumber
            processedAt
            fulfillmentStatus
            financialStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            totalShippingPrice {
              amount
              currencyCode
            }
            subtotalPrice {
              amount
              currencyCode
            }
            totalTax {
              amount
              currencyCode
            }
            lineItems(first: 100) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                      width
                      height
                    }
                    product {
                      handle
                    }
                  }
                }
              }
            }
            shippingAddress {
              address1
              address2
              city
              province
              provinceCode
              country
              countryCodeV2
              zip
              firstName
              lastName
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
`;

// Single order query
export const CUSTOMER_ORDER_QUERY = `
  query customerOrder($customerAccessToken: String!, $id: ID!) {
    node(id: $id) {
      ... on Order {
        id
        orderNumber
        processedAt
        fulfillmentStatus
        financialStatus
        currentTotalPrice {
          amount
          currencyCode
        }
        totalShippingPrice {
          amount
          currencyCode
        }
        subtotalPrice {
          amount
          currencyCode
        }
        totalTax {
          amount
          currencyCode
        }
        lineItems(first: 100) {
          edges {
            node {
              title
              quantity
              variant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                  width
                  height
                }
                product {
                  handle
                }
              }
            }
          }
        }
        shippingAddress {
          address1
          address2
          city
          province
          provinceCode
          country
          countryCodeV2
          zip
          firstName
          lastName
        }
      }
    }
  }
`;

// Validate customer access token
export const VALIDATE_CUSTOMER_ACCESS_TOKEN = `
  query validateCustomerAccessToken($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
    }
  }
`;

// Customer Metafield Fragment for reusability
const CUSTOMER_METAFIELD_FRAGMENT = `
  id
  namespace
  key
  value
  type
  updatedAt
`;

// Customer Metafield Queries
export const CUSTOMER_METAFIELDS_QUERY = `
  query customerMetafields($customerAccessToken: String!, $namespace: String, $keys: [String!]) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      metafields(namespace: $namespace, keys: $keys, first: 100) {
        edges {
          node {
            ${CUSTOMER_METAFIELD_FRAGMENT}
          }
        }
      }
    }
  }
`;

export const CUSTOMER_METAFIELD_QUERY = `
  query customerMetafield($customerAccessToken: String!, $namespace: String!, $key: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      metafield(namespace: $namespace, key: $key) {
        ${CUSTOMER_METAFIELD_FRAGMENT}
      }
    }
  }
`;

// Customer Metafield Mutations
export const CUSTOMER_METAFIELD_UPSERT = `
  mutation customerMetafieldUpsert($customerAccessToken: String!, $metafield: CustomerMetafieldInput!) {
    customerMetafieldUpsert(customerAccessToken: $customerAccessToken, metafield: $metafield) {
      metafield {
        ${CUSTOMER_METAFIELD_FRAGMENT}
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export const CUSTOMER_METAFIELD_DELETE = `
  mutation customerMetafieldDelete($customerAccessToken: String!, $metafieldId: ID!) {
    customerMetafieldDelete(customerAccessToken: $customerAccessToken, metafieldId: $metafieldId) {
      deletedMetafieldId
      userErrors {
        field
        message
        code
      }
    }
  }
`;