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

    // 返回前处理日期字段，确保字段名与前端一致
    const processedData = {
      ...newPrompt,
      created_at: newPrompt.createdAt?.toISOString() || newPrompt.created_at,
      updated_at: newPrompt.updatedAt?.toISOString() || newPrompt.updated_at
    };
    // 删除驼峰命名的字段，避免混淆
    delete processedData.createdAt;
    delete processedData.updatedAt;
    
    return NextResponse.json(processedData);
  } catch (error) {
    console.error('error:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// 硬编码用户ID
const userId = '1';