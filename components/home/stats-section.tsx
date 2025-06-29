import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Users, Package, Award, Globe, Clock, Shield, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: Package,
    value: '10,000+',
    label: 'Premium Products',
    description: 'Curated components in stock',
    color: 'text-blue-600'
  },
  {
    icon: Users,
    value: '50,000+',
    label: 'Global Customers',
    description: 'Trust our platform worldwide',
    color: 'text-green-600'
  },
  {
    icon: ShoppingCart,
    value: '1M+',
    label: 'Orders Delivered',
    description: 'Successfully completed',
    color: 'text-purple-600'
  },
  {
    icon: Award,
    value: '99.5%',
    label: 'Satisfaction Rate',
    description: 'Customer happiness score',
    color: 'text-yellow-600'
  },
  {
    icon: Globe,
    value: '150+',
    label: 'Countries Served',
    description: 'Global shipping coverage',
    color: 'text-indigo-600'
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'Expert Support',
    description: 'Round-the-clock assistance',
    color: 'text-red-600'
  },
  {
    icon: Shield,
    value: '15+',
    label: 'Years Experience',
    description: 'Industry expertise',
    color: 'text-teal-600'
  },
  {
    icon: TrendingUp,
    value: '40%',
    label: 'YoY Growth',
    description: 'Consistent expansion',
    color: 'text-orange-600'
  },
];

export function StatsSection() {
  return (
    <section className="section-padding hero-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl floating-animation" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl floating-animation" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl floating-animation" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center space-y-6 mb-16">
          <h2 className="heading-lg text-white text-balance">
            Trusted by <span className="text-accent">Professionals Worldwide</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto text-balance">
            Join thousands of engineers, makers, and innovators who rely on RoboSemi 
            for their automation and electronics needs. Our numbers speak for themselves.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="glass-effect border-white/20 backdrop-blur-md card-hover fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-8 text-center text-white space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                      <Icon className="h-8 w-8 text-accent" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl md:text-4xl font-bold text-accent">
                      {stat.value}
                    </div>
                    <div className="font-semibold text-lg">
                      {stat.label}
                    </div>
                    <div className="text-sm text-white/70 leading-relaxed">
                      {stat.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Achievement Section */}
        <div className="mt-20 text-center space-y-8">
          <h3 className="text-3xl font-bold text-white">
            Recognized Excellence in Innovation
          </h3>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-80">
            <div className="glass-effect px-6 py-3 rounded-full">
              <span className="text-white font-semibold">ISO 9001:2015 Certified</span>
            </div>
            <div className="glass-effect px-6 py-3 rounded-full">
              <span className="text-white font-semibold">Industry Leader 2024</span>
            </div>
            <div className="glass-effect px-6 py-3 rounded-full">
              <span className="text-white font-semibold">Best Customer Service</span>
            </div>
            <div className="glass-effect px-6 py-3 rounded-full">
              <span className="text-white font-semibold">Innovation Award Winner</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}