'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProductCard } from '@/components/product/product-card';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Filter, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { sampleProducts, categories } from '@/lib/data';
import { SEOHead } from '@/components/seo/seo-head';
import { generateCategorySEO } from '@/lib/seo';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.category as string;
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const category = categories.find(c => c.id === categoryId);
  const categoryProducts = sampleProducts.filter(p => p.category === categoryId);
  
  // Get unique brands for filters
  const brands = Array.from(new Set(categoryProducts.map(p => 'RoboSemi'))); // Mock brands
  
  const [filteredProducts, setFilteredProducts] = useState(categoryProducts);

  useEffect(() => {
    let filtered = categoryProducts;
    
    // Filter by price range
    filtered = filtered.filter(product => {
      const finalPrice = product.discount 
        ? product.price * (1 - product.discount / 100)
        : product.price;
      return finalPrice >= priceRange[0] && finalPrice <= priceRange[1];
    });
    
    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => selectedBrands.includes('RoboSemi'));
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceB - priceA;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'newest':
      default:
        // Keep original order
        break;
    }
    
    setFilteredProducts(filtered);
  }, [categoryProducts, priceRange, selectedBrands, sortBy]);

  if (!category) {
    return <div>Category not found</div>;
  }

  const seoData = generateCategorySEO(categoryId, categoryProducts);

  return (
    <>
      <SEOHead seo={seoData} />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 capitalize">
            {category.name}
          </Badge>
          <h1 className="heading-xl text-balance">
            Premium <span className="text-gradient capitalize">{category.name}</span> Components
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Discover our comprehensive collection of high-quality {category.name.toLowerCase()} 
            components designed for professional automation and electronics projects.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPriceRange([0, 10000]);
                      setSelectedBrands([]);
                    }}
                  >
                    Clear All
                  </Button>
                </div>

                <Separator />

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    max={10000}
                    min={0}
                    step={100}
                    className="w-full"
                  />
                </div>

                <Separator />

                {/* Brands */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Brands</label>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(selectedBrands.filter(b => b !== brand));
                            }
                          }}
                        />
                        <label className="text-sm">{brand}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold capitalize">{category.name}</h2>
                <p className="text-muted-foreground">
                  {filteredProducts.length} products found
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                  {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-6'
              }>
                {filteredProducts.map((product, index) => (
                  <div key={product.id} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <ProductCard 
                      product={product}
                      className={viewMode === 'list' ? 'flex-row' : ''}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or browse other categories
                  </p>
                  <Button onClick={() => {
                    setPriceRange([0, 10000]);
                    setSelectedBrands([]);
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Category Info */}
        <Card className="mt-16 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4 capitalize">
              About {category.name} Components
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Applications</h4>
                <p className="text-muted-foreground text-sm">
                  Our {category.name.toLowerCase()} components are perfect for automation projects, 
                  robotics applications, IoT devices, and industrial control systems.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quality Assurance</h4>
                <p className="text-muted-foreground text-sm">
                  All products undergo rigorous testing and quality control to ensure 
                  reliable performance in demanding environments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}