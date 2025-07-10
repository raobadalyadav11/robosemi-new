import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Training from '@/lib/models/Training';
import Registration from '@/lib/models/Registration';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { userName, userEmail, userPhone, trainingId, notes } = await request.json();
    
    // Validate required fields
    if (!userName || !userEmail || !userPhone || !trainingId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone format
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(userPhone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Check if training exists and is active
    const training = await Training.findOne({ _id: trainingId, isActive: true });
    if (!training) {
      return NextResponse.json(
        { error: 'Training not found' },
        { status: 404 }
      );
    }

    // Check if training is full
    if (training.currentParticipants >= training.maxParticipants) {
      return NextResponse.json(
        { error: 'Training is full' },
        { status: 400 }
      );
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      userEmail: userEmail.toLowerCase(),
      trainingId: trainingId
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'You are already registered for this training' },
        { status: 400 }
      );
    }

    // Create registration
    const registration = new Registration({
      userName,
      userEmail: userEmail.toLowerCase(),
      userPhone: userPhone.replace(/\s/g, ''),
      trainingId,
      amount: training.price,
      notes
    });

    await registration.save();
    await registration.populate('trainingId', 'title startDate duration instructor');

    // Update training participant count
    await Training.findByIdAndUpdate(trainingId, {
      $inc: { currentParticipants: 1 }
    });

    return NextResponse.json({
      message: 'Registration successful',
      registration: {
        id: registration._id,
        userName: registration.userName,
        userEmail: registration.userEmail,
        training: registration.trainingId,
        amount: registration.amount,
        status: registration.status,
        registeredAt: registration.registeredAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}