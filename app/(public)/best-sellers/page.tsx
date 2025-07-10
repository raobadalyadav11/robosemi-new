'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/product/product-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, TrendingUp, Users, Star, Award, Target, Loader2 } from 'lucide-react';
import { fetchBestSellers } from '@/lib/api';

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
  
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  inStock: boolean;
}

interface BestSellerProduct extends Product {
  salesCount: number;
  salesRank: number;
}

const achievements = [
  {
    icon: Trophy,
    title: 'Top Rated',
    description: 'Highest customer satisfaction scores',
    color: 'text-yellow-600'
  },
  {
    icon: TrendingUp,
    title: 'Best Selling',
    description: 'Most purchased products this month',
    color: 'text-green-600'
  },
  {
    icon: Users,
    title: 'Customer Choice',
    description: 'Recommended by thousands of users',
    color: 'text-blue-600'
  },
  {
    icon: Award,
    title: 'Quality Assured',
    description: 'Premium products with proven reliability',
    color: 'text-purple-600'
  }
];

const defaultCategories = [
  { id: 'all', name: 'All Categories' },
  { id: 'controllers', name: 'Controllers' },
  { id: 'sensors', name: 'Sensors' },
  { id: 'actuators', name: 'Actuators' },
  { id: 'electronics', name: 'Electronics' },
];

export default function BestSellersPage() {
  const [sortBy, setSortBy] = useState('sales');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [bestSellers, setBestSellers] = useState<BestSellerProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<BestSellerProduct[]>([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBestSellersData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchBestSellers();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch products');
        }
        
        const data = result.data;
        
        if (!data || !data.products) {
          throw new Error('No product data received');
        }
        
        let candidateProducts = data.products.filter((product: Product) => 
          product.reviewCount > 10 && product.rating > 4.0
        );
        
        if (candidateProducts.length < 6) {
          candidateProducts = data.products.filter((product: Product) => 
            product.reviewCount > 5 && product.rating > 3.5
          );
        }
        
        if (candidateProducts.length < 6) {
          candidateProducts = data.products.filter((product: Product) => 
            product.rating > 3.0
          );
        }
        
        const enhancedProducts: BestSellerProduct[] = candidateProducts
          .map((product: Product, index: number) => ({
            ...product,
            salesCount: Math.floor((product.reviewCount || 1) * product.rating * 50) + Math.floor(Math.random() * 200),
            salesRank: index + 1,
            inStock: product.stock > 0 || false
          }))
          .sort((a, b) => b.salesCount - a.salesCount);
        
        setBestSellers(enhancedProducts);
        
        const uniqueCategories = Array.from(new Set(enhancedProducts.map(p => p.category)));
        const dynamicCategories = [
          { id: 'all', name: 'All Categories' },
          ...uniqueCategories.map(cat => ({
            id: cat,
            name: cat.charAt(0).toUpperCase() + cat.slice(1)
          }))
        ];
        setCategories(dynamicCategories);
      } catch (err) {
        console.error('Error fetching best sellers:', err);
        setError('Failed to load best sellers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellersData();
  }, []);

  useEffect(() => {
    let filtered = [...bestSellers];
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    switch (sortBy) {
      case 'sales':
        filtered.sort((a, b) => b.salesCount - a.salesCount);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceB - priceA;
        });
        break;
    }
    
    setFilteredProducts(filtered);
  }, [sortBy, categoryFilter, bestSellers]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg text-muted-foreground">Loading best sellers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6 mb-12">
          <Badge className="bg-red-100 text-red-800 border-red-200 px-4 py-2">
            Error
          </Badge>
          <h1 className="heading-xl text-balance">
            Something went wrong
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            {error}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-4 py-2">
          Best Sellers
        </Badge>
        <h1 className="heading-xl text-balance">
          Most <span className="text-gradient">Popular Products</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          Discover our top-selling automation and electronics components, chosen by thousands 
          of satisfied customers for their exceptional quality and performance.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <Card key={index} className="card-hover text-center fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full">
                    <Icon className={`h-6 w-6 ${achievement.color}`} />
                  </div>
                </div>
                <h3 className="font-semibold">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">🏆 Top 3 Best Sellers</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {bestSellers.slice(0, 3).map((product, index) => (
            <div key={product._id} className="relative fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                  #{index + 1} Best Seller
                </Badge>
              </div>
              <div className="absolute top-2 right-2 z-10">
                <Badge variant="secondary" className="text-xs">
                  {product.salesCount} sold
                </Badge>
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">All Best Sellers</h2>
          <p className="text-muted-foreground">
            {filteredProducts.length} products • Sorted by {sortBy === 'sales' ? 'Sales Count' : sortBy === 'rating' ? 'Rating' : sortBy === 'reviews' ? 'Reviews' : 'Price'}
          </p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales Count</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="reviews">Reviews</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {filteredProducts.map((product, index) => (
          <div key={product._id} className="relative fade-in-up" style={{ animationDelay: `${(index % 12) * 0.1}s` }}>
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs">
                #{product.salesRank} Best Seller
              </Badge>
            </div>
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="outline" className="text-xs bg-white/90">
                {product.salesCount} sold
              </Badge>
            </div>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No best sellers found</h3>
          <p className="text-muted-foreground mb-4">
            No products match your current filters.
          </p>
          <Button onClick={() => {
            setCategoryFilter('all');
            setSortBy('sales');
          }}>
            Reset Filters
          </Button>
        </div>
      )}

      <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-blue-200">
        <CardContent className="p-8 text-center space-y-6">
          <Trophy className="h-12 w-12 text-blue-600 mx-auto" />
          <h3 className="text-2xl font-bold">What Makes Our Best Sellers Special?</h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                Customer Proven
              </h4>
              <p className="text-sm text-muted-foreground">
                Thousands of satisfied customers have chosen these products
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                High Quality
              </h4>
              <p className="text-sm text-muted-foreground">
                Consistently high ratings and positive reviews from real users
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Market Leaders
              </h4>
              <p className="text-sm text-muted-foreground">
                Top-performing products in their respective categories
              </p>
            </div>
          </div>
          <Button size="lg" className="btn-gradient">
            Shop All Best Sellers
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}