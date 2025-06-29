import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/lib/analytics';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();
    
    // Get user info if available
    const user = getUserFromRequest(request);
    
    // Get request metadata
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1';
    const referrer = request.headers.get('referer');

    const analyticsEvent = {
      ...eventData,
      userId: user?.userId,
      userAgent,
      ipAddress,
      referrer,
    };

    await analyticsService.trackEvent(analyticsEvent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const startDate = new Date(searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const endDate = new Date(searchParams.get('endDate') || new Date());

    let data;

    switch (type) {
      case 'page_views':
        data = await analyticsService.getPageViews(startDate, endDate);
        break;
      case 'top_products':
        data = await analyticsService.getTopProducts(startDate, endDate);
        break;
      case 'conversion_funnel':
        data = await analyticsService.getConversionFunnel(startDate, endDate);
        break;
      case 'search_analytics':
        data = await analyticsService.getSearchAnalytics(startDate, endDate);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid analytics type' },
          { status: 400 }
        );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}