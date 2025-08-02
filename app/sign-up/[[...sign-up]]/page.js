import { SignUp } from "@clerk/nextjs";
import { OptimizedImage } from "@/components/ui/optimized-image";

export default function Page() {
  return (
    <div className="flex h-screen">
      {/* 左侧背景图片 */}
      <div className="relative hidden lg:block lg:w-1/2">
        <OptimizedImage
          src="/login-bg.jpg"
          alt="PromptMinder background"
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
      </div>
      
      {/* 右侧登录表单 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <SignUp />
      </div>
    </div>
  );
}
