import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'

export async function POST(request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  try {
    const { sourceId } = await request.json();

    // 获取要复制的提示词
    const { data: sourcePrompt, error: fetchError } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', sourceId)
      .eq('is_public', true)
      .single();

    if (fetchError || !sourcePrompt) {
      return NextResponse.json({ error: 'Prompt not found or not public' }, { status: 404 });
    }

    // 检查用户是否是原创建者
    if (sourcePrompt.user_id === userId) {
      return NextResponse.json({ error: 'Cannot copy your own prompt' }, { status: 400 });
    }

    // 创建新的提示词副本
    const newPromptData = {
      id: crypto.randomUUID(),
      title: sourcePrompt.title,
      content: sourcePrompt.content,
      description: sourcePrompt.description,
      tags: sourcePrompt.tags,
      version: '1.0.0', // 重置版本为1.0.0
      user_id: userId,
      is_public: false, // 复制的提示词默认为私有
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      cover_img: sourcePrompt.cover_img
    };

    const { data: newPrompt, error: insertError } = await supabase
      .from('prompts')
      .insert([newPromptData])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
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