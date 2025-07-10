'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProductCard } from '@/components/product/product-card';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Filter, Grid3X3, List, SlidersHorizontal, Loader2 } from 'lucide-react';
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
  inStock?: boolean;
}

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.category as string;
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchProducts({ category: categoryId, limit: 100 });
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch products');
        }
        
        const categoryProducts = result.data?.products || [];
        const enhancedProducts = categoryProducts.map((p: Product) => ({
          ...p,
          inStock: p.stock > 0
        }));
        
        setProducts(enhancedProducts);
      } catch (err) {
        console.error('Error fetching category products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryProducts();
    }
  }, [categoryId]);

  useEffect(() => {
    let filtered = [...products];
    
    // Filter by price range
    filtered = filtered.filter((product: Product) => {
      const finalPrice = product.discount 
        ? product.price * (1 - product.discount / 100)
        : product.price;
      return finalPrice >= priceRange[0] && finalPrice <= priceRange[1];
    });
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a: Product, b: Product) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a: Product, b: Product) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceB - priceA;
        });
        break;
      case 'rating':
        filtered.sort((a: Product, b: Product) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a: Product, b: Product) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
      default:
        break;
    }
    
    setFilteredProducts(filtered);
  }, [products, priceRange, selectedBrands, sortBy]);

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
          <h1 className="text-2xl font-bold">Error Loading Category</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 capitalize">
          {categoryId}
        </Badge>
        <h1 className="heading-xl text-balance">
          Premium <span className="text-gradient capitalize">{categoryId}</span> Components
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          Discover our comprehensive collection of high-quality {categoryId.toLowerCase()} 
          components designed for professional automation and electronics projects.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className={`lg:w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPriceRange([0, 10000]);
                    setSelectedBrands([]);
                  }}
                >
                  Clear All
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  max={10000}
                  min={0}
                  step={100}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold capitalize">{categoryId}</h2>
              <p className="text-muted-foreground">
                {filteredProducts.length} products found
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-6'
            }>
              {filteredProducts.map((product: Product, index: number) => (
                <div key={product._id} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or browse other categories
                </p>
                <Button onClick={() => {
                  setPriceRange([0, 10000]);
                  setSelectedBrands([]);
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}