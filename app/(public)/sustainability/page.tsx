import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Leaf, 
  Recycle, 
  Users, 
  Heart,
  Target,
  Award,
  TrendingDown,
  Battery,
  Droplets,
  Wind
} from 'lucide-react';
import Link from 'next/link';

const sustainabilityGoals = [
  {
    title: 'Carbon Neutral by 2030',
    description: 'Achieve net-zero carbon emissions across all operations',
    progress: 65,
    icon: Leaf,
    color: 'text-green-600'
  },
  {
    title: '100% Renewable Energy',
    description: 'Power all facilities with renewable energy sources',
    progress: 80,
    icon: Wind,
    color: 'text-blue-600'
  },
  {
    title: 'Zero Waste to Landfill',
    description: 'Eliminate waste sent to landfills through recycling and reuse',
    progress: 45,
    icon: Recycle,
    color: 'text-purple-600'
  },
  {
    title: 'Water Conservation',
    description: 'Reduce water consumption by 50% through efficiency measures',
    progress: 70,
    icon: Droplets,
    color: 'text-cyan-600'
  }
];

const initiatives = [
  {
    icon: Recycle,
    title: 'Circular Economy',
    description: 'Product take-back program for end-of-life electronics',
    impact: '10,000+ devices recycled',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Battery,
    title: 'Energy Efficiency',
    description: 'Low-power product designs and energy-efficient operations',
    impact: '30% reduction in energy use',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Users,
    title: 'Community Impact',
    description: 'STEM education programs and local community support',
    impact: '5,000+ students reached',
    color: 'from-purple-500 to-violet-500'
  },
  {
    icon: Heart,
    title: 'Employee Wellbeing',
    description: 'Comprehensive health and wellness programs',
    impact: '95% employee satisfaction',
    color: 'from-pink-500 to-rose-500'
  }
];

const achievements = [
  {
    year: '2023',
    title: 'ISO 14001 Certification',
    description: 'Environmental management system certification'
  },
  {
    year: '2023',
    title: 'Green Business Award',
    description: 'Recognition for sustainable business practices'
  },
  {
    year: '2022',
    title: 'Carbon Footprint Reduction',
    description: '25% reduction in carbon emissions'
  },
  {
    year: '2022',
    title: 'Sustainable Packaging',
    description: '100% recyclable packaging implementation'
  }
];

const metrics = [
  { label: 'CO2 Emissions Reduced', value: '25%', icon: TrendingDown },
  { label: 'Renewable Energy Use', value: '80%', icon: Wind },
  { label: 'Waste Recycled', value: '90%', icon: Recycle },
  { label: 'Water Saved', value: '35%', icon: Droplets }
];

export default function SustainabilityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
          Sustainability
        </Badge>
        <h1 className="heading-xl text-balance">
          Building a <span className="text-gradient">Sustainable Future</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          Our commitment to environmental responsibility, social impact, and sustainable 
          business practices drives everything we do at RoboSemi.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="card-hover text-center">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{metric.value}</div>
                  <div className="text-sm font-medium">{metric.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sustainability Goals */}
      <div className="mb-16">
        <div className="text-center space-y-6 mb-12">
          <h2 className="heading-lg">Our 2030 Sustainability Goals</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ambitious targets that guide our environmental and social responsibility efforts.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {sustainabilityGoals.map((goal, index) => {
            const Icon = goal.icon;
            return (
              <Card key={index} className="card-hover">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full">
                      <Icon className={`h-6 w-6 ${goal.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{goal.title}</h3>
                      <p className="text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-semibold">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Key Initiatives */}
      <div className="mb-16">
        <div className="text-center space-y-6 mb-12">
          <h2 className="heading-lg">Key Initiatives</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Concrete actions we're taking to create positive environmental and social impact.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {initiatives.map((initiative, index) => {
            const Icon = initiative.icon;
            return (
              <Card key={index} className="card-hover group relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${initiative.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <CardContent className="relative p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${initiative.color} shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{initiative.title}</h3>
                      <p className="text-muted-foreground">{initiative.description}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-semibold text-primary">Impact: {initiative.impact}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Achievements Timeline */}
      <div className="mb-16">
        <div className="text-center space-y-6 mb-12">
          <h2 className="heading-lg">Sustainability Achievements</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Milestones in our journey toward environmental and social responsibility.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-8">
                <div className="flex-shrink-0 w-20 text-right">
                  <Badge className="bg-green-100 text-green-800 font-bold">
                    {achievement.year}
                  </Badge>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold">{achievement.title}</h4>
                  <p className="text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ESG Report */}
      <Card className="mb-16">
        <CardContent className="p-8 text-center space-y-6">
          <Award className="h-16 w-16 text-green-600 mx-auto" />
          <div>
            <h3 className="text-2xl font-bold mb-4">ESG Report 2023</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Download our comprehensive Environmental, Social, and Governance report 
              detailing our sustainability performance and commitments.
            </p>
          </div>
          <Button size="lg" className="btn-gradient">
            Download ESG Report
          </Button>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-8 text-center space-y-6">
          <Leaf className="h-12 w-12 text-green-600 mx-auto" />
          <div>
            <h3 className="text-2xl font-bold mb-4">Join Our Sustainability Journey</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Partner with us to create innovative solutions that benefit both business and the planet. 
              Together, we can build a more sustainable future.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-gradient" asChild>
              <Link href="/partnerships">Become a Partner</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}