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
    const { sourceId, promptData } = await request.json();

    let dataToCopy = {};

    if (promptData) {
      // Case 1: Importing a prompt from a public (markdown) source
      dataToCopy = {
        title: promptData.role, // 'role' from markdown is the title
        content: promptData.prompt,
        description: `Imported from public collection. Original category: ${promptData.category}`,
        tags: promptData.category || null,
        cover_img: null, // No cover image from markdown
      };
    } else if (sourceId) {
      // Case 2: Copying a prompt that exists in the database
      const { data: sourcePrompt, error: fetchError } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', sourceId)
        .eq('is_public', true)
        .single();

      if (fetchError || !sourcePrompt) {
        return NextResponse.json({ error: 'Prompt not found or not public' }, { status: 404 });
      }

      if (sourcePrompt.user_id === userId) {
        return NextResponse.json({ error: 'Cannot copy your own prompt' }, { status: 400 });
      }
      
      dataToCopy = {
        title: sourcePrompt.title,
        content: sourcePrompt.content,
        description: sourcePrompt.description,
        tags: sourcePrompt.tags,
        cover_img: sourcePrompt.cover_img,
      };

    } else {
      return NextResponse.json({ error: 'Invalid request: Missing sourceId or promptData' }, { status: 400 });
    }

    // Create the new prompt record for the current user
    const newPromptData = {
      id: crypto.randomUUID(),
      title: dataToCopy.title,
      content: dataToCopy.content,
      description: dataToCopy.description,
      tags: dataToCopy.tags,
      version: '1.0.0', // Reset version
      user_id: userId,
      is_public: false, // Imported prompts are private by default
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      cover_img: dataToCopy.cover_img
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