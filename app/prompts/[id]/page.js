'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { use } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Settings2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Check, Copy } from "lucide-react"
import ChatTest from '@/components/chat/ChatTest';
import { useToast } from "@/hooks/use-toast"

const STORAGE_KEY = 'chat_settings';

const TypewriterText = ({ text }) => {
  return (
    <span className="typing-effect">
      {text}
    </span>
  );
};

const PromptSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-6rem)]">
      <div className="h-full flex flex-col">
        <Card className="border-none shadow-lg bg-gradient-to-br from-background to-secondary/10 flex-1">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <div className="mt-6">
              <Skeleton className="h-[300px] w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="h-full">
        <Card className="h-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-8" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-[400px] w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-[50px] flex-1" />
                <Skeleton className="h-[50px] w-[50px]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function PromptDetail({ params }) {
  const router = useRouter();
  const {id} = use(params);
  const [prompt, setPrompt] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      return savedSettings ? JSON.parse(savedSettings).apiKey : '';
    }
    return '';
  });
  const [selectedModel, setSelectedModel] = useState('glm-4-flash');
  const [isLoading, setIsLoading] = useState(false);
  const [useCustomKey, setUseCustomKey] = useState(false);
  const [temperature, setTemperature] = useState(0.5);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const messagesEndRef = useRef(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [customModel, setCustomModel] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      return savedSettings ? JSON.parse(savedSettings).model : 'glm-4-flash';
    }
    return 'glm-4-flash';
  });
  const [baseUrl, setBaseUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      return savedSettings ? JSON.parse(savedSettings).baseUrl : 'https://open.bigmodel.cn/api/paas/v4';
    }
    return 'https://open.bigmodel.cn/api/paas/v4';
  });
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (id) {
      // 获取当前提示词
      fetch(`/api/prompts/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setPrompt({...data, tags: data.tags ? data.tags.split(',') : []});
          setSelectedVersion(data.version);
          
          // 获取所有相同标题的版本
          fetch(`/api/prompts?title=${encodeURIComponent(data.title)}`)
            .then((response) => response.json())
            .then((versionsData) => {
              // 过滤出相同标题的版本
              const sameTitle = versionsData.filter(v => v.title === data.title);
              setVersions(sameTitle.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
            })
            .catch((error) => console.error('Error fetching versions:', error));
        })
        .catch((error) => console.error('Error fetching prompt:', error));
    }
  }, [id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopySuccess(true);
      toast({
        title: "复制成功",
        description: "提示词内容已复制到剪贴板",
      });
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      toast({
        title: "复制失败",
        description: "请重试",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.push('/prompts');
      } else {
        throw new Error('删除失败');
      }
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  const handleShare = async () => {
    try {
      const response = await fetch(`/api/prompts/share/${id}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('分享失败');
      }

      const shareUrl = `${window.location.origin}/share/${id}`;
      await navigator.clipboard.writeText(shareUrl);
      setShareSuccess(true);
      toast({
        title: "分享成功",
        description: "分享链接已复制到剪贴板",
      });
      setTimeout(() => setShareSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to share prompt:', err);
      toast({
        title: "分享失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    }
  };

  const handleSaveContent = async () => {
    setIsSaving(true);
    
    // 保存旧的内容以备回滚
    const previousContent = prompt.content;
    
    // 乐观更新 - 立即更新UI
    setPrompt(prev => ({...prev, content: editedContent}));
    setIsEditing(false);

    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent
        })
      });

      if (!response.ok) {
        throw new Error('保存失败');
      }

    } catch (error) {
      console.error('Error saving content:', error);
      // 如果保存失败，回滚到之前的内容
      setPrompt(prev => ({...prev, content: previousContent}));
      setIsEditing(true);
      // 显示错误提示
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyMessage = async (content, index) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(index);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const saveSettings = (settings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  };

  const handleApiKeyChange = (e) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    saveSettings({
      apiKey: newApiKey,
      model: customModel,
      baseUrl: baseUrl
    });
  };

  const handleModelChange = (e) => {
    const newModel = e.target.value;
    setCustomModel(newModel);
    saveSettings({
      apiKey: apiKey,
      model: newModel,
      baseUrl: baseUrl
    });
  };

  const handleBaseUrlChange = (e) => {
    const newBaseUrl = e.target.value;
    setBaseUrl(newBaseUrl);
    saveSettings({
      apiKey: apiKey,
      model: customModel,
      baseUrl: newBaseUrl
    });
  };

  const handleVersionChange = (version) => {
    const selectedPrompt = versions.find(v => v.version === version);
    if (selectedPrompt) {
      router.push(`/prompts/${selectedPrompt.id}`);
    }
  };

  if (!prompt) {
    return (
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
        <div className="flex items-center space-x-2 mb-4">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:bg-secondary"
            onClick={() => router.push('/prompts')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回提示词列表
          </Button>
        </div>
        <PromptSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      <div className="flex items-center space-x-2 mb-6">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:bg-secondary"
          onClick={() => router.push('/prompts')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回提示词列表
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[calc(100vh-12rem)] flex flex-col">
          <Card className="border-none shadow-lg bg-gradient-to-br from-background to-secondary/10 flex-1 overflow-hidden flex flex-col">
            <CardContent className="p-6 sm:p-8 flex flex-col h-full">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-8">
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl font-bold">
                    {prompt.title}
                  </h1>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {prompt.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(prompt.created_at).toLocaleDateString()}
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {versions.length > 1 ? (
                          <Select
                            value={selectedVersion}
                            onValueChange={handleVersionChange}
                          >
                            <SelectTrigger className="h-5 text-xs border-none bg-transparent hover:bg-secondary/50 transition-colors">
                              <SelectValue placeholder="选择版本">
                                v{selectedVersion}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {versions.map((version) => (
                                <SelectItem 
                                  key={version.id} 
                                  value={version.version}
                                  className="text-xs"
                                >
                                  v{version.version} ({new Date(version.created_at).toLocaleDateString()})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span>v{prompt.version}</span>
                        )}
                      </div>
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

                <div className="flex gap-3">
                  <Button
                    onClick={handleShare}
                    variant={shareSuccess ? "success" : "secondary"}
                    className="relative overflow-hidden group w-10 h-10 p-0"
                    title="分享"
                  >
                    <svg className={`w-4 h-4 transition-transform duration-300 ${shareSuccess ? "rotate-0" : "rotate-0"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </Button>

                  <Button
                    onClick={() => {
                      router.push(`/prompts/${id}/edit`, {
                        state: {
                          prompt: {
                            ...prompt,
                            tags: prompt.tags.join(',')
                          }
                        }
                      });
                    }}
                    variant="default"
                    className="relative overflow-hidden group w-10 h-10 p-0"
                    title="编辑"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Button>

                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="destructive"
                    className="relative overflow-hidden group w-10 h-10 p-0"
                    title="删除"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>

              <Card className="flex-1 border border-primary/10 bg-secondary/5 backdrop-blur-sm overflow-hidden flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between shrink-0">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <span className="bg-primary/10 p-2 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    提示词内容
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopy}
                      className="transition-all duration-200"
                    >
                      {copySuccess ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    {isEditing ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsEditing(false);
                            setEditedContent(prompt.content);
                          }}
                          disabled={isSaving}
                        >
                          取消
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleSaveContent}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <span className="flex items-center gap-1">
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              保存中
                            </span>
                          ) : '保存'}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setIsEditing(true);
                          setEditedContent(prompt.content);
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full w-full">
                    <div className="rounded-lg bg-secondary/30 p-4 min-h-full">
                      {isEditing ? (
                        <div className="min-h-[500px]">
                          <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full h-full min-h-[500px] text-base leading-relaxed whitespace-pre-wrap text-primary"
                            placeholder="输入提示词内容..."
                            style={{ 
                              resize: 'vertical',
                              overflowY: 'auto'
                            }}
                          />
                        </div>
                      ) : (
                        <p className="text-base leading-relaxed whitespace-pre-wrap text-primary min-h-[500px]">
                          {prompt.content}
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>

        <div className="h-[calc(100vh-12rem)]">
          <ChatTest prompt={prompt} />
        </div>
      </div>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">确定要删除这个提示词吗？此操作无法撤。</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDelete();
                setShowDeleteConfirm(false);
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 