export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: any;
}

export function generateProductSEO(product: any): SEOData {
  const title = `${product.name} - Buy Online at Best Price | RoboSemi`;
  const description = `${product.description.substring(0, 150)}... ✓ Best Price ✓ Fast Delivery ✓ Genuine Products ✓ 1 Year Warranty`;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "offers": {
      "@type": "Offer",
      "price": product.discount ? product.price * (1 - product.discount / 100) : product.price,
      "priceCurrency": "INR",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "RoboSemi"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount
    }
  };

  return {
    title,
    description,
    keywords: [product.name, product.brand, product.category, 'automation', 'electronics'],
    ogTitle: title,
    ogDescription: description,
    ogImage: product.images[0],
    ogType: 'product',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: product.images[0],
    structuredData
  };
}

export function generateCategorySEO(category: string, products: any[]): SEOData {
  const title = `${category.charAt(0).toUpperCase() + category.slice(1)} - Buy Online | RoboSemi`;
  const description = `Shop ${category} products online at RoboSemi. ✓ Best Prices ✓ Fast Delivery ✓ ${products.length}+ Products ✓ Genuine Quality`;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": `https://robosemi.com/products?category=${category}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "url": `https://robosemi.com/products/${product._id}`
        }
      }))
    }
  };

  return {
    title,
    description,
    keywords: [category, 'automation', 'electronics', 'buy online'],
    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    structuredData
  };
}

export function generateBlogSEO(blog: any): SEOData {
  const title = `${blog.title} | RoboSemi Blog`;
  const description = blog.excerpt;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt,
    "image": blog.featuredImage,
    "author": {
      "@type": "Person",
      "name": blog.author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "RoboSemi",
      "logo": {
        "@type": "ImageObject",
        "url": "https://robosemi.com/logo.png"
      }
    },
    "datePublished": blog.publishedAt,
    "dateModified": blog.updatedAt
  };

  return {
    title,
    description,
    keywords: blog.tags,
    ogTitle: title,
    ogDescription: description,
    ogImage: blog.featuredImage,
    ogType: 'article',
    twitterCard: 'summary_large_image',
    structuredData
  };
}