import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server'

export async function GET(request) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  const { userId } = await auth()
  
  // 从 URL 中获取查询参数
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  let query = supabase
    .from('prompts')
    .select('*')
    .eq('user_id', userId);
    
  // 如果存在 tag 参数，添加过滤条件
  if (tag) {
    query = query.contains('tags', [tag]);
  }

  // 分页查询
  query = query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const { data: prompts, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 获取总数
  let countQuery = supabase
    .from('prompts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
    
  if (tag) {
    countQuery = countQuery.contains('tags', [tag]);
  }

  const { count, error: countError } = await countQuery;

  if (countError) {
    console.error('Count error:', countError);
  }

  return NextResponse.json({
    prompts,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    }
  });
}

export async function POST(request) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  const { userId } = await auth();

  try {
    const data = await request.json();
    const promptData = {
      id: crypto.randomUUID(),
      ...data,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_public: true
    };

    const { data: newPrompt, error } = await supabase
      .from('prompts')
      .insert([promptData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(newPrompt[0]);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 