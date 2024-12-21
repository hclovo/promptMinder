import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const DEFAULT_API_KEY = process.env.ZHIPU_API_KEY;

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages, apiKey, model = 'glm-4-flash', systemPrompt, temperature = 0.5 } = body;

    const finalApiKey = apiKey || DEFAULT_API_KEY;
    
    if (!finalApiKey) {
      throw new Error('未提供 API Key');
    }

    // 创建 OpenAI 客户端实例，配置智谱 AI 的基础 URL
    const openai = new OpenAI({
      apiKey: finalApiKey,
      baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    });
    // 准备发送给 AI 的消息
    const aiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ].filter(msg => msg.content);

    // 使用 OpenAI SDK 发送请求
    const completion = await openai.chat.completions.create({
      model: model,
      messages: aiMessages,
      temperature: temperature,
      stream: false
    });

    return NextResponse.json(completion);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || '处理请求时发生错误' },
      { status: 500 }
    );
  }
} 