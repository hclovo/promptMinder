import { NextResponse } from 'next/server';
import { PromptService } from '@/server/service/promptService';

export async function GET(request) {  
  // 从 URL 中获取 tag 参数
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');

  let prompts = [];
  let getError = null;
  let getStatus = false;

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

    // 返回前处理日期字段
    const processedData = {
      ...newPrompt,
      createdAt: newPrompt.createdAt.toISOString(),
      updatedAt: newPrompt.updatedAt.toISOString()
    };
    return NextResponse.json(processedData);
  } catch (error) {
    console.error('error:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// 移除Clerk引用
// import { auth } from '@clerk/nextjs/server'

// 硬编码用户ID
const userId = '1';