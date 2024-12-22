export async function POST(request) {
  try {
    const body = await request.json();
    
    const response = await fetch('https://www.promptate.xyz/api/structure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: body.text }),
    });

    if (!response.ok) {
      throw new Error('优化请求失败');
    }

    // 返回流式响应
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
    
  } catch (error) {
    console.error('优化错误:', error);
    return Response.json({ error: '优化失败' }, { status: 500 });
  }
} 