import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/lib/models/Lead';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const supportData = await request.json();

    // Create a lead for the technical support request
    const lead = new Lead({
      name: supportData.name,
      email: supportData.email,
      phone: supportData.phone,
      company: supportData.company,
      source: 'technical_support',
      interests: ['technical_support', supportData.category],
      notes: `Technical Support Request\n\nProduct: ${supportData.product}\nCategory: ${supportData.category}\nPriority: ${supportData.priority}\n\nIssue Description:\n${supportData.description}\n\nSteps Taken:\n${supportData.steps_taken}`,
      customFields: {
        product: supportData.product,
        category: supportData.category,
        priority: supportData.priority,
        issueDescription: supportData.description,
        stepsTaken: supportData.steps_taken
      }
    });

    await lead.save();

    return NextResponse.json({ 
      message: 'Technical support request submitted successfully!',
      ticketId: lead._id 
    }, { status: 201 });
  } catch (error) {
    console.error('Technical support request error:', error);
    return NextResponse.json(
      { error: 'Failed to submit technical support request' },
      { status: 500 }
    );
  }
}