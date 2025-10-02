import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { journal_id, ai_summary, mood, sentiment_score } = body;
    
    if (!journal_id) {
      return NextResponse.json(
        { error: 'journal_id is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Update the journal entry with AI processing results
    const { data, error } = await supabase
      .from('journals')
      .update({
        ai_summary: ai_summary || null,
        mood: mood || null,
        sentiment_score: sentiment_score || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', journal_id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update journal entry' },
        { status: 500 }
      );
    }

    console.log('Journal updated with AI results:', {
      journal_id,
      ai_summary: ai_summary ? 'provided' : 'null',
      mood: mood || 'null'
    });

    return NextResponse.json({
      success: true,
      message: 'Journal updated with AI analysis',
      data: data
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle CORS for webhook calls
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}