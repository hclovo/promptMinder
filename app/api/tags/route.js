import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { TagService } from '@/server/service/tagService';

export async function GET(request) {
  
  const { status: getStatus, data: publicTags, error: getError } = await TagService.getAllTags();

  console.log(getStatus, publicTags, getError);
  if (getError) {
    return NextResponse.json({ error: getError.message }, { status: 500 });
  }

  return NextResponse.json(publicTags);
}

export async function POST(request) {

  const { name, isPublic } = await request.json();

  const { status: createStatus, data: newTag, error: createError } = await TagService.createTag({
    name: name,
  });
  
  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 500 });
  }

  return NextResponse.json(newTag);
}

export async function DELETE(request) {

  
  try {
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('id');

    // 首先检查标签是否存在
    const {status: status, data: tag, error: fetchError} = await TagService.getTagById({
      id: tagId,
    });

    if (fetchError) {
      return NextResponse.json({ error: '标签不存在' }, { status: 404 });
    }

    // 检查是否是公共标签
    if (!tag.user_id) {
      return NextResponse.json({ error: '不能删除公共标签' }, { status: 403 });
    }


    // 执行删除操作
    const { status: deleteStatus, error: deleteError } = await TagService.deleteTagById({
      id: tagId,
    });

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  
  
  try {
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('id');
    const { name } = await request.json();

    // 首先检查标签是否存在
    const { status: checkStatus, data: tag, error: fetchError } = await TagService.getTagById({
      id: tagId,
    });

    if (fetchError) {
      return NextResponse.json({ error: '标签不存在' }, { status: 404 });
    }

    // 执行更新操作
    const { status: updateStatus, data: updatedTag, error: updateError } = await TagService.updateTagById({
      id: tagId,
      name: name,
    });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(updatedTag);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 