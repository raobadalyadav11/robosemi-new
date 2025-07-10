'use client';

import { useStore } from '@/lib/store';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
            <p className="text-muted-foreground">
              Save items you love to your wishlist and shop them later.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/products">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        <Button variant="outline" onClick={clearWishlist}>
          Clear Wishlist
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={{
            _id: product.id,
            name: product.name,
            price: product.price,
            discount: product.discount,
            inStock: product.inStock
          }} />
        ))}
      </div>

      {/* Recommendations */}
      <Card className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-8 text-center space-y-4">
          <ShoppingBag className="h-12 w-12 text-primary mx-auto" />
          <h3 className="text-2xl font-bold">Ready to Shop?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Move your favorite items to cart and complete your purchase with fast, 
            secure checkout and free shipping on orders over ₹500.
          </p>
          <Button size="lg" asChild className="btn-gradient">
            <Link href="/products">
              Continue Shopping
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}