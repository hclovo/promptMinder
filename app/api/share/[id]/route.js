import { NextResponse } from 'next/server';
import { PromptService } from '@/server/service/promptService';
export async function GET(request, { params }) {
  const { id } = params;
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  
  // First, get the requested prompt
  // const { data: prompt, error: promptError } = await supabase
  //   .from('prompts')
  //   .select('*')
  //   .eq('id', id)
  //   .eq('is_public', true)
  //   .single();
  const {status, data: prompt, error: promptError} = await PromptService.getPromptById({
    id: id,
  });

  if (promptError) {
    return NextResponse.json({ error: promptError }, { status: 500 });
  }

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt not found or not public' }, { status: 404 });
  }

  // Then, get all versions of this prompt
  const { status: versionsStatus, data: versions, error: versionsError } = await PromptService.getPromptVersions({
    title: prompt.title,
  });

  if (versionsError) {
    // We can still return the main prompt even if versions fail
    console.error('Error fetching versions:', versionsError);
  }

  // Attach versions to the prompt object
  prompt.versions = versions || [];

  return NextResponse.json(prompt);
} 