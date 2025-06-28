import { NextResponse } from 'next/server';
import { PromptService } from '@/server/service/promptService';

export async function POST(request) {

  try {
    const { sourceId } = await request.json();

    // 获取要复制的提示词

    const { status, data: sourcePrompt, error: fetchError } = await PromptService.getPromptById({
      id: sourceId,
    })

    if (fetchError || !sourcePrompt) {
      return NextResponse.json({ error: 'Prompt not found or not public' }, { status: 404 });
    }

    // 创建新的提示词副本
    const { status: createStatus, data: newPrompt, error: createError } = await PromptService.insertPrompt({
      title: sourcePrompt.title,
      content: sourcePrompt.content,
      description: sourcePrompt.description,
      tags: sourcePrompt.tags,
      version: '1.0.0', // 重置版本为1.0.0
      is_public: false, // 复制的提示词默认为私有
      cover_img: sourcePrompt.cover_img
    });

    if (createError) {
      console.error('Insert error:', createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Prompt copied successfully',
      prompt: newPrompt
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 