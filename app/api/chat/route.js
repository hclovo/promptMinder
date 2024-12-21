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
      stream: true
    });

    // 创建一个新的 ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            // 获取当前块的内容
            const content = chunk.choices[0]?.delta?.content || '';
            // 将内容编码为 UTF-8
            const bytes = new TextEncoder().encode(content);
            // 将内容推送到流中
            controller.enqueue(bytes);
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    // 返回流式响应
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || '处理请求时发生错误' },
      { status: 500 }
    );
  }
} 