import Link from 'next/link';
import { Settings, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-5 md:grid-cols-3">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">RoboSemi</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Your trusted partner for automation and electronics components. 
              Powering innovation with quality products and exceptional service since 2009.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Products</h3>
            <div className="space-y-2">
              <Link href="/products" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                All Products
              </Link>
              <Link href="/new-arrivals" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                New Arrivals
              </Link>
              <Link href="/best-sellers" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Best Sellers
              </Link>
              <Link href="/featured" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Featured Products
              </Link>
              <Link href="/deals" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Special Deals
              </Link>
              <Link href="/categories/automation" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Automation
              </Link>
              <Link href="/categories/electronics" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Electronics
              </Link>
              <Link href="/categories/sensors" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sensors
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Customer Service</h3>
            <div className="space-y-2">
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
              <Link href="/help" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Help Center
              </Link>
              <Link href="/track-order" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Track Order
              </Link>
              <Link href="/shipping-policy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Shipping Info
              </Link>
              <Link href="/returns-policy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Returns & Refunds
              </Link>
              <Link href="/warranty-policy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Warranty
              </Link>
              <Link href="/bulk-orders" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Bulk Orders
              </Link>
              <Link href="/technical-support" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Technical Support
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Company</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link href="/blog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link href="/careers" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Careers
              </Link>
              <Link href="/press" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Press
              </Link>
              <Link href="/partnerships" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Partnerships
              </Link>
              <Link href="/investors" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Investors
              </Link>
              <Link href="/sustainability" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sustainability
              </Link>
              <Link href="/community" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Community
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-sm text-muted-foreground">
                Subscribe to get special offers, updates and new product releases.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input placeholder="Enter your email" type="email" />
                <Button className="btn-gradient">Subscribe</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                By subscribing, you agree to our Privacy Policy and Terms of Service.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-8 border-t">
          <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <div>
                <div className="font-medium text-foreground">Call Us</div>
                <div>+91 98765 43210</div>
                <div>Mon-Fri: 9AM-6PM IST</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <div>
                <div className="font-medium text-foreground">Email Us</div>
                <div>support@robosemi.com</div>
                <div>sales@robosemi.com</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <div>
                <div className="font-medium text-foreground">Visit Us</div>
                <div>Kasba Purnia</div>
                <div>Purnia, Bihar - 853301</div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link> 
          
          </div>
          <div className="text-sm text-muted-foreground">
            © 2025 RoboSemi Technologies. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}