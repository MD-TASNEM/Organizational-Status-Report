import connectDB from '@/lib/mongodb';
import Member from '@/models/Member';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const members = await Member.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Member.countDocuments();

    return NextResponse.json({
      members,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, grade, improvement, decline, targetRole, circleRole, monova, remarks } = body;

    if (!name || !grade || improvement === undefined || decline === undefined || !targetRole || !circleRole || !monova || !remarks) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const member = await Member.create({
      name,
      grade,
      improvement,
      decline,
      targetRole,
      circleRole,
      monova,
      remarks
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    );
  }
}
