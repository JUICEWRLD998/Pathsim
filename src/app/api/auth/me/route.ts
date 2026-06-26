import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const profile = db.getProfile(user.id) || {
      userId: user.id,
      quizCompleted: false,
      recommendations: [],
      personalityProfile: '',
      answers: [],
    };

    const simulations = db.getSimulations(user.id);
    const customCareers = db.getCustomCareers();

    return NextResponse.json({
      authenticated: true,
      user,
      profile,
      simulations,
      customCareers,
    });
  } catch (error) {
    console.error('Fetch session user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
