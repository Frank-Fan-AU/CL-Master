import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_GUEST_GENERATIONS = 3;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, location, jobRequirements, emphasis } = body;

    const prompt = `#角色定位
你是一个有十年澳洲开发经验的全栈开发程序员，现在已经是一个部门leader了，经常筛选简历，cover letter，并且你非常擅长在澳大利亚找IT工作，非常擅长写cover letter。

#核心任务
根据以下信息生成一份专业的 cover letter：
1. 公司名称：${companyName}
2. 工作地点：${location}
3. 职位要求：${jobRequirements}
4. 需要强调的点：${emphasis}

要求：
1. 根据我的情况和公司的岗位要求，适度美化
2. 强调我会的技术
3. 如果公司不在阿德莱德，要补充我愿意搬家到公司所在地
4. 文风要自然，不要太AI化
5. 日期使用今天的日期，格式为 yyyy-mm-dd
6. 包含我的联系方式：
   - email: fanzejiea@gmail.com
   - phone: 411936898

请生成一份专业的英文 cover letter。`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
    });

    const coverLetter = completion.choices[0].message.content;

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
} 