'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/lib/store';
import { 
  Clock, 
  User, 
  Tag, 
  ShoppingCart, 
  ArrowLeft, 
  Loader2, 
  AlertCircle,
  Star,
  Package
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  discount?: number;
  stock: number;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: {
    _id: string;
    name: string;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  components: string[];
  tags: string[];
  products: Product[];
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  advanced: 'bg-red-100 text-red-800 border-red-200'
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  
  const { addToCart } = useStore();

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/projects/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }

      const data: Project = await response.json();
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    setAddingToCart(product._id);
    
    try {
      await addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
        inStock: product.stock > 0,
        discount: product.discount
      });
      
      // Show success feedback (you can implement a toast here)
      console.log('Added to cart:', product.name);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading project...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="font-semibold text-destructive mb-2">Error Loading Project</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button 
              onClick={fetchProject} 
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Project Not Found</h3>
          <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="relative overflow-hidden rounded-t-lg">
              <Image
                src={project.image}
                alt={project.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className={difficultyColors[project.difficulty]}>
                  {project.difficulty}
                </Badge>
              </div>
            </div>
            
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">
                  {project.category.name}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {project.estimatedTime}
                </div>
              </div>
              <CardTitle className="text-2xl md:text-3xl">{project.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="h-4 w-4 mr-1" />
                By {project.createdBy.name}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>

              {project.components.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Components Required</h3>
                  <ul className="space-y-2">
                    {project.components.map((component, index) => (
                      <li key={index} className="flex items-center text-muted-foreground">
                        <Package className="h-4 w-4 mr-2 text-primary" />
                        {component}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Related Products Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Products</CardTitle>
              <p className="text-sm text-muted-foreground">
                Components needed for this project
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.products.length > 0 ? (
                project.products.map((product) => (
                  <div key={product._id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start space-x-3">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-tight">{product.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="font-semibold text-primary">
                            ₹{product.discount ? 
                              (product.price * (1 - product.discount / 100)).toFixed(2) : 
                              product.price.toFixed(2)
                            }
                          </span>
                          {product.discount && (
                            <span className="text-xs text-muted-foreground line-through">
                              ₹{product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0 || addingToCart === product._id}
                      className="w-full btn-gradient"
                      size="sm"
                    >
                      {addingToCart === product._id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : product.stock === 0 ? (
                        'Out of Stock'
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No related products available for this project.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Difficulty</span>
                <Badge className={difficultyColors[project.difficulty]}>
                  {project.difficulty}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Estimated Time</span>
                <span className="text-sm font-medium">{project.estimatedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <span className="text-sm font-medium">{project.category.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}