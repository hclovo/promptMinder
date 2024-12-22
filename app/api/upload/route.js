import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

// 初始化 Supabase 客户端
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

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
    
    // 上传压缩后的图片到 Supabase Storage
    const { data, error } = await supabase.storage
      .from('cover')
      .upload(fileName, compressedImageBuffer, {
        contentType: 'image/jpeg'
      }); 

    if (error) {
      throw error;
    }

    // 获取文件的公共URL
    const { data: { publicUrl } } = supabase.storage
      .from('cover')
      .getPublicUrl(fileName);
    
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 