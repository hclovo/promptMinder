import { NextResponse } from 'next/server';
import { PromptService } from '@/server/service/promptService';

export async function GET(request) {  
  // 从 URL 中获取 tag 参数
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');

  const prompts = [];
  const getError = null;
  const getStatus = false;

  if (tag) {
    let response = await PromptService.getPromptByTags({
      tags: tag,
    });
    prompts = response.data;
    getError = response.error;
    getStatus = response.status;
  } else {
    // 获取所有公开的
    let result = await PromptService.getAllPrompts();
    prompts = result.data;
    getError = result.error;
    getStatus = result.status;
  }

  if (getError) {
    return NextResponse.json({ error: getError }, { status: 500 });
  }

  return NextResponse.json(prompts);
}

export async function POST(request) {
  try {
    const data = await request.json();
    const promptData = {
      ...data,
      is_public: true
    };

    const { status, data: newPrompt, error } = await PromptService.insertPrompt({
      ...promptData
    });

    if (error) {
      console.error('error:', error);
      return NextResponse.json({ error: error }, { status: 500 });
    }

    return NextResponse.json(newPrompt[0]);
  } catch (error) {
    console.error('error:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
} 