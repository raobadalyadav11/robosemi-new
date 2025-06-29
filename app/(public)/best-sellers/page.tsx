'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/product/product-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, TrendingUp, Users, Star, Award, Target } from 'lucide-react';
import { sampleProducts } from '@/lib/data';

const bestSellers = sampleProducts
  .filter(product => product.reviews > 150)
  .map(product => ({
    ...product,
    salesCount: Math.floor(Math.random() * 1000) + 500,
    salesRank: Math.floor(Math.random() * 10) + 1
  }))
  .sort((a, b) => b.salesCount - a.salesCount);

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

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'controllers', name: 'Controllers' },
  { id: 'sensors', name: 'Sensors' },
  { id: 'actuators', name: 'Actuators' },
  { id: 'electronics', name: 'Electronics' },
];

export default function BestSellersPage() {
  const [sortBy, setSortBy] = useState('sales');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(bestSellers);

  useEffect(() => {
    let filtered = bestSellers;
    
    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    // Sort products
    switch (sortBy) {
      case 'sales':
        filtered.sort((a, b) => b.salesCount - a.salesCount);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews);
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
  }, [sortBy, categoryFilter]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
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

      {/* Achievements */}
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

      {/* Top 3 Best Sellers */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">🏆 Top 3 Best Sellers</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {bestSellers.slice(0, 3).map((product, index) => (
            <Card key={product.id} className="relative overflow-hidden card-hover">
              <div className="absolute top-4 left-4 z-10">
                <Badge className={`${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  'bg-orange-500 text-white'
                } font-bold`}>
                  #{index + 1}
                </Badge>
              </div>
              <ProductCard product={product} />
              <CardContent className="p-4 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Sales:</span>
                  <span className="font-semibold">{product.salesCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Rating:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{product.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">All Best Sellers</h2>
          <p className="text-muted-foreground">{filteredProducts.length} products found</p>
        </div>
        
        <div className="flex gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
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
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Best Selling</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {filteredProducts.map((product, index) => (
          <div key={product.id} className="relative fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="absolute top-2 left-2 z-10">
              <Badge variant="secondary" className="text-xs">
                #{product.salesRank} Seller
              </Badge>
            </div>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Trust Indicators */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-8 text-center space-y-6">
          <Target className="h-12 w-12 text-green-600 mx-auto" />
          <h3 className="text-2xl font-bold">Why Our Best Sellers Stand Out</h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div>
              <h4 className="font-semibold mb-2">Proven Quality</h4>
              <p className="text-sm text-muted-foreground">
                Each best seller has been tested and validated by thousands of customers
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Reliable Performance</h4>
              <p className="text-sm text-muted-foreground">
                Consistent high ratings and positive feedback from real users
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Great Value</h4>
              <p className="text-sm text-muted-foreground">
                Best price-to-performance ratio in their respective categories
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}