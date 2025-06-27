import { NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs/server'
import { PromptService } from '@/server/service/promptService';


export async function GET(request, { params }) {
  const { id } = await params;
  const { status, data: prompt, error: error } = await PromptService.getPromptById({
    id,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
  }

  return NextResponse.json(prompt);
}

export async function POST(request, { params }) {
  const { id } = await params;

  const { title, content, description, is_public, tags, image_url, version } = await request.json();

  const { status, data: prompt, error: fetchError } = await PromptService.getPromptById({
    id,
  })

  if (fetchError || !prompt) {
    return NextResponse.json({ error: fetchError ? fetchError.message : 'Prompt not found' }, { status: 500 });
  }

  const updateData = {
    updated_at: new Date().toISOString(),
    user_id: userId
  };
  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;
  if (description !== undefined) updateData.description = description;
  if (is_public !== undefined) updateData.is_public = is_public;
  if (tags !== undefined) updateData.tags = tags;
  if (image_url !== undefined) updateData.cover_img = image_url;
  if (version !== undefined) updateData.version = version;

  const { updateStatus, data: updatedPrompt, error: updateError } = await PromptService.updatePrompt({
    id,
    updateData
  })

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Prompt updated successfully', version: version });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const { userId } = await auth()
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  // 检查提示词是否存在
  const { data: prompt, error: checkError } = await supabase
    .from('prompts')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (checkError || !prompt) {
    return NextResponse.json(
      { error: checkError ? checkError.message : 'Prompt not found' }, 
      { status: 404 }
    );
  }

  // 执行删除操作
  const { error: deleteError } = await supabase
    .from('prompts')
    .delete()
    .eq('id', id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Prompt deleted successfully' });
} 