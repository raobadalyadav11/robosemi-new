'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ArrowRight, Zap, Shield, Truck, Star } from 'lucide-react';

const banners = [
  {
    id: '1',
    title: 'Revolutionary Automation Solutions',
    subtitle: 'Transform your projects with cutting-edge IoT and robotics technology. Experience the future of automation today.',
    image: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
    cta: 'Explore Solutions',
    link: '/products',
    badge: 'New Technology',
    features: ['AI-Powered', '24/7 Support', 'Global Shipping']
  },
  {
    id: '2',
    title: 'Arduino & Raspberry Pi Collection',
    subtitle: 'Latest development boards, sensors, and accessories for makers, students, and professionals worldwide.',
    image: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg',
    cta: 'Shop Controllers',
    link: '/products?category=controllers',
    badge: 'Best Sellers',
    features: ['Premium Quality', 'Fast Delivery', 'Expert Support']
  },
  {
    id: '3',
    title: 'Mega Electronics Sale - Up to 50% Off',
    subtitle: 'High-precision sensors, actuators, and components at unbeatable prices. Limited time offer!',
    image: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg',
    cta: 'Save Big Now',
    link: '/products?category=sensors',
    badge: 'Limited Offer',
    features: ['50% Off', 'Free Shipping', '30-Day Returns']
  },
];

const quickStats = [
  { icon: Star, value: '50K+', label: 'Happy Customers' },
  { icon: Zap, value: '10K+', label: 'Products' },
  { icon: Shield, value: '99.9%', label: 'Uptime' },
  { icon: Truck, value: '24h', label: 'Fast Delivery' },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Main Hero Banner */}
        <Card className="relative h-[600px] md:h-[700px] overflow-hidden pulse-glow">
          <div className="relative h-full">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              >
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                
                {/* Enhanced Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl text-white space-y-8 slide-in-left">
                      {/* Badge */}
                      <Badge className="bg-accent text-accent-foreground font-semibold px-4 py-2 text-sm">
                        {banner.badge}
                      </Badge>
                      
                      {/* Title */}
                      <h1 className="heading-xl text-balance">
                        {banner.title}
                      </h1>
                      
                      {/* Subtitle */}
                      <p className="text-xl md:text-2xl text-white/90 leading-relaxed text-balance">
                        {banner.subtitle}
                      </p>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-4">
                        {banner.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 glass-effect px-4 py-2 rounded-full">
                            <div className="w-2 h-2 bg-accent rounded-full" />
                            <span className="text-sm font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="btn-gradient group text-lg px-8 py-4">
                          <Link href={banner.link} className="flex items-center">
                            {banner.cta}
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                        <Button size="lg" variant="destructive" className="glass-effect text-white border-white/30 hover:bg-white/10 text-lg px-8 py-4">
                          <Link href="/contact">
                            Get Quote
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-20 right-20 floating-animation hidden lg:block">
                  <div className="w-20 h-20 bg-accent/20 rounded-full blur-xl" />
                </div>
                <div className="absolute bottom-32 right-32 floating-animation hidden lg:block" style={{ animationDelay: '2s' }}>
                  <div className="w-16 h-16 bg-secondary/20 rounded-full blur-xl" />
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Navigation Arrows */}
          {/* Enhanced Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? 'bg-white w-12 h-3'
                    : 'bg-white/50 w-3 h-3 hover:bg-white/70'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="card-feature p-6 text-center fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}