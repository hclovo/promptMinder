'use client';
import { useState, useEffect, useCallback } from 'react';
import PromptList from '@/components/prompt/PromptList';
import { Input } from "@/components/ui/input"
import { Spinner } from '@/components/ui/Spinner';
import TagFilter from '@/components/prompt/TagFilter';
import { Button } from "@/components/ui/button"
import { Search, PlusCircle, ChevronDown, Copy, Share2, Trash2, Clock, Tags } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"
import Image from 'next/image';
import Link from 'next/link';
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Wand2 } from "lucide-react"
import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/LanguageContext';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

const CreatableSelect = dynamic(() => import('react-select/creatable'), {
  ssr: false
});

// 自定义 debounce 函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const PromptCardSkeleton = () => {
  return (
    <Card className="group relative p-4 hover:shadow-md transition-all bg-card">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[180px]" />
            <Skeleton className="h-4 w-[240px]" />
          </div>
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </Card>
  );
};

const PromptListSkeleton = () => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="group relative border p-4 hover:shadow-md transition-all bg-card cursor-pointer border-dashed h-[156px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </Card>
      {[...Array(5)].map((_, index) => (
        <PromptCardSkeleton key={index} />
      ))}
    </div>
  );
};

async function getPrompts() {
  const res = await fetch('/api/prompts',{
    method:'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch prompts');
  }
  return res.json();
}

