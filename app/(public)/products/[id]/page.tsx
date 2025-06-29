'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/product/product-card';
import {
  Heart,
  ShoppingCart,
  Star,
  Shield,
  Truck,
  RotateCcw,
  ChevronLeft,
  Plus,
  Minus,
} from 'lucide-react';
import { sampleProducts } from '@/lib/data';
import { cn } from '@/lib/utils';



export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  
  const product = sampleProducts.find(p => p.id === productId);
  const relatedProducts = sampleProducts
    .filter(p => p.category === product?.category && p.id !== productId)
    .slice(0, 4);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/products">Browse All Products</Link>
        </Button>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const finalPrice = product.discount 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const images = [product.image, product.image, product.image]; // Mock multiple images

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground">Products</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.discount && (
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  {product.discount}% OFF
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="destructive" className="absolute top-4 right-4">
                  Out of Stock
                </Badge>
              )}
            </div>
          </Card>
          
          {/* Thumbnail Images */}
          <div className="flex space-x-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors",
                  selectedImage === index
                    ? "border-primary"
                    : "border-transparent hover:border-border"
                )}
              >
                <Image src={image} alt={`View ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold">
                ₹{finalPrice.toLocaleString()}
              </span>
              {product.discount && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <Badge className="bg-green-100 text-green-800">
                    Save ₹{(product.price - finalPrice).toLocaleString()}
                  </Badge>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">
              {product.description || 'High-quality component perfect for your automation and electronics projects.'}
            </p>
          </div>

          <Separator />

          {/* Quantity & Actions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="font-semibold">Quantity:</label>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!product.inStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                variant={isWishlisted ? "default" : "outline"}
                size="lg"
                onClick={handleToggleWishlist}
              >
                <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex flex-col items-center text-center space-y-2">
              <Shield className="h-6 w-6 text-primary" />
              <div className="text-sm">
                <div className="font-medium">Warranty</div>
                <div className="text-muted-foreground">1 Year</div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <Truck className="h-6 w-6 text-primary" />
              <div className="text-sm">
                <div className="font-medium">Free Shipping</div>
                <div className="text-muted-foreground">On orders ₹500+</div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <RotateCcw className="h-6 w-6 text-primary" />
              <div className="text-sm">
                <div className="font-medium">Easy Returns</div>
                <div className="text-muted-foreground">30 Days</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-16">
        <Tabs defaultValue="specifications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">General</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Brand:</span>
                        <span>RoboSemi</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model:</span>
                        <span>{product.id.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="capitalize">{product.category}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Technical</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Operating Voltage:</span>
                        <span>3.3V - 5V</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Interface:</span>
                        <span>I2C, SPI</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dimensions:</span>
                        <span>50 x 30 x 15mm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {/* Reviews would be loaded here */}
              <p className="text-muted-foreground">Reviews section coming soon.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Shipping Information</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Free shipping on orders above ₹500</li>
                    <li>• Standard delivery: 3-5 business days</li>
                    <li>• Express delivery: 1-2 business days (additional charges apply)</li>
                    <li>• Cash on delivery available</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Return Policy</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 30-day return policy</li>
                    <li>• Items must be in original condition</li>
                    <li>• Free returns for defective products</li>
                    <li>• Return shipping charges may apply</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Related Products</h2>
            <Button variant="outline" asChild>
              <Link href={`/products?category=${product.category}`}>
                View All
                <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}