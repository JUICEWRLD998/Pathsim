import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quizCompleted, recommendations, personalityProfile, answers } = await req.json();

    const profile = db.upsertProfile({
      userId: user.id,
      quizCompleted,
      recommendations,
      personalityProfile,
      answers,
    });

    return NextResponse.json({ data: profile });
  } catch (error) {
    console.error('Save profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
