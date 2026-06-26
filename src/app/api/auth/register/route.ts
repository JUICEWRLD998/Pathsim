import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Create user
    const passwordHash = hashPassword(password);
    const user = db.createUser({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    // Initialize an empty profile for the new user
    db.upsertProfile({
      userId: user.id,
      quizCompleted: false,
      recommendations: [],
      personalityProfile: '',
      answers: [],
    });

    // Create session cookie
    await createSession(user.id);

    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json({ data: safeUser });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
