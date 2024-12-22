import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex h-screen">
      {/* 左侧背景图片 */}
      <div className="relative hidden lg:block lg:w-1/2">
        <Image
          src="/login-bg.jpg"
          alt="PromptMinder background"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* 右侧登录表单 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <SignIn />
      </div>
    </div>
  );
}