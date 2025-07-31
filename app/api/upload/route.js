import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 将 File 对象转换为 Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // 使用 sharp 压缩图片
    const compressedImageBuffer = await sharp(buffer)
      .resize(600, null, { // 设置最大宽度为1200px，高度自适应
        withoutEnlargement: true, // 如果原图小于这个尺寸，则不放大
        fit: 'inside'
      })
      .jpeg()
      .toBuffer();

    // 获取文件扩展名
    const fileExtension = 'jpg'; // 统一转换为jpg格式
    const fileName = `${Date.now()}.${fileExtension}`;
    
    // TODO: Implement alternative file storage solution
    // For now, return a placeholder response
    return NextResponse.json({ 
      message: 'File processed successfully',
      fileName: fileName,
      size: compressedImageBuffer.length 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 