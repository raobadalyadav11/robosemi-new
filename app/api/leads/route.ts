import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/lib/models/Lead';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const skip = (page - 1) * limit;

    let query: any = {};
    
    if (status) query.status = status;
    if (source) query.source = source;

    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Lead.countDocuments(query);

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const leadData = await request.json();
    
    // Extract UTM parameters from headers or request
    const utmSource = request.headers.get('utm-source') || leadData.utmSource;
    const utmMedium = request.headers.get('utm-medium') || leadData.utmMedium;
    const utmCampaign = request.headers.get('utm-campaign') || leadData.utmCampaign;

    const lead = new Lead({
      ...leadData,
      utmSource,
      utmMedium,
      utmCampaign,
      score: calculateLeadScore(leadData),
    });

    await lead.save();

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateLeadScore(leadData: any): number {
  let score = 0;
  
  // Base score
  score += 10;
  
  // Email provided
  if (leadData.email) score += 20;
  
  // Phone provided
  if (leadData.phone) score += 15;
  
  // Company provided
  if (leadData.company) score += 10;
  
  // Source scoring
  const sourceScores: Record<string, number> = {
    'website': 15,
    'referral': 25,
    'social': 10,
    'email': 20,
    'advertisement': 5
  };
  score += sourceScores[leadData.source] || 0;
  
  // Interest scoring
  if (leadData.interests && leadData.interests.length > 0) {
    score += leadData.interests.length * 5;
  }
  
  return Math.min(score, 100); // Cap at 100
}