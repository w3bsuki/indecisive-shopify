import { getProducts } from '@/lib/shopify/api';

export default async function DebugProductsPage() {
  try {
    // Fetch all products without any filters
    const products = await getProducts({});
    
    // Extract unique product types
    const productTypes = new Set<string>();
    const productTypeCount: Record<string, number> = {};
    
    products.forEach(product => {
      const type = product.productType || 'NO_TYPE';
      productTypes.add(type);
      productTypeCount[type] = (productTypeCount[type] || 0) + 1;
    });
    
    // Log to server console
    console.log('=== PRODUCT DEBUG INFO ===');
    console.log('Total products:', products.length);
    console.log('Unique product types:', Array.from(productTypes));
    console.log('Product type counts:', productTypeCount);
    console.log('=== SAMPLE PRODUCTS ===');
    products.slice(0, 5).forEach(product => {
      console.log({
        title: product.title,
        productType: product.productType,
        handle: product.handle,
        id: product.id
      });
    });
    
    return (
      <div className="container mx-auto p-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Product Debug Information</h1>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Summary</h2>
          <p>Total products: {products.length}</p>
          <p>Unique product types: {productTypes.size}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Product Types</h2>
          <ul className="list-disc list-inside">
            {Array.from(productTypes).map(type => (
              <li key={type}>
                <strong>{type || 'NO_TYPE'}</strong>: {productTypeCount[type]} products
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Sample Products</h2>
          <div className="space-y-4">
            {products.slice(0, 10).map(product => (
              <div key={product.id} className="border-b pb-2">
                <p><strong>Title:</strong> {product.title}</p>
                <p><strong>Type:</strong> {product.productType || 'NO_TYPE'}</p>
                <p><strong>Handle:</strong> {product.handle}</p>
                <p className="text-xs text-gray-500">ID: {product.id}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
          <p className="text-sm">Check the server console for detailed debug information.</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-600">Failed to fetch products. Check console for details.</p>
      </div>
    );
  }
}