'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Gift, Bell, TrendingUp, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const benefits = [
  {
    icon: Gift,
    title: 'Exclusive Deals',
    description: 'Get early access to sales and special discounts'
  },
  {
    icon: Bell,
    title: 'New Product Alerts',
    description: 'Be the first to know about latest innovations'
  },
  {
    icon: TrendingUp,
    title: 'Industry Insights',
    description: 'Weekly updates on automation trends and tech news'
  }
];

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Successfully subscribed! Welcome to RoboSemi community.');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding bg-gradient-to-br from-muted/30 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto card-premium relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary to-secondary" />
          </div>

          <CardContent className="relative p-12 text-center space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                Stay Connected
              </Badge>
              <h2 className="heading-md text-balance">
                Join the <span className="text-gradient">RoboSemi Community</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                Get exclusive access to new products, special offers, and expert insights 
                delivered straight to your inbox every week.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 my-12">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex flex-col items-center space-y-3 fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground text-center">{benefit.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 focus-ring"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="btn-gradient px-8"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Privacy Note */}
            <p className="text-xs text-muted-foreground">
              We respect your privacy. Unsubscribe at any time. 
              <a href="/privacy" className="text-primary hover:underline ml-1">
                Privacy Policy
              </a>
            </p>

            {/* Social Proof */}
            <div className="pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-4">
                Join 25,000+ professionals already subscribed
              </p>
              <div className="flex justify-center items-center gap-8 opacity-60">
                <div className="text-sm font-semibold">Trusted by:</div>
                <div className="flex gap-6 text-xs font-medium">
                  <span>TechCorp</span>
                  <span>IIT Mumbai</span>
                  <span>Smart Cities</span>
                  <span>AutoMotive</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}