'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-destructive/5 px-4">
      <Card className="max-w-2xl w-full text-center">
        <CardContent className="p-12 space-y-8">
          {/* Error Illustration */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-6 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-16 w-16 text-destructive" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Something went wrong!</h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              We encountered an unexpected error. Don't worry, our team has been notified.
            </p>
          </div>

          {/* Error Details */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-4 bg-muted rounded-lg text-left">
              <p className="text-sm font-mono text-muted-foreground">
                {error.message}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={reset} className="btn-gradient">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button asChild variant="outline">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </div>
            
            <Button asChild variant="ghost">
              <Link href="/help">
                <HelpCircle className="mr-2 h-4 w-4" />
                Get Help
              </Link>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              If this problem persists, please{' '}
              <Link href="/contact" className="text-primary hover:underline">
                contact our support team
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}