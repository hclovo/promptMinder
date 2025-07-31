import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check - you can add more checks here if needed
    // such as database connectivity, external services, etc.
    
    return NextResponse.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'PromptMinder'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}