import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Users, 
  Headphones, 
  Truck, 
  Shield, 
  Clock,
  Globe,
  ThumbsUp
} from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Every component undergoes rigorous testing to ensure the highest quality standards',
    color: 'text-yellow-600',
    bgColor: 'from-yellow-50 to-orange-50'
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Our engineers and specialists provide world-class technical support and guidance',
    color: 'text-blue-600',
    bgColor: 'from-blue-50 to-cyan-50'
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Round-the-clock customer support to help you with any technical challenges',
    color: 'text-green-600',
    bgColor: 'from-green-50 to-emerald-50'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Express shipping options with real-time tracking for urgent project needs',
    color: 'text-purple-600',
    bgColor: 'from-purple-50 to-violet-50'
  },
  {
    icon: Shield,
    title: 'Warranty Protection',
    description: 'Comprehensive warranty coverage with hassle-free replacement policies',
    color: 'text-red-600',
    bgColor: 'from-red-50 to-pink-50'
  },
  {
    icon: Clock,
    title: 'Quick Response',
    description: 'Fast turnaround times for quotes, orders, and technical inquiries',
    color: 'text-indigo-600',
    bgColor: 'from-indigo-50 to-blue-50'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Worldwide shipping with local support teams in major markets',
    color: 'text-teal-600',
    bgColor: 'from-teal-50 to-cyan-50'
  },
  {
    icon: ThumbsUp,
    title: 'Proven Results',
    description: 'Trusted by 50,000+ customers with 99.5% satisfaction rating',
    color: 'text-orange-600',
    bgColor: 'from-orange-50 to-yellow-50'
  }
];

export function WhyChooseUsSection() {
  return (
    <section className="section-padding bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
            Why Choose RoboSemi
          </Badge>
          <h2 className="heading-lg text-balance">
            Your <span className="text-gradient">Trusted Partner</span> in Innovation
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            We're more than just a supplier – we're your innovation partner, committed to 
            providing exceptional products, services, and support for your success.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group card-hover relative overflow-hidden fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <CardContent className="relative p-8 text-center space-y-6">
                  {/* Icon */}
                  <div className="flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-gradient">15+</div>
            <div className="text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-gradient">50K+</div>
            <div className="text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-gradient">1M+</div>
            <div className="text-muted-foreground">Orders Delivered</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-gradient">99.5%</div>
            <div className="text-muted-foreground">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}