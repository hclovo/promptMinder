'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion";
import { Loader2, Wand2 } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
} from "@/components/ui/modal"

const Select = dynamic(() => import('react-select'), {
  ssr: false
});

const CreatableSelect = dynamic(() => import('react-select/creatable'), {
  ssr: false
});

export default function NewPrompt() {
  const [prompt, setPrompt] = useState({
    title: '',
    content: '',
    description: '',
    tags: '',
    version: '1.0.0',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagOptions, setTagOptions] = useState([]);
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedContent, setOptimizedContent] = useState('');
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);

  useEffect(() => {
    fetch('/api/tags')
      .then((response) => response.json())
      .then((data) => {
        const mappedTags = data.map(tag => ({ value: tag.name, label: tag.name }));
        setTagOptions(mappedTags);
        if (mappedTags.length > 0 && !prompt.tags) {
          setPrompt(prev => ({
            ...prev,
            tags: mappedTags[0].value
          }));
        }
      })
      .catch((error) => console.error('Error fetching tags:', error));
  }, [prompt.tags]);

  const validateForm = () => {
    const newErrors = {};
    if (!prompt.title.trim()) newErrors.title = '请输入标题';
    if (!prompt.content.trim()) newErrors.content = '请输入提示词内容';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompt),
      });

      if (!res.ok) {
        throw new Error('Failed to create prompt');
      }

      router.push('/prompts');
    } catch (error) {
      console.error('Error creating prompt:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tagSelectProps = {
    isCreatable: true,
    onKeyDown: (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        
        // Get the input value
        const inputValue = e.target.value;
        if (inputValue) {
          // Call onCreateOption with the current input value
          tagSelectProps.onCreateOption(inputValue);
        }
      }
    },
    onCreateOption: async (inputValue) => {
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
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-6 max-w-7xl"
      >
        <h1 className="text-3xl font-bold mb-6">创建新提示词</h1>
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div 
                className="space-y-2"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Label htmlFor="title" className="text-base">
                  标题
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="title"
                  value={prompt.title}
                  onChange={(e) => setPrompt({ ...prompt, title: e.target.value })}
                  placeholder="为你的提示词起个醒目的标题"
                  className={errors.title ? 'border-red-500' : ''}
                  required
                />
                {errors.title && (
                  <span className="text-red-500 text-sm">{errors.title}</span>
                )}
              </motion.div>

              <motion.div 
                className="space-y-2"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Label htmlFor="content" className="text-base">
                  提示词内容
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="relative">
                  <Textarea
                    id="content"
                    value={prompt.content}
                    onChange={(e) => setPrompt({ ...prompt, content: e.target.value })}
                    placeholder="在这里输入你的提示词内容，可以包含具体的指令、上下文要求等"
                    className={`min-h-[250px] pr-12 ${errors.content ? 'border-red-500' : ''}`}
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
                {errors.content && (
                  <span className="text-red-500 text-sm">{errors.content}</span>
                )}
              </motion.div>

              <motion.div 
                className="space-y-2"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Label htmlFor="description" className="text-base">描述</Label>
                <Textarea
                  id="description"
                  value={prompt.description}
                  onChange={(e) => setPrompt({ ...prompt, description: e.target.value })}
                  placeholder="简要描述这个提示词的用途和使用场景"
                  className="min-h-[80px]"
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Label htmlFor="tags" className="text-base">标签</Label>
                <CreatableSelect
                  key="tags-select"
                  id="tags"
                  isMulti
                  value={prompt.tags ? prompt.tags.split(',').map(tag => ({ value: tag, label: tag })) : []}
                  onChange={(selected) => {
                    const tags = selected ? selected.map(option => option.value).join(',') : '';
                    setPrompt({ ...prompt, tags });
                  }}
                  options={tagOptions}
                  placeholder="选择或创建新标签"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  {...tagSelectProps}
                  instanceId="tags-select"
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Label htmlFor="version" className="text-base">版本</Label>
                <Input
                  id="version"
                  value={prompt.version}
                  onChange={(e) => setPrompt({ ...prompt, version: e.target.value })}
                  placeholder="例如: 1.0.0"
                />
                <p className="text-sm text-muted-foreground">建议使用语义化版本号，例如：1.0.0</p>
              </motion.div>

              <motion.div 
                className="flex gap-4"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="relative"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      创建中...
                    </>
                  ) : '创建'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                >
                  取消
                </Button>
              </motion.div>
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