import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, ArrowLeft, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/5 px-4">
      <Card className="max-w-2xl w-full text-center">
        <CardContent className="p-12 space-y-8">
          {/* 404 Illustration */}
          <div className="space-y-4">
            <div className="text-8xl md:text-9xl font-bold text-gradient">404</div>
            <h1 className="text-3xl md:text-4xl font-bold">Page Not Found</h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              Oops! The page you're looking for seems to have wandered off into the digital void.
            </p>
          </div>

          {/* Suggestions */}
          <div className="space-y-4">
            <p className="text-muted-foreground">Here are some helpful links instead:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <Button asChild variant="outline" size="lg" className="h-auto p-4">
                <Link href="/" className="flex flex-col items-center gap-2">
                  <Home className="h-6 w-6" />
                  <span>Go Home</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-auto p-4">
                <Link href="/products" className="flex flex-col items-center gap-2">
                  <Search className="h-6 w-6" />
                  <span>Browse Products</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-gradient">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Homepage
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/help">
                <HelpCircle className="mr-2 h-4 w-4" />
                Get Help
              </Link>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Still can't find what you're looking for?{' '}
              <Link href="/contact" className="text-primary hover:underline">
                Contact our support team
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}