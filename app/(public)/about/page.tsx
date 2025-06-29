import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Award, 
  Globe, 
  Target,
  Heart,
  Lightbulb,
  Shield,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const values = [
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Every decision we make is guided by what\'s best for our customers and their success.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We continuously push boundaries to bring cutting-edge technology to market.'
  },
  {
    icon: Shield,
    title: 'Quality',
    description: 'Uncompromising quality standards ensure reliability in every component we deliver.'
  },
  {
    icon: Zap,
    title: 'Excellence',
    description: 'We strive for excellence in everything we do, from products to customer service.'
  }
];

const team = [
  {
    name: 'Dr. Rajesh Gupta',
    role: 'Founder & CEO',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    bio: '15+ years in automation industry, former IIT professor'
  },
  {
    name: 'Priya Sharma',
    role: 'CTO',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    bio: 'Expert in IoT and embedded systems, 12+ years experience'
  },
  {
    name: 'Amit Patel',
    role: 'Head of Operations',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    bio: 'Supply chain expert, ensuring global delivery excellence'
  },
  {
    name: 'Sarah Wilson',
    role: 'Head of Customer Success',
    image: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg',
    bio: 'Dedicated to customer satisfaction and technical support'
  }
];

const milestones = [
  { year: '2009', event: 'RoboSemi founded in Mumbai' },
  { year: '2012', event: 'Reached 1,000 customers milestone' },
  { year: '2015', event: 'Expanded to international markets' },
  { year: '2018', event: 'Launched IoT product line' },
  { year: '2020', event: 'Achieved ISO 9001:2015 certification' },
  { year: '2022', event: 'Crossed 50,000 customers globally' },
  { year: '2024', event: 'Leading automation solutions provider' }
];

export default function AboutPage() {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="section-padding hero-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              About RoboSemi
            </Badge>
            <h1 className="heading-xl text-balance">
              Pioneering the Future of <span className="text-accent">Automation</span>
            </h1>
            <p className="text-2xl text-white/90 leading-relaxed text-balance">
              For over 15 years, we've been at the forefront of automation and electronics innovation, 
              empowering engineers, makers, and businesses worldwide to build the future.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="heading-md mb-6">Our Mission</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  To democratize access to cutting-edge automation and electronics components, 
                  enabling innovators worldwide to transform their ideas into reality with 
                  premium quality products and exceptional support.
                </p>
              </div>
              <div>
                <h2 className="heading-md mb-6">Our Vision</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  To be the global leader in automation solutions, fostering a world where 
                  technology seamlessly integrates with human needs to create a smarter, 
                  more efficient, and sustainable future.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg"
                alt="Our Mission"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-16">
            <h2 className="heading-lg">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These principles guide everything we do and shape our commitment to excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="card-hover text-center">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-16">
            <h2 className="heading-lg">Meet Our Leadership Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experienced professionals dedicated to driving innovation and customer success
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-primary font-semibold">{member.role}</p>
                    <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-16">
            <h2 className="heading-lg">Our Journey</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Key milestones in our mission to advance automation technology
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-8">
                  <div className="flex-shrink-0 w-20 text-right">
                    <Badge className="bg-primary text-primary-foreground font-bold">
                      {milestone.year}
                    </Badge>
                  </div>
                  <div className="flex-shrink-0 w-4 h-4 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-lg">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-gradient">15+</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-gradient">50K+</div>
              <div className="text-muted-foreground">Global Customers</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-gradient">10K+</div>
              <div className="text-muted-foreground">Products</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-gradient">150+</div>
              <div className="text-muted-foreground">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding hero-gradient text-white">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="heading-lg">Ready to Build the Future?</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join thousands of innovators who trust RoboSemi for their automation needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/products">Explore Products</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}