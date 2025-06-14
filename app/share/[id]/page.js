'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SharePromptDetail({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { language, t } = useLanguage();
  const [prompt, setPrompt] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetch(`/api/share/${id}`)
        .then((response) => response.json())
        .then((data) => setPrompt({...data, tags: data.tags ? data.tags.split(',') : []}))
        .catch((error) => console.error('Error fetching prompt:', error));
    }
  }, [id]);

  const handleVersionChange = (newId) => {
    if (newId !== id) {
      router.push(`/share/${newId}`);
    }
  };

  if (!t) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  const tp = t.sharePage;
  if (!tp) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

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
    <div className="bg-gradient-to-b from-background to-secondary/5 py-12">
      <div className="mx-auto p-4 sm:p-6 max-w-4xl">
        <Card className="border-none shadow-2xl backdrop-blur-sm bg-background/80">
          <CardContent className="p-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-foreground [-webkit-background-clip:text] [background-clip:text] text-transparent drop-shadow-sm">
              {prompt.title}
            </h1>
            
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b border-border/50 pb-6">
                <div className="flex items-center px-4 py-2 rounded-xl bg-primary/5 shadow-sm">
                  <svg className="w-4 h-4 mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(prompt.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  {prompt.versions && prompt.versions.length > 1 ? (
                      <Select onValueChange={handleVersionChange} value={id}>
                        <SelectTrigger className="w-full bg-primary/5 shadow-sm border-none rounded-xl px-4 py-2">
                          <SelectValue placeholder="Select a version" />
                        </SelectTrigger>
                        <SelectContent>
                          {prompt.versions.map((v) => (
                            <SelectItem key={v.id} value={v.id}>
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span className='pr-2'>Version {v.version}</span>
                                {/* <span className="text-xs text-muted-foreground">({new Date(v.created_at).toLocaleDateString()})</span> */}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  ) : (
                    <div className="flex items-center px-4 py-2 rounded-xl bg-primary/5 shadow-sm">
                      <svg className="w-4 h-4 mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Version {prompt.version}
                    </div>
                  )}
                </div>
                {prompt.tags?.length > 0 && prompt.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="px-4 py-2 rounded-xl bg-primary/5 shadow-sm"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {prompt.description}
                </p>

                <div className="relative">
                  <div className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <div className="rounded-2xl border border-border/50 bg-secondary/5 backdrop-blur-sm overflow-hidden shadow-lg">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-secondary/10">
                      <div className="text-sm font-medium text-muted-foreground">
                        {tp.contentTitle}
                      </div>
                      <Button
                        onClick={handleCopy}
                        variant={copySuccess ? "success" : "secondary"}
                        className="relative px-4 py-2 text-sm font-medium"
                        size="sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-12a2 2 0 00-2-2h-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {copySuccess ? tp.copyButtonSuccess : tp.copyButton}
                      </Button>
                    </div>
                    <div className="p-6 max-h-[600px] overflow-y-auto bg-gradient-to-b from-transparent to-secondary/5">
                      <p className="text-base leading-relaxed whitespace-pre-wrap font-mono selection:bg-primary/20">
                        {prompt.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 