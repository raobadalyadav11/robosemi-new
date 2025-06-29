import Analytics from './models/Analytics';
import connectDB from './mongodb';

export interface AnalyticsEvent {
  type: 'page_view' | 'product_view' | 'add_to_cart' | 'purchase' | 'search' | 'email_open' | 'email_click';
  userId?: string;
  sessionId: string;
  productId?: string;
  orderId?: string;
  campaignId?: string;
  page?: string;
  searchQuery?: string;
  value?: number;
  metadata?: Record<string, any>;
  userAgent: string;
  ipAddress: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export class AnalyticsService {
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      await connectDB();
      
      const analyticsEvent = new Analytics(event);
      await analyticsEvent.save();
    } catch (error) {
      console.error('Analytics tracking error:', error);
      // Don't throw error to avoid breaking user experience
    }
  }

  async getPageViews(startDate: Date, endDate: Date): Promise<any[]> {
    await connectDB();
    
    return Analytics.aggregate([
      {
        $match: {
          type: 'page_view',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          views: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          date: '$_id',
          views: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      },
      { $sort: { date: 1 } }
    ]);
  }

  async getTopProducts(startDate: Date, endDate: Date, limit: number = 10): Promise<any[]> {
    await connectDB();
    
    return Analytics.aggregate([
      {
        $match: {
          type: 'product_view',
          productId: { $exists: true },
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$productId',
          views: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $project: {
          product: { $arrayElemAt: ['$product', 0] },
          views: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      },
      { $sort: { views: -1 } },
      { $limit: limit }
    ]);
  }

  async getConversionFunnel(startDate: Date, endDate: Date): Promise<any> {
    await connectDB();
    
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      }
    ];

    const results = await Analytics.aggregate(pipeline);
    
    const funnel = {
      page_views: 0,
      product_views: 0,
      add_to_cart: 0,
      purchases: 0
    };

    results.forEach(result => {
      if (result.type in funnel) {
        funnel[result.type as keyof typeof funnel] = result.count;
      }
    });

    return funnel;
  }

  async getSearchAnalytics(startDate: Date, endDate: Date): Promise<any[]> {
    await connectDB();
    
    return Analytics.aggregate([
      {
        $match: {
          type: 'search',
          searchQuery: { $exists: true, $ne: '' },
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$searchQuery',
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          query: '$_id',
          count: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 50 }
    ]);
  }
}

export const analyticsService = new AnalyticsService();