'use client';
import { useState, useEffect } from 'react';
import PromptList from '@/app/components/prompt/PromptList';
import { Input } from "@/components/ui/input"
import { Spinner } from '@/app/components/ui/Spinner';
import TagFilter from '@/app/components/prompt/TagFilter';
import { Button } from "@/components/ui/button"
import { Search, PlusCircle } from "lucide-react"
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

const PromptCardSkeleton = () => {
  return (
    <div className="group relative rounded-lg border p-6 hover:shadow-md transition-all bg-card">
      <div className="flex gap-4">
        <Skeleton className="h-[100px] w-[100px] rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

const PromptListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(6)].map((_, index) => (
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

export default function PromptsPage() {
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState(null);
  const { toast } = useToast();

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
        description: "提示词已删除",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast({
        variant: "destructive",
        description: "删除失败，请重试",
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
        description: "链接已复制到剪贴板",
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
          description: "链接已复制到剪贴板",
          duration: 2000,
        });
      } catch (fallbackErr) {
        toast({
          variant: "destructive",
          description: "复制失败，请手动复制链接",
          duration: 2000,
        });
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container px-4 py-4 sm:py-16 mx-auto max-w-7xl">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索提示词..."
                  className="w-full h-12 pl-10 transition-all border rounded-lg focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <Button
              className="h-12 px-6 active:scale-95 transition-transform touch-manipulation md:active:scale-100 gap-2"
              onClick={() => window.location.href = '/prompts/new'}
            >
              <PlusCircle className="h-5 w-5" />
              新建提示词
            </Button>
          </div>
          {isLoading ? (
            <div className="flex gap-2">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-8 w-20" />
              ))}
            </div>
          ) : (
            <TagFilter 
              allTags={allTags}
              selectedTags={selectedTags}
              onTagSelect={setSelectedTags}
              className="pb-4 touch-manipulation"
            />
          )}
        </div>

        {isLoading ? (
          <div className="mt-8">
            <PromptListSkeleton />
          </div>
        ) : (
          <div className="mt-8">
            <PromptList 
              prompts={filteredPrompts} 
              onDelete={handleDelete} 
              onShare={handleShare}
            />
          </div>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              你确定要删除这个提示词吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 