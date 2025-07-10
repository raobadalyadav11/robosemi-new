'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  discount?: number;
  inStock?: boolean;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  
  const isWishlisted = isInWishlist(product._id);
  const finalPrice = product.discount 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product._id,
      name: product.name,
      price: finalPrice,
      image: product.images[0],
      quantity: 1
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: product.category,
        rating: product.rating,
        reviews: product.reviewCount,
        discount: product.discount,
        inStock: product.inStock !== false,
        quantity: 1
      });
    }
  };

  return (
    <Card className={cn("group overflow-hidden card-hover", className)}>
      <Link href={`/products/${product._id}`}>
        <div className="relative aspect-square overflow-hidden">
          {/* Product Image */}
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-all duration-500 group-hover:scale-105",
              isImageLoading ? "blur-sm" : "blur-0"
            )}
            onLoad={() => setIsImageLoading(false)}
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 space-y-1">
            {product.discount && (
              <Badge className="bg-accent text-accent-foreground">
                {product.discount}% OFF
              </Badge>
            )}
            {product.inStock === false && (
              <Badge variant="destructive">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              variant={isWishlisted ? "default" : "secondary"}
              className="h-8 w-8"
              onClick={handleToggleWishlist}
            >
              <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              asChild
            >
              <Link href={`/products/${product._id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Product Name */}
          <h3 className="font-medium line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">
              ₹{finalPrice.toLocaleString()}
            </span>
            {product.discount && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.inStock === false}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.inStock !== false ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}