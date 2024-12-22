'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { Spinner } from '@/app/components/ui/Spinner';
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SharePromptDetail({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const [prompt, setPrompt] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/share/${id}`)
        .then((response) => response.json())
        .then((data) => setPrompt({...data, cover_img: data.cover_img ? data.cover_img : null, tags: data.tags ? data.tags.split(',') : []}))
        .catch((error) => console.error('Error fetching prompt:', error));
    }
  }, [id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (!prompt) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 sm:p-6 max-w-4xl">
      {prompt.cover_img && (
        <Card className="mb-6 bg-gradient-to-b from-background to-secondary/20 border-none">
          <CardContent className="p-0">
            <div className="rounded-lg overflow-hidden h-[200px] relative">
              <Image 
                src={prompt.cover_img} 
                alt={prompt.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                width={1200}
                height={800}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-lg bg-gradient-to-br from-background to-secondary/10">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                {prompt.title}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {prompt.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(prompt.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Version {prompt.version}
                </div>
                {prompt.tags?.length > 0 && prompt.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="bg-primary/5 hover:bg-primary/10 transition-colors duration-200"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={handleCopy}
              variant={copySuccess ? "success" : "secondary"}
              className="relative overflow-hidden group"
            >
              <svg className={`w-4 h-4 mr-2 transition-transform duration-300 ${copySuccess ? "rotate-0" : "rotate-0"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-12a2 2 0 00-2-2h-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {copySuccess ? '已复制' : '复制提示词'}
            </Button>
          </div>

          <Card className="border border-primary/10 bg-secondary/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <span className="bg-primary/10 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                提示词内容
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-secondary/30 p-4 max-h-[600px] overflow-y-auto">
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {prompt.content}
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
} 