async function deletePrompt(id) {
  const res = await fetch(`/api/prompts/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to delete prompt');
  }
  return res.json();
}

// 修改 NewPromptCard 使用翻译
const NewPromptCard = ({ onClick }) => {
  const { t } = useLanguage();
  if (!t) return null;
  return (
    <Card 
      onClick={onClick}
      className="group relative border p-4 hover:shadow-md transition-all bg-card cursor-pointer border-dashed h-[156px] flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <PlusCircle className="h-8 w-8" />
        <span className="text-sm">{t.promptsPage.newPromptCard}</span>
      </div>
    </Card>
  );
};

export default function PromptsPage() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState(null);
  const [selectedVersions, setSelectedVersions] = useState(null);
  const [showNewPromptDialog, setShowNewPromptDialog] = useState(false);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [optimizedContent, setOptimizedContent] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    content: '',
    description: '',
    tags: '',
    version: '1.0.0',
    cover_img: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagOptions, setTagOptions] = useState([]);

  const debouncedSearch = useCallback((value) => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(value);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setIsLoading(true);
        const data = await getPrompts();
        setPrompts(data.map(prompt => ({
          ...prompt,
          version: prompt.version || '1.0',
          cover_img: prompt.cover_img || '/default-cover.jpg',
          tags: prompt.tags?.split(',') || []
        })));
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags');
        const data = await response.json();
        const mappedTags = data.map(tag => ({ 
          value: tag.name, 
          label: tag.name 
        }));
        setTagOptions(mappedTags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  if (!t) return null;
  const tp = t.promptsPage;

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        description: tp.copySuccess,
        duration: 2000,
      });
    } catch (err) {
      console.error('Copy failed:', err);
      toast({
        variant: "destructive",
        description: tp.copyError,
        duration: 2000,
      });
    }
  };

  const handleDelete = async (id) => {
    setPromptToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePrompt(promptToDelete);
      setPrompts(prompts.filter(prompt => prompt.id !== promptToDelete));
      setDeleteDialogOpen(false);
      toast({
        description: tp.deleteSuccess,
        duration: 2000,
      });
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast({
        variant: "destructive",
        description: tp.deleteError,
        duration: 2000,
      });
    }
  };

  const filteredPrompts = prompts.filter(prompt => {
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => prompt.tags.includes(tag));
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTags && matchesSearch;
  });

  const allTags = [...new Set(prompts.flatMap(prompt => prompt.tags))];

  const handleShare = async (id) => {
    const shareUrl = `${window.location.origin}/share/${id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        description: tp.shareSuccess,
        duration: 2000,
      });
    } catch (clipboardErr) {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        toast({
          description: tp.shareSuccess,
          duration: 2000,
        });
      } catch (fallbackErr) {
        toast({
          variant: "destructive",
          description: tp.shareError,
          duration: 2000,
        });
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  const groupedPrompts = filteredPrompts.reduce((acc, prompt) => {
    if (!acc[prompt.title]) {
      acc[prompt.title] = [];
    }
    acc[prompt.title].push(prompt);
    return acc;
  }, {});

  const showVersions = (e, versions) => {
    e.preventDefault();
    setSelectedVersions(versions);
  };

  const handleCreatePrompt = async () => {
    if (!newPrompt.title.trim() || !newPrompt.content.trim()) {
      toast({
        variant: "destructive",
        description: tp.createValidation,
        duration: 2000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPrompt),
      });

      if (!res.ok) {
        throw new Error('Failed to create prompt');
      }

      const data = await getPrompts();
      setPrompts(data.map(prompt => ({
        ...prompt,
        version: prompt.version || '1.0',
        cover_img: prompt.cover_img || '/default-cover.jpg',
        tags: prompt.tags?.split(',') || []
      })));

      setShowNewPromptDialog(false);
      setNewPrompt({
        title: '',
        content: '',
        description: '',
        tags: '',
        version: '1.0.0',
        cover_img: '',
      });

      toast({
        description: tp.createSuccess,
        duration: 2000,
      });
    } catch (error) {
      console.error('Error creating prompt:', error);
      toast({
        variant: "destructive",
        description: tp.createError,
        duration: 2000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateTag = async (inputValue) => {
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
        setTagOptions(prev => [...prev, newOption]);
        return newOption;
      }
    } catch (error) {
      console.error('Error creating new tag:', error);
    }
    return null;
  };

  const handleOptimize = async () => {
    if (!newPrompt.content.trim()) return;
    setIsOptimizing(true);
    setOptimizedContent('');
    setShowOptimizeModal(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newPrompt.content }),
      });
      
      if (!response.ok) throw new Error(tp.optimizeError);
      
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
            console.error(tp.optimizeParsingError, e);
          }
        }
      }

    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        variant: "destructive",
        description: tp.optimizeRetry,
        duration: 2000,
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-background to-background/80">
      <div className="container px-4 py-4 sm:py-16 mx-auto max-w-7xl">
        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{tp.title}</h1>
              <p className="text-muted-foreground">
                {tp.totalPrompts.replace('{count}', prompts.length.toString())}
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full md:w-[320px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  onChange={(e) => debouncedSearch(e.target.value)}
                  placeholder={tp.searchPlaceholder}
                  className="w-full h-10 pl-9 transition-all border rounded-lg focus:ring-2 focus:ring-primary/50"
                />
              </div>
              {!isLoading && (
                <>
                  <TagFilter 
                    allTags={allTags}
                    selectedTags={selectedTags}
                    onTagSelect={setSelectedTags}
                    className="touch-manipulation w-full md:w-auto"
                    t={t}
                  />
                  <Link href="/tags" className="w-full md:w-auto">
                    <Button variant="outline" className="w-full">
                      <Tags className="mr-2 h-4 w-4" />
                      {tp.manageTags}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="mt-8">
              <PromptListSkeleton />
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <NewPromptCard onClick={() => setShowNewPromptDialog(true)} />
              {Object.entries(groupedPrompts).map(([title, versions]) => {
                const latestPrompt = versions[0];
                return (
                  <Card 
                    key={title}
                    className="group relative rounded-lg border p-4 hover:shadow-md transition-all bg-card cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (versions.length > 1) {
                        showVersions(e, versions);
                      } else {
                        window.location.href = `/prompts/${latestPrompt.id}`;
                      }
                    }}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold line-clamp-1 mb-2">
                            {title}
                          </h3>
                          {latestPrompt.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {latestPrompt.description}
                            </p>
                          )}
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-background/80 backdrop-blur-sm rounded-lg p-1">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(latestPrompt.content);
                              }}
                              className="h-8 w-8"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare(latestPrompt.id);
                              }}
                              className="h-8 w-8"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(latestPrompt.id);
                              }}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {latestPrompt.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="bg-secondary/80 text-secondary-foreground text-xs px-2.5 py-0.5 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(latestPrompt.updated_at).toLocaleString()}
                        </div>
                        {versions.length > 1 && (
                          <>
                            <span>•</span>
                            <span>{tp.versionsCount.replace('{count}', versions.length.toString())}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedVersions} onOpenChange={() => setSelectedVersions(null)}>
        <DialogContent>
          <VisuallyHidden.Root><DialogTitle>Dialog</DialogTitle></VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>{tp.versionHistoryTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedVersions?.map((version) => (
              <Link 
                key={version.id} 
                href={`/prompts/${version.id}`}
                className="block"
              >
                <Card className="p-4 hover:bg-accent cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">v{version.version}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(version.created_at).toLocaleString()}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <VisuallyHidden.Root><DialogTitle>Dialog</DialogTitle></VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>{tp.deleteConfirmTitle}</DialogTitle>
            <DialogDescription>
              {tp.deleteConfirmDescription}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {tp.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              {tp.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewPromptDialog} onOpenChange={setShowNewPromptDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <VisuallyHidden.Root><DialogTitle>Dialog</DialogTitle></VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>{tp.newPromptTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                {tp.formTitleLabel}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="title"
                value={newPrompt.title}
                onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
                placeholder={tp.formTitlePlaceholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">
                {tp.formContentLabel}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <Textarea
                  id="content"
                  value={newPrompt.content}
                  onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
                  placeholder={tp.formContentPlaceholder}
                  className="min-h-[200px] pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 hover:bg-accent hover:text-accent-foreground"
                  onClick={handleOptimize}
                  disabled={!newPrompt.content.trim() || isOptimizing}
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
              <Label htmlFor="description">{tp.formDescriptionLabel}</Label>
              <Textarea
                id="description"
                value={newPrompt.description}
                onChange={(e) => setNewPrompt({ ...newPrompt, description: e.target.value })}
                placeholder={tp.formDescriptionPlaceholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">{tp.formTagsLabel}</Label>
              <CreatableSelect
                isMulti
                value={newPrompt.tags ? newPrompt.tags.split(',').map(tag => ({ value: tag, label: tag })) : []}
                onChange={(selected) => {
                  const tags = selected ? selected.map(option => option.value).join(',') : '';
                  setNewPrompt({ ...newPrompt, tags });
                }}
                options={tagOptions}
                onCreateOption={async (inputValue) => {
                  const newOption = await handleCreateTag(inputValue);
                  if (newOption) {
                    const newTags = newPrompt.tags 
                      ? `${newPrompt.tags},${inputValue}` 
                      : inputValue;
                    setNewPrompt({ ...newPrompt, tags: newTags });
                  }
                }}
                placeholder={tp.formTagsPlaceholder}
                classNamePrefix="select"
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: state.isFocused ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                    borderRadius: 'calc(var(--radius) - 2px)',
                    boxShadow: state.isFocused ? '0 0 0 1px hsl(var(--primary))' : 'none',
                    '&:hover': {
                      borderColor: 'hsl(var(--primary))',
                    },
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'calc(var(--radius) - 2px)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }),
                  option: (baseStyles, { isFocused, isSelected }) => ({
                    ...baseStyles,
                    backgroundColor: isSelected 
                      ? 'hsl(var(--primary))' 
                      : isFocused 
                        ? 'hsl(var(--accent))' 
                        : 'transparent',
                    color: isSelected 
                      ? 'hsl(var(--primary-foreground))' 
                      : 'inherit',
                    cursor: 'pointer',
                    '&:active': {
                      backgroundColor: 'hsl(var(--accent))',
                    },
                  }),
                  multiValue: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: 'hsl(var(--secondary))',
                    borderRadius: 'calc(var(--radius) - 2px)',
                  }),
                  multiValueLabel: (baseStyles) => ({
                    ...baseStyles,
                    color: 'hsl(var(--secondary-foreground))',
                  }),
                  multiValueRemove: (baseStyles) => ({
                    ...baseStyles,
                    color: 'hsl(var(--secondary-foreground))',
                    '&:hover': {
                      backgroundColor: 'hsl(var(--destructive))',
                      color: 'hsl(var(--destructive-foreground))',
                    },
                  }),
                  input: (baseStyles) => ({
                    ...baseStyles,
                    color: 'hsl(var(--foreground))',
                  }),
                }}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary: 'hsl(var(--primary))',
                    primary75: 'hsl(var(--primary)/.75)',
                    primary50: 'hsl(var(--primary)/.5)',
                    primary25: 'hsl(var(--primary)/.25)',
                    danger: 'hsl(var(--destructive))',
                    dangerLight: 'hsl(var(--destructive)/.25)',
                  },
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">{tp.formVersionLabel}</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">v</span>
                <Input
                  id="version"
                  value={newPrompt.version}
                  onChange={(e) => setNewPrompt({ ...newPrompt, version: e.target.value })}
                  placeholder={tp.formVersionPlaceholder}
                  className="w-32"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {tp.versionSuggestion}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewPromptDialog(false)}
            >
              {tp.cancel}
            </Button>
            <Button
              onClick={handleCreatePrompt}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tp.creating}
                </>
              ) : tp.create}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showOptimizeModal} onOpenChange={setShowOptimizeModal}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <VisuallyHidden.Root><DialogTitle>Dialog</DialogTitle></VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>{tp.optimizePreviewTitle}</DialogTitle>
          </DialogHeader>
          <div className="relative min-h-[200px] max-h-[50vh] overflow-y-auto">
            <Textarea
              value={optimizedContent}
              onChange={(e) => setOptimizedContent(e.target.value)}
              className="min-h-[200px] w-full"
              placeholder={tp.optimizePlaceholder}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowOptimizeModal(false)}
              className="mr-2"
            >
              {tp.cancel}
            </Button>
            <Button
              onClick={() => {
                setNewPrompt({ ...newPrompt, content: optimizedContent });
                setShowOptimizeModal(false);
              }}
              disabled={!optimizedContent.trim()}
            >
              {tp.applyOptimization}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 