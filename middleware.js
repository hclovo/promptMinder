import { clerkMiddleware,createRouteMatcher  } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/prompts(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})



// 移除所有认证中间件逻辑
export const config = {
  matcher: [] // 清空路由保护
}