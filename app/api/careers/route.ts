import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/lib/models/Lead';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const applicationData = await request.json();

    // Create a lead for the job application
    const lead = new Lead({
      name: applicationData.name,
      email: applicationData.email,
      phone: applicationData.phone,
      source: 'careers',
      interests: ['careers', applicationData.position],
      notes: `Job Application for ${applicationData.position}\n\nExperience: ${applicationData.experience}\n\nCover Letter: ${applicationData.coverLetter}`,
      customFields: {
        position: applicationData.position,
        experience: applicationData.experience,
        resumeUploaded: !!applicationData.resume
      }
    });

    await lead.save();

    return NextResponse.json({ 
      message: 'Application submitted successfully!',
      applicationId: lead._id 
    }, { status: 201 });
  } catch (error) {
    console.error('Career application error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}