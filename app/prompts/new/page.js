'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image';
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

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
    cover_img: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagOptions, setTagOptions] = useState([]);
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await handleImageUpload({ target: { files: [file] } });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
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
              <Textarea
                id="content"
                value={prompt.content}
                onChange={(e) => setPrompt({ ...prompt, content: e.target.value })}
                placeholder="在这里输入你的提示词内容，可以包含具体的指令、上下文要求等"
                className={`min-h-[200px] ${errors.content ? 'border-red-500' : ''}`}
                required
              />
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
                className="min-h-[60px]"
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
            </motion.div>

            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Label htmlFor="cover_img" className="text-base">封面图片</Label>
              <div 
                className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                  isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex items-center gap-4">
                  {prompt.cover_img ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image 
                        src={prompt.cover_img} 
                        alt="封面预览" 
                        className="w-20 h-20 object-cover rounded" 
                        width={80} 
                        height={80} 
                      />
                    </motion.div>
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-400">预览</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      id="cover_img"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      支持拖放上传，建议尺寸 800x600
                    </p>
                  </div>
                </div>
              </div>
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
  );
} 