'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/product/product-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, TrendingUp, Clock, Star } from 'lucide-react';
import { sampleProducts } from '@/lib/data';

const newArrivals = sampleProducts.slice(0, 12).map(product => ({
  ...product,
  isNew: true,
  arrivalDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
}));

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
  const [filteredProducts, setFilteredProducts] = useState(newArrivals);

  useEffect(() => {
    let sorted = [...newArrivals];
    
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => b.arrivalDate.getTime() - a.arrivalDate.getTime());
        break;
      case 'price-low':
        sorted.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        sorted.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceB - priceA;
        });
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
    }
    
    setFilteredProducts(sorted);
  }, [sortBy]);

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
          <p className="text-muted-foreground">{filteredProducts.length} products found</p>
        </div>
        
        <Select value={sortBy} onValueChange={setSortBy}>
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {filteredProducts.map((product, index) => (
          <div key={product.id} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

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