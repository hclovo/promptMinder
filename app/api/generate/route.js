export async function POST(request) {
  try {
    const body = await request.json();
    
    // 添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

    const response = await fetch('https://www.promptate.xyz/api/structure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: body.text }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

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
    if (error.name === 'AbortError') {
      return Response.json({ error: '请求超时' }, { status: 408 });
    }
    console.error('优化错误:', error);
    return Response.json({ error: '优化失败' }, { status: 500 });
  }
} 