'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/product-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, SlidersHorizontal, Loader2 } from 'lucide-react';
import { fetchProducts } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  discount?: number;
  stock: number;
  description?: string;
  inStock?: boolean;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState('all');
  const [category, setCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchProducts({ limit: 200 });
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch products');
        }
        
        const allProducts = result.data?.products || [];
        const enhancedProducts = allProducts.map((p: Product) => ({
          ...p,
          inStock: p.stock > 0
        }));
        
        setProducts(enhancedProducts);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(enhancedProducts.map((p: Product) => p.category)));
        setCategories(uniqueCategories);
        
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter((product: Product) => {
    const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = category === 'all' || product.category === category;
    
    const finalPrice = product.discount 
      ? product.price * (1 - product.discount / 100)
      : product.price;
    
    let matchesPrice = true;
    if (priceRange === 'under-500') matchesPrice = finalPrice < 500;
    else if (priceRange === '500-1000') matchesPrice = finalPrice >= 500 && finalPrice <= 1000;
    else if (priceRange === '1000-2000') matchesPrice = finalPrice >= 1000 && finalPrice <= 2000;
    else if (priceRange === 'over-2000') matchesPrice = finalPrice > 2000;
    
    return matchesQuery && matchesCategory && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a: Product, b: Product) => {
    switch (sortBy) {
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
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSortBy('relevance');
    setPriceRange('all');
    setCategory('all');
  };

  const activeFiltersCount = [
    sortBy !== 'relevance',
    priceRange !== 'all',
    category !== 'all'
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold">Error Loading Search</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Search Results</h1>
          {searchQuery && (
            <p className="text-muted-foreground mt-2">
              Showing {sortedProducts.length} results for "{searchQuery}"
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className={`lg:w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Filters
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="mr-1 h-3 w-3" />
                    Clear
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat: string) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under-500">Under ₹500</SelectItem>
                    <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                    <SelectItem value="1000-2000">₹1,000 - ₹2,000</SelectItem>
                    <SelectItem value="over-2000">Over ₹2,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {sortBy !== 'relevance' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Sort: {sortBy}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSortBy('relevance')} />
                </Badge>
              )}
              {category !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {category}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setCategory('all')} />
                </Badge>
              )}
              {priceRange !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Price: {priceRange}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange('all')} />
                </Badge>
              )}
            </div>
          )}

          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((product: Product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or filters
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}