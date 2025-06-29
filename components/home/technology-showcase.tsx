import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Cpu, 
  Wifi, 
  Smartphone, 
  Cloud, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

const technologies = [
  {
    icon: Cpu,
    title: 'AI & Machine Learning',
    description: 'Advanced AI-powered components for intelligent automation',
    features: ['Neural Processing', 'Edge Computing', 'Real-time Analytics'],
    color: 'from-purple-500 to-indigo-500'
  },
  {
    icon: Wifi,
    title: 'IoT Connectivity',
    description: 'Seamless connectivity solutions for the Internet of Things',
    features: ['5G Ready', 'Low Power', 'Global Coverage'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Cloud,
    title: 'Cloud Integration',
    description: 'Cloud-native solutions for scalable automation',
    features: ['Real-time Sync', 'Auto Scaling', 'Global CDN'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Shield,
    title: 'Security First',
    description: 'Enterprise-grade security for critical applications',
    features: ['End-to-End Encryption', 'Zero Trust', 'Compliance Ready'],
    color: 'from-red-500 to-orange-500'
  }
];

const certifications = [
  'ISO 9001:2015',
  'CE Certified',
  'FCC Approved',
  'RoHS Compliant',
  'UL Listed',
  'Energy Star'
];

export function TechnologyShowcase() {
  return (
    <section className="section-padding bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <Badge className="bg-accent/10 text-accent border-accent/20 px-4 py-2">
            Technology Leadership
          </Badge>
          <h2 className="heading-lg text-balance">
            Powered by <span className="text-gradient">Next-Gen Technology</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Experience the future of automation with our cutting-edge technology stack, 
            designed to deliver unparalleled performance, security, and scalability.
          </p>
        </div>

        {/* Technology Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {technologies.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <Card key={index} className="card-hover group relative overflow-hidden fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <CardContent className="relative p-8 space-y-6">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${tech.color} shadow-lg group-hover:shadow-xl transition-all duration-500`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {tech.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {tech.description}
                    </p>
                    
                    {/* Features */}
                    <div className="space-y-2">
                      {tech.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Certifications */}
        <div className="text-center space-y-8">
          <h3 className="text-2xl font-bold">Industry Certifications & Standards</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {certifications.map((cert, index) => (
              <Badge key={index} variant="outline" className="px-4 py-2 text-sm font-semibold">
                {cert}
              </Badge>
            ))}
          </div>
          
          {/* CTA */}
          <div className="pt-8">
            <Button size="lg" asChild className="btn-gradient">
              <Link href="/about">
                Learn More About Our Technology
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}