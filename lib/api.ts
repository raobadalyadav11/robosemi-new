interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ProductsResponse {
  products: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function fetchProducts(params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  featured?: string;
} = {}): Promise<ApiResponse<ProductsResponse>> {
  try {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`/api/products?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch products'
    };
  }
}

export async function fetchBestSellers(): Promise<ApiResponse<ProductsResponse>> {
  try {
    // Fetch products with high ratings and review counts for best sellers
    const response = await fetch('/api/products?sortBy=rating&sortOrder=desc&limit=50');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch best sellers'
    };
  }
}

export async function fetchFeaturedProducts(): Promise<ApiResponse<ProductsResponse>> {
  return fetchProducts({ featured: 'true', limit: 50 });
}

export async function fetchDealsProducts(): Promise<ApiResponse<ProductsResponse>> {
  try {
    // Fetch all products and filter for those with discounts on the client side
    // since the API doesn't have a direct discount filter
    const response = await fetch('/api/products?limit=100');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filter products with discounts
    const dealsProducts = data.products.filter((product: any) => 
      product.discount && product.discount > 0
    );
    
    return {
      success: true,
      data: {
        ...data,
        products: dealsProducts
      }
    };
  } catch (error) {
    console.error('Error fetching deals:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch deals'
    };
  }
}