import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const run = await req.json();

    if (!run.id || !run.careerId || !run.careerTitle) {
      return NextResponse.json({ error: 'Missing simulation run fields' }, { status: 400 });
    }

    const savedRun = db.upsertSimulation({
      id: run.id,
      userId: user.id,
      careerId: run.careerId,
      careerTitle: run.careerTitle,
      currentScenarioIndex: run.currentScenarioIndex ?? 0,
      history: run.history || [],
      score: run.score || 0,
      completed: run.completed || false,
      outcome: run.outcome,
      createdAt: run.createdAt || new Date().toISOString(),
    });

    return NextResponse.json({ data: savedRun });
  } catch (error) {
    console.error('Save simulation run error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
