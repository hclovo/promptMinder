import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-zinc-900 dark:via-black dark:to-zinc-900">
      <div className="w-full max-w-md">

        {/* 表单容器 */}
        <div className="backdrop-blur p-4 sm:p-6 shadow">
          <SignIn />
        </div>
      </div>
    </div>
  );
}