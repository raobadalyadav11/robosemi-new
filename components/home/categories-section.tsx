import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Zap, Radio, Move, Cpu, Wrench, ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'automation',
    name: 'Automation',
    icon: Settings,
    description: 'Smart automation solutions for modern industries',
    productCount: '2,500+',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50 to-cyan-50'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Zap,
    description: 'High-quality electronic components and modules',
    productCount: '3,200+',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'from-yellow-50 to-orange-50'
  },
  {
    id: 'sensors',
    name: 'Sensors',
    icon: Radio,
    description: 'Precision sensors for accurate measurements',
    productCount: '1,800+',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-50 to-emerald-50'
  },
  {
    id: 'actuators',
    name: 'Actuators',
    icon: Move,
    description: 'Powerful actuators for motion control',
    productCount: '950+',
    color: 'from-purple-500 to-violet-500',
    bgColor: 'from-purple-50 to-violet-50'
  },
  {
    id: 'controllers',
    name: 'Controllers',
    icon: Cpu,
    description: 'Advanced microcontrollers and development boards',
    productCount: '1,200+',
    color: 'from-red-500 to-pink-500',
    bgColor: 'from-red-50 to-pink-50'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: Wrench,
    description: 'Essential tools and accessories for projects',
    productCount: '2,100+',
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'from-indigo-50 to-blue-50'
  },
];

export function CategoriesSection() {
  return (
    <section className="section-padding bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-6 mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
            Product Categories
          </Badge>
          <h2 className="heading-lg text-balance">
            Explore Our <span className="text-gradient">Comprehensive Range</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            From cutting-edge automation solutions to precision sensors, discover everything you need 
            to bring your innovative projects to life with our premium component collection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Card className="group card-hover h-full relative overflow-hidden fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <CardContent className="relative p-8 text-center space-y-6">
                    {/* Icon with Gradient Background */}
                    <div className="flex justify-center">
                      <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${category.color} shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}>
                        <Icon className="h-10 w-10 text-white" />
                        
                        {/* Glow Effect */}
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`} />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {category.description}
                      </p>
                      <Badge variant="secondary" className="font-semibold">
                        {category.productCount} Products
                      </Badge>
                    </div>
                    
                    {/* Hover Arrow */}
                    <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <span>Explore Category</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Can't find what you're looking for?
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-lg">
            Contact our experts for custom solutions
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}