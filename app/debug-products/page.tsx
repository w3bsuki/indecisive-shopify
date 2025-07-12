import { getProducts } from '@/lib/shopify/api';

export default async function DebugProductsPage() {
  try {
    // Fetch all products without any filters
    const productsData = await getProducts(100);
    const products = productsData.edges.map(edge => edge.node);
    
    // Extract unique tags
    const allTags = new Set<string>();
    
    products.forEach(product => {
      product.tags?.forEach(tag => allTags.add(tag));
    });
    
    // Log to server console
    console.log('=== PRODUCT DEBUG INFO ===');
    console.log('Total products:', products.length);
    console.log('Unique tags:', Array.from(allTags));
    console.log('=== SAMPLE PRODUCTS ===');
    products.slice(0, 5).forEach(product => {
      console.log({
        title: product.title,
        tags: product.tags,
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
          <p>Unique tags: {allTags.size}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">All Tags</h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(allTags).map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Sample Products</h2>
          <div className="space-y-4">
            {products.slice(0, 10).map(product => (
              <div key={product.id} className="border-b pb-2">
                <p><strong>Title:</strong> {product.title}</p>
                <p><strong>Tags:</strong> {product.tags?.join(', ') || 'No tags'}</p>
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