import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import Product from '@/lib/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get active categories
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });

    // If no categories exist, generate from products
    if (categories.length === 0) {
      const products = await Product.find({ isActive: true }).distinct('category');
      const generatedCategories = products.map((category) => ({
        _id: category,
        name: category,
        description: `${category.charAt(0).toUpperCase() + category.slice(1)} products`,
        icon: 'settings', // Default icon for generated categories
        isActive: true,
      }));
      return NextResponse.json({ categories: generatedCategories });
    }

    // Add product count and optional icon to each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category.name,
          isActive: true,
        });
        return {
          ...category.toObject(),
          productCount,
          icon: category.icon || 'settings', // Ensure icon is included
        };
      })
    );

    return NextResponse.json({ categories: categoriesWithCount });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}