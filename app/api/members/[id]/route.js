import connectDB from '@/lib/mongodb';
import Member from '@/models/Member';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const member = await Member.findById(params.id);
    
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch member' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, grade, improvement, decline, targetRole, circleRole, monova, remarks } = body;

    const member = await Member.findByIdAndUpdate(
      params.id,
      { name, grade, improvement, decline, targetRole, circleRole, monova, remarks },
      { new: true, runValidators: true }
    );

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const member = await Member.findByIdAndDelete(params.id);
    
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Member deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}
