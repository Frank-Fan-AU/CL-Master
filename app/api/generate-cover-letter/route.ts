import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const { companyName, location, jobRequirements, emphasis, isFreeGeneration } = await request.json();

    // 如果用户未登录且不是免费生成，则返回错误
    if (!user && !isFreeGeneration) {
      return NextResponse.json(
        { error: 'Please sign in to generate cover letters' },
        { status: 401 }
      );
    }

    const prompt = `Write a professional cover letter for a job application with the following details:
    Company: ${companyName}
    Location: ${location}
    Job Requirements: ${jobRequirements}
    Emphasis: ${emphasis}

    Requirements:
    1. Keep it professional and concise
    2. Highlight relevant experience and skills
    3. Show enthusiasm for the role
    4. Include a clear call to action
    5. Format it properly with paragraphs
    6. Keep it under 400 words`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const coverLetter = completion.choices[0].message.content;

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
} 