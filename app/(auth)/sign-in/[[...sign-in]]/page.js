'use client';
import { useState } from 'react';
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import Link from 'next/link';

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setLoading(true);
      setError("");

      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/prompts"); // 登录成功后跳转到提示词列表页
      } else {
        console.error("登录失败:", result);
        setError("登录失败，请检查邮箱和密码是否正确");
      }
    } catch (err) {
      console.error("登录错误:", err);
      setError(err.errors?.[0]?.message || "登录时发生错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      
      <Card className="w-full max-w-md relative z-10 bg-black/50 backdrop-blur-xl border-white/10">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="rounded-lg"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-white">欢迎回来</CardTitle>
          <CardDescription className="text-gray-400">
            登录您的账户以继续使用
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="输入您的邮箱地址"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="输入您的密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? "登录中..." : "登录"}
            </Button>
            <div className="text-sm text-gray-400">
              还没有账户？
              <Link href="/sign-up" className="text-blue-400 hover:text-blue-300 ml-1">
                立即注册
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 