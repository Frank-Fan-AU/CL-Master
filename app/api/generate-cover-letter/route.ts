import { NextResponse } from 'next/server';


// 初始化 OpenAI 客户端
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const MAX_GUEST_GENERATIONS = 3;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, location, jobRequirements, emphasis } = body;

    // 模拟 API 处理延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 生成假的 cover letter
    const fakeCoverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the position at ${companyName} in ${location}. With my background and experience, I believe I would be a valuable addition to your team.

${emphasis}

Key Qualifications:
${jobRequirements.split('\n').map((req: string) => `• ${req.trim()}`).join('\n')}

I am particularly drawn to this opportunity because of ${companyName}'s reputation for innovation and excellence. I am confident that my skills and experience align well with your requirements, and I am excited about the possibility of contributing to your team.

Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to ${companyName}'s continued success.

Best regards,
[Your Name]`;

    return NextResponse.json({ coverLetter: fakeCoverLetter });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
} 