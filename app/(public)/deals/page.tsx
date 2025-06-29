'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/product/product-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Flame, Gift, Zap, Star } from 'lucide-react';
import { sampleProducts } from '@/lib/data';

const flashSales = [
  {
    id: '1',
    title: 'Arduino Mega Sale',
    description: 'Up to 40% off on all Arduino boards and shields',
    discount: 40,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    products: sampleProducts.slice(0, 4),
    sold: 156,
    total: 200
  },
  {
    id: '2',
    title: 'Sensor Spectacular',
    description: 'Premium sensors at unbeatable prices',
    discount: 35,
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    products: sampleProducts.slice(2, 6),
    sold: 89,
    total: 150
  }
];

const dealCategories = [
  {
    title: 'Daily Deals',
    icon: Clock,
    description: 'New deals every day',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Flash Sales',
    icon: Flame,
    description: 'Limited time offers',
    color: 'from-red-500 to-orange-500'
  },
  {
    title: 'Bundle Offers',
    icon: Gift,
    description: 'Save more with bundles',
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Clearance',
    icon: Zap,
    description: 'Last chance deals',
    color: 'from-purple-500 to-violet-500'
  }
];

export default function DealsPage() {
  const [timeLeft, setTimeLeft] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: {[key: string]: string} = {};
      
      flashSales.forEach(sale => {
        const now = new Date().getTime();
        const end = sale.endTime.getTime();
        const difference = end - now;
        
        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          newTimeLeft[sale.id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
          newTimeLeft[sale.id] = 'Expired';
        }
      });
      
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-accent/10 text-accent border-accent/20 px-4 py-2">
          Special Offers
        </Badge>
        <h1 className="heading-xl text-balance">
          Incredible <span className="text-gradient">Deals & Offers</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          Discover amazing discounts on premium automation and electronics components. 
          Limited time offers you don't want to miss!
        </p>
      </div>

      {/* Deal Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {dealCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <Card key={index} className="card-hover group cursor-pointer">
              <CardContent className="p-6 text-center space-y-4">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${category.color} shadow-lg group-hover:shadow-xl transition-all duration-500`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Flash Sales */}
      <div className="space-y-12">
        {flashSales.map((sale) => (
          <Card key={sale.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10 border-b">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Flame className="h-6 w-6 text-accent" />
                    {sale.title}
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">{sale.description}</p>
                </div>
                <div className="text-center">
                  <Badge className="bg-accent text-accent-foreground text-lg px-4 py-2 mb-2">
                    Up to {sale.discount}% OFF
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Ends in: <span className="font-mono font-bold text-accent">
                      {timeLeft[sale.id] || 'Loading...'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Sold: {sale.sold}/{sale.total}</span>
                  <span>{Math.round((sale.sold / sale.total) * 100)}% claimed</span>
                </div>
                <Progress value={(sale.sold / sale.total) * 100} className="h-2" />
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sale.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button size="lg" className="btn-gradient">
                  View All {sale.title} Products
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Deals */}
      <div className="mt-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="heading-lg">Featured Deals</h2>
          <p className="text-xl text-muted-foreground">
            Hand-picked deals on our most popular products
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <Card className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-8 text-center space-y-4">
          <Star className="h-12 w-12 text-primary mx-auto" />
          <h3 className="text-2xl font-bold">Never Miss a Deal!</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about exclusive offers, 
            flash sales, and new product launches.
          </p>
          <Button size="lg" className="btn-gradient">
            Subscribe for Exclusive Deals
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}