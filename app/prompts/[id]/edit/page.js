'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { Spinner } from '@/app/components/ui/Spinner';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image';
import CreatableSelect from 'react-select/creatable';
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
} from "@/components/ui/modal"

export default function EditPrompt({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const [prompt, setPrompt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedContent, setOptimizedContent] = useState('');
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/prompts/${id}`)
        .then((response) => response.json())
        .then((data) => setPrompt(data))
        .catch((error) => console.error('Error fetching prompt:', error));
    }

    fetch('/api/tags')
      .then((response) => response.json())
      .then((data) => {
        setTagOptions(data.map(tag => ({ value: tag.name, label: tag.name })));
      })
      .catch((error) => console.error('Error fetching tags:', error));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompt),
      });

      if (response.ok) {
        toast.success('提示词更新成功！');
        router.push(`/prompts/${id}`);
      }
    } catch (error) {
      toast.error('更新失败，请重试');
      console.error('Error updating prompt:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setPrompt({ ...prompt, cover_img: data.url });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleOptimize = async () => {
    if (!prompt.content.trim()) return;
    setIsOptimizing(true);
    setOptimizedContent('');
    setShowOptimizeModal(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: prompt.content }),
      });
      
      if (!response.ok) throw new Error('优化失败');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let tempContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const jsonStr = line.replace(/^data: /, '').trim();
            if (!jsonStr || jsonStr === '[DONE]') continue;
            
            const data = JSON.parse(jsonStr);
            if (data.choices?.[0]?.delta?.content) {
              tempContent += data.choices[0].delta.content;
              setOptimizedContent(tempContent);
            }
          } catch (e) {
            console.error('解析响应数据出错:', e);
          }
        }
      }

    } catch (error) {
      console.error('优化错误:', error);
      toast.error('优化失败，请重试');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyOptimized = () => {
    setPrompt(prev => ({
      ...prev,
      content: optimizedContent
    }));
    setShowOptimizeModal(false);
    toast.success('已应用优化结果');
  };

  if (!prompt) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container max-w-3xl mx-auto p-6"
      >
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold">编辑提示词</h1>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-lg font-medium">标题</Label>
                  <Input
                    id="title"
                    value={prompt.title}
                    onChange={(e) => setPrompt({ ...prompt, title: e.target.value })}
                    className="h-12"
                    placeholder="输入提示词标题"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-lg font-medium">内容</Label>
                  <div className="relative">
                    <Textarea
                      id="content"
                      value={prompt.content}
                      onChange={(e) => setPrompt({ ...prompt, content: e.target.value })}
                      className="min-h-[250px] resize-y pr-12"
                      placeholder="输入提示词内容"
                      required
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-2 hover:bg-primary/10"
                      onClick={handleOptimize}
                      disabled={isOptimizing || !prompt.content.trim()}
                    >
                      {isOptimizing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-lg font-medium">描述</Label>
                  <Textarea
                    id="description"
                    value={prompt.description}
                    onChange={(e) => setPrompt({ ...prompt, description: e.target.value })}
                    className="min-h-[80px] resize-y"
                    placeholder="添加描述信息"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-lg font-medium">标签</Label>
                  <CreatableSelect
                    id="tags"
                    isMulti
                    value={prompt.tags?.split(',').map(tag => ({ value: tag, label: tag }))||[]}
                    onChange={(selected) => {
                      const tags = selected ? selected.map(option => option.value).join(',') : '';
                      setPrompt({ ...prompt, tags });
                    }}
                    options={tagOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="选择或创建标签"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '2.5rem',
                      })
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    onCreateOption={async (inputValue) => {
                      try {
                        const response = await fetch('/api/tags', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ name: inputValue }),
                        });
                        
                        if (response.ok) {
                          const newOption = { value: inputValue, label: inputValue };
                          setTagOptions([...tagOptions, newOption]);
                          
                          const newTags = prompt.tags ? `${prompt.tags},${inputValue}` : inputValue;
                          setPrompt({ ...prompt, tags: newTags });
                        }
                      } catch (error) {
                        console.error('Error creating new tag:', error);
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version" className="text-lg font-medium">版本</Label>
                  <Input
                    id="version"
                    value={prompt.version}
                    onChange={(e) => setPrompt({ ...prompt, version: e.target.value })}
                    className="h-12"
                    placeholder="输入版本号"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover_img" className="text-lg font-medium">封面图片</Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {prompt.cover_img && (
                      <div className="relative group">
                        <Image 
                          src={prompt.cover_img} 
                          alt="封面预览" 
                          className="w-32 h-32 object-cover rounded-lg transition-transform hover:scale-105"
                          width={128}
                          height={128}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg" />
                      </div>
                    )}
                    <div className="flex-1 w-full">
                      <Input
                        id="cover_img"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-32 h-12"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="w-4 h-4" />
                      <span>保存中...</span>
                    </div>
                  ) : '保存'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  className="w-32 h-12"
                >
                  取消
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <Modal isOpen={showOptimizeModal} onClose={() => setShowOptimizeModal(false)}>
        <ModalContent className="max-w-3xl max-h-[80vh]">
          <ModalHeader>
            <ModalTitle>优化结果预览</ModalTitle>
          </ModalHeader>
          <div className="relative min-h-[200px] max-h-[50vh] overflow-y-auto">
            <Textarea
              value={optimizedContent}
              onChange={(e) => setOptimizedContent(e.target.value)}
              className="min-h-[200px] w-full"
              placeholder="正在生成优化内容..."
            />
          </div>
          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowOptimizeModal(false)}
              className="mr-2"
            >
              取消
            </Button>
            <Button
              type="button"
              onClick={handleApplyOptimized}
              disabled={!optimizedContent.trim()}
            >
              应用优化结果
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
} 