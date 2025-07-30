'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  Settings,
  Zap,
  Radio,
  Move,
  Cpu,
  Wrench,
  LogOut,
  Package,
  Shield,
  Phone,
  Mail,
  X,
  Star,
  TrendingUp,
  MapPin,
} from 'lucide-react';

// Define the Category type
interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string; // Optional icon field from API
}

// Map category names to icons
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  settings: Settings,
  zap: Zap,
  radio: Radio,
  move: Move,
  cpu: Cpu,
  wrench: Wrench,
};

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, wishlist, user, setUser, searchQuery, setSearchQuery, _hasHydrated } = useStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    fetch('/api/categories')
      .then((response) => response.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  const showUserContent = _hasHydrated;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="hidden md:flex h-10 items-center justify-between text-sm border-b border-border/50">
          <div className="flex items-center space-x-6 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Phone className="h-3 w-3" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-3 w-3" />
              <span>support@robosemi.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/track-order" className="hover:text-primary transition-colors">
              Track Order
            </Link>
            <Link href="/help" className="hover:text-primary transition-colors">
              Help
            </Link>
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <Link href="/new-arrivals" className="hover:text-primary transition-colors">
              New Arrivals
            </Link>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Settings className="h-7 w-7 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold text-gradient">RoboSemi</span>
              <div className="text-xs text-muted-foreground font-medium">Automation Excellence</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base font-medium">Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[500px] gap-3 p-6 md:w-[600px] md:grid-cols-2">
                      {categories.map((category) => {
                        // Use icon from category or fallback to name-based mapping
                        const Icon = category.icon ? iconMap[category.icon.toLowerCase()] || Settings : iconMap[category.name.toLowerCase()] || Settings;
                        return (
                          <NavigationMenuLink key={category._id} asChild>
                            <Link
                              href={`/categories/${category.name.toLowerCase()}`}
                              className="block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                                  <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium leading-none">{category.name}</div>
                                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                                    {category.description || `Premium ${category.name.toLowerCase()} components`}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        );
                      })}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base font-medium">Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-6">
                      <NavigationMenuLink asChild>
                        <Link href="/products" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent">
                          <Package className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-sm font-medium">All Products</div>
                            <p className="text-xs text-muted-foreground">Browse complete catalog</p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/new-arrivals" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent">
                          <Star className="h-5 w-5 text-green-600" />
                          <div>
                            <div className="text-sm font-medium">New Arrivals</div>
                            <p className="text-xs text-muted-foreground">Latest products</p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/best-sellers" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="text-sm font-medium">Best Sellers</div>
                            <p className="text-xs text-muted-foreground">Most popular items</p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/featured" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent">
                          <Star className="h-5 w-5 text-yellow-600" />
                          <div>
                            <div className="text-sm font-medium">Featured</div>
                            <p className="text-xs text-muted-foreground">Editor's choice</p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Link href="/projects" className="text-base font-medium hover:text-primary transition-colors">
              Projects
            </Link>
            <Link href="/training" className="text-base font-medium hover:text-primary transition-colors">
              Training
            </Link>
            <Link href="/contact" className="text-base font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search 10,000+ products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-muted/50 border-border/50 focus:bg-background focus-ring"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Wishlist */}
            <Button variant="ghost" size="icon" asChild className="relative hover:bg-primary/10 transition-colors">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                {showUserContent && wishlist.length > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-secondary">
                    {wishlist.length}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" asChild className="relative hover:bg-primary/10 transition-colors">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {showUserContent && cartItemsCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-primary">
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* User Menu */}
            {showUserContent && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-colors">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-2">
                    <div className="font-medium">Hello, {user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center">
                      <User className="mr-3 h-4 w-4" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders" className="flex items-center">
                      <Package className="mr-3 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/wishlist" className="flex items-center">
                      <Heart className="mr-3 h-4 w-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/addresses" className="flex items-center">
                      <MapPin className="mr-3 h-4 w-4" />
                      Addresses
                    </Link>
                  </DropdownMenuItem>
                  {(user.role === 'admin' || user.role === 'staff') && (
                    <>
                      <DropdownMenuSeparator className="h-px bg-muted my-1" />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center p-2">
                          <Shield className="mr-3 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild className="hidden sm:flex">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild className="btn-gradient">
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-primary/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t py-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12"
              />
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-4">
              <Link
                href="/products"
                className="block py-3 text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Products
              </Link>
              <Link
                href="/new-arrivals"
                className="block py-3 text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                New Arrivals
              </Link>
              <Link
                href="/best-sellers"
                className="block py-3 text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Best Sellers
              </Link>
              <Link
                href="/deals"
                className="block py-3 text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Deals
              </Link>
              <Link href="/projects" className="block py-3 text-lg font-medium hover:text-primary transition-colors">
                Projects
              </Link>
              <Link href="/training" className="block py-3 text-lg font-medium hover:text-primary transition-colors">
                Training
              </Link>
              <Link
                href="/about"
                className="block py-3 text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block py-3 text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-3">
              <div className="text-lg font-medium text-muted-foreground">Categories</div>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => {
                  const Icon = category.icon ? iconMap[category.icon.toLowerCase()] || Settings : iconMap[category.name.toLowerCase()] || Settings;
                  return (
                    <Link
                      key={category._id}
                      href={`/categories/${category.name.toLowerCase()}`}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Auth */}
            {!showUserContent || !user ? (
              <div className="flex flex-col space-y-3 pt-4 border-t">
                <Button asChild variant="outline" size="lg">
                  <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild size="lg" className="btn-gradient">
                  <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </header>
  );
}