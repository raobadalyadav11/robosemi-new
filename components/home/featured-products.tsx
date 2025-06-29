import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product/product-card';
import { ArrowRight, TrendingUp, Star, Zap } from 'lucide-react';
import { sampleProducts } from '@/lib/data';

const featuredProducts = sampleProducts.slice(0, 8);

const productHighlights = [
  {
    icon: TrendingUp,
    title: 'Best Sellers',
    description: 'Most popular products chosen by professionals',
    color: 'text-green-600'
  },
  {
    icon: Star,
    title: 'Top Rated',
    description: 'Highest customer satisfaction ratings',
    color: 'text-yellow-600'
  },
  {
    icon: Zap,
    title: 'Latest Tech',
    description: 'Cutting-edge technology and innovations',
    color: 'text-blue-600'
  }
];

export function FeaturedProducts() {
  return (
    <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-16">
          <div className="space-y-6 flex-1">
            <Badge className="bg-secondary/10 text-secondary border-secondary/20 px-4 py-2">
              Featured Collection
            </Badge>
            <h2 className="heading-lg text-balance">
              Premium <span className="text-gradient">Components</span> for Your Projects
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl text-balance">
              Handpicked selection of premium components that deliver exceptional performance, 
              reliability, and innovation for your automation and electronics projects.
            </p>
          </div>
          
          <Button size="lg" variant="outline" asChild className="hidden lg:flex btn-gradient text-white border-0">
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Product Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {productHighlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <div key={index} className="card-feature p-6 text-center fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full">
                    <Icon className={`h-8 w-8 ${highlight.color}`} />
                  </div>
                  <h3 className="text-xl font-bold">{highlight.title}</h3>
                  <p className="text-muted-foreground text-center">{highlight.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <div key={product.id} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="text-center mt-12 lg:hidden">
          <Button size="lg" asChild className="btn-gradient">
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Bottom Section */}
        <div className="mt-20 text-center space-y-8">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              Need Help Choosing the Right Components?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Our expert team is here to help you find the perfect components for your specific requirements. 
              Get personalized recommendations and technical support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="btn-gradient">
                <Link href="/contact">
                  Get Expert Advice
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/blog">
                  Read Our Guides
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}