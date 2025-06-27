import { NextResponse } from 'next/server';
import { PromptService } from '@/server/service/promptService';

export async function POST(request, { params }) {
  const { id } = await params;
  // 检查提示词是否存在
  const {status: checkStatus, data: prompt, error: checkError} = await PromptService.getPromptById({
    id: id,
  });
  
  if (checkStatus === false) {
    return NextResponse.json(
      { error: checkError },
      { status: 404 }
    );
  }

  // 更新 is_public 为 true
  const {status: updateStatus, error: updateError} = await PromptService.updateIsPublic({
    id: id,
  });

  if (updateStatus === false) {
    return NextResponse.json({ error: updateError }, { status: 500 });
  }

  return NextResponse.json({ message: 'Prompt shared successfully' });
}
