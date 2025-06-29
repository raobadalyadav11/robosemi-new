'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    role: 'Senior Automation Engineer',
    company: 'TechCorp Industries',
    content: 'RoboSemi has been our go-to partner for automation components for over 3 years. Their quality is unmatched, and their technical support team is incredibly knowledgeable. They helped us reduce our production downtime by 40%.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 5,
    project: 'Industrial Automation System'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    role: 'IoT Solutions Architect',
    company: 'Smart City Solutions',
    content: 'The range of IoT sensors and controllers from RoboSemi is impressive. We\'ve deployed over 10,000 devices across multiple smart city projects. The reliability and performance have exceeded our expectations.',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    rating: 5,
    project: 'Smart City Infrastructure'
  },
  {
    id: '3',
    name: 'Prof. Amit Patel',
    role: 'Robotics Professor',
    company: 'IIT Mumbai',
    content: 'As an educator, I appreciate RoboSemi\'s commitment to supporting academic institutions. Their educational discounts and comprehensive documentation make it easy for students to learn and innovate.',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    rating: 5,
    project: 'Educational Robotics Program'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    role: 'Startup Founder',
    company: 'AgriTech Innovations',
    content: 'Starting our agritech company, we needed reliable components at competitive prices. RoboSemi not only provided excellent products but also valuable technical guidance that helped us bring our product to market faster.',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg',
    rating: 5,
    project: 'Smart Agriculture Solution'
  },
  {
    id: '5',
    name: 'Michael Chen',
    role: 'R&D Director',
    company: 'AutoMotive Systems',
    content: 'The automotive-grade components from RoboSemi have been crucial for our autonomous vehicle research. Their quality standards and testing procedures align perfectly with our stringent requirements.',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
    rating: 5,
    project: 'Autonomous Vehicle Development'
  }
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="section-padding hero-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl floating-animation" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-2xl floating-animation" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
            Customer Success Stories
          </Badge>
          <h2 className="heading-lg text-white text-balance">
            Trusted by <span className="text-accent">Industry Leaders</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto text-balance">
            Discover how leading companies and institutions worldwide are achieving 
            breakthrough results with our premium automation and electronics solutions.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto">
          <Card className="glass-effect border-white/20 relative overflow-hidden">
            <CardContent className="p-12">
              {/* Quote Icon */}
              <div className="flex justify-center mb-8">
                <div className="p-4 bg-accent/20 rounded-full">
                  <Quote className="h-8 w-8 text-accent" />
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="text-center space-y-8">
                {/* Rating */}
                <div className="flex justify-center space-x-1">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-accent text-accent" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-2xl md:text-3xl font-medium text-white leading-relaxed text-balance">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-xl font-bold text-white">{currentTestimonial.name}</div>
                    <div className="text-white/80">{currentTestimonial.role}</div>
                    <div className="text-accent font-semibold">{currentTestimonial.company}</div>
                    <div className="text-sm text-white/60 mt-1">Project: {currentTestimonial.project}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="glass-effect text-white border-white/30 hover:bg-white/20"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-accent w-8'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="glass-effect text-white border-white/30 hover:bg-white/20"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">50K+</div>
            <div className="text-white/80">Satisfied Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">99.5%</div>
            <div className="text-white/80">Customer Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-white/80">Expert Support</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">15+</div>
            <div className="text-white/80">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
}