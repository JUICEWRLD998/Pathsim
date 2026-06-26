import { NextRequest, NextResponse } from 'next/server';
import { PROMPTS } from '@/lib/prompts';
import type { GeminiRequest } from '@/types/api';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body: GeminiRequest = await req.json();
    const { promptKey, variables } = body;

    if (!PROMPTS[promptKey]) {
      return NextResponse.json({ error: 'Invalid prompt key' }, { status: 400 });
    }

    // Build prompt by substituting variables
    let prompt = PROMPTS[promptKey];
    for (const [key, value] of Object.entries(variables)) {
      prompt = prompt.replaceAll(`{${key}}`, value);
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
        'X-Title': 'PathSim AI',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content:
              'You are PathSim AI. Always respond with valid JSON only. No markdown, no explanation — pure JSON.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', errorText);
      try {
        const errorJson = JSON.parse(errorText);
        const errorMessage = errorJson.error?.message || errorJson.error || 'AI service error';
        return NextResponse.json({ error: errorMessage, details: errorJson }, { status: response.status });
      } catch {
        return NextResponse.json({ error: errorText || 'AI service error' }, { status: response.status });
      }
    }

    const result = await response.json();
    const raw = result.choices?.[0]?.message?.content as string;

    if (!raw) {
      return NextResponse.json({ error: 'Empty AI response' }, { status: 500 });
    }

    // Strip markdown code fences if model wraps in them
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();

    try {
      const data = JSON.parse(cleaned);

      // If this was a custom career generation, save it to the DB!
      if (promptKey === 'custom_career_generation') {
        const user = await getSessionUser();
        const customCareer = db.createCustomCareer({
          title: data.title || variables.title || 'Custom Career',
          cluster: data.cluster || 'tech',
          color: data.color || '#818cf8',
          description: data.description || '',
          salary: data.salary || { entry: 50000, mid: 80000, senior: 120000 },
          skills: data.skills || [],
          education: data.education || '',
          growthRate: data.growthRate || '',
          dayInLife: data.dayInLife || '',
          relatedTo: [],
          iconName: data.iconName || 'Sparkles',
          isCustom: true,
          createdBy: user?.id || 'anonymous',
        });
        return NextResponse.json({ data: customCareer });
      }

      return NextResponse.json({ data });
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response', raw }, { status: 500 });
    }
  } catch (error) {
    console.error('Gemini route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
