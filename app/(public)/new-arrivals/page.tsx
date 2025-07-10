'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/product/product-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, TrendingUp, Clock, Star, Loader2 } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand: string;
  sku: string;
  stock: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductWithArrival extends Product {
  arrivalDate: Date;
}

interface ApiResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const highlights = [
  {
    icon: Sparkles,
    title: 'Latest Technology',
    description: 'Cutting-edge components with advanced features',
    color: 'text-blue-600'
  },
  {
    icon: TrendingUp,
    title: 'Trending Now',
    description: 'Most popular new products among customers',
    color: 'text-green-600'
  },
  {
    icon: Clock,
    title: 'Just Launched',
    description: 'Fresh arrivals from top manufacturers',
    color: 'text-purple-600'
  },
  {
    icon: Star,
    title: 'Premium Quality',
    description: 'Handpicked products for exceptional performance',
    color: 'text-orange-600'
  }
];

export default function NewArrivalsPage() {
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<ProductWithArrival[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get recent products (last 30 days) by sorting by creation date
        const response = await fetch('/api/products?sortBy=createdAt&sortOrder=desc&limit=12');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data: ApiResponse = await response.json();
        
        // Transform products to include arrival date (using createdAt as arrival date)
        const productsWithArrival: ProductWithArrival[] = data.products.map((product: Product) => ({
          ...product,
          arrivalDate: new Date(product.createdAt),
          inStock: product.stock > 0, // Add inStock property for compatibility
        }));
        
        setProducts(productsWithArrival);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Sort products based on selected sort option
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.arrivalDate.getTime() - a.arrivalDate.getTime();
      case 'price-low':
        const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
        return priceA - priceB;
      case 'price-high':
        const priceA2 = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        const priceB2 = b.discount ? b.price * (1 - b.discount / 100) : b.price;
        return priceB2 - priceA2;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-accent/10 text-accent border-accent/20 px-4 py-2">
          New Arrivals
        </Badge>
        <h1 className="heading-xl text-balance">
          Latest <span className="text-gradient">Innovations</span> in Automation
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          Discover the newest additions to our catalog featuring cutting-edge technology, 
          innovative designs, and premium quality components from leading manufacturers.
        </p>
      </div>

      {/* Highlights */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {highlights.map((highlight, index) => {
          const Icon = highlight.icon;
          return (
            <Card key={index} className="card-hover text-center fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full">
                    <Icon className={`h-6 w-6 ${highlight.color}`} />
                  </div>
                </div>
                <h3 className="font-semibold">{highlight.title}</h3>
                <p className="text-sm text-muted-foreground">{highlight.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">All New Arrivals</h2>
          <p className="text-muted-foreground">
            {loading ? 'Loading products...' : `${sortedProducts.length} products found`}
          </p>
        </div>
        
        <Select value={sortBy} onValueChange={setSortBy} disabled={loading}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading new arrivals...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="font-semibold text-destructive mb-2">Error Loading Products</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product: ProductWithArrival, index: number) => (
              <div key={product._id} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No New Arrivals Yet</h3>
                <p>Check back soon for our latest products!</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Newsletter CTA */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-8 text-center space-y-4">
          <Sparkles className="h-12 w-12 text-primary mx-auto" />
          <h3 className="text-2xl font-bold">Stay Updated with New Arrivals</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Be the first to know about our latest products, exclusive launches, and special offers. 
            Subscribe to our newsletter for early access to new arrivals.
          </p>
          <Button size="lg" className="btn-gradient">
            Subscribe for Updates
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}