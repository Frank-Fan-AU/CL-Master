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

    let userProfileResume = '';
    // 如果用户已登录，获取用户的简历信息
    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('resume')
        .eq('id', user.id)
        .single();
      
      if (profileData?.resume) {
        userProfileResume = profileData.resume;
      }
    }

    let subscription = null;
    // 检查已登录用户的生成次数限制
    if (user) {
      // 获取用户的订阅状态
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single();
      
      subscription = subData;

      // 如果用户未订阅，检查生成次数
      if (subscription?.status !== 'active') {
        const { data: generationRecord } = await supabase
          .from('user_generations')
          .select('count')
          .eq('user_id', user.id)
          .single();

        if (generationRecord && generationRecord.count >= 20) {
          return NextResponse.json(
            { error: 'You have reached your generation limit (20 generations). Please subscribe for unlimited generations.' },
            { status: 403 }
          );
        }
      }
    }

    const prompt = `Write a professional cover letter for a job application with the following details:
    Company: ${companyName}
    Location: ${location}
    Job Requirements: ${jobRequirements}
    Emphasis: ${emphasis}
    ${userProfileResume ? `Candidate's Resume: ${userProfileResume}` : ''}

    Requirements:
    1. Keep it professional and concise
    2. Highlight relevant experience and skills from the resume
    3. Show enthusiasm for the role
    4. Include a clear call to action
    5. Format it properly with paragraphs
    6. Keep it under 400 words
    7. If the company is not in the candidate's current location, mention willingness to relocate
    8. Use the candidate's resume to write the cover letter
    9. use company's info to write the cover letter
    10. Use the user's contact information to replace the contact information in the template`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const coverLetter = completion.choices[0].message.content;

    // 如果是已登录用户且未订阅，更新生成次数
    if (user && subscription?.status !== 'active') {
      // 先检查是否存在记录
      const { data: existingRecord } = await supabase
        .from('user_generations')
        .select('count')
        .eq('user_id', user.id)
        .single();

      if (existingRecord) {
        // 如果记录存在，更新计数
        const { error: updateError } = await supabase
          .from('user_generations')
          .update({ count: existingRecord.count + 1 })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error updating generation count:', updateError);
        }
      } else {
        // 如果记录不存在，创建新记录
        const { error: insertError } = await supabase
          .from('user_generations')
          .insert({ user_id: user.id, count: 1 });

        if (insertError) {
          console.error('Error inserting generation count:', insertError);
        }
      }
    }

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
} 