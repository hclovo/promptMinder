import Link from 'next/link';
import Image from 'next/image';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Share2, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PromptList({ prompts, onDelete }) {
  const { toast } = useToast();

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        description: "提示词已复制到剪贴板",
        duration: 2000,
      });
    } catch (err) {
      console.error('复制失败:', err);
      toast({
        variant: "destructive",
        description: "复制失败",
        duration: 2000,
      });
    }
  };

  const handleShare = async (id) => {
    try {
      const response = await fetch(`/api/prompts/share/${id}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('分享失败');
      }

      const shareUrl = `${window.location.origin}/share/${id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({
        description: "分享链接已复制到剪贴板",
        duration: 2000,
      });
    } catch (err) {
      console.error('分享失败:', err);
      toast({
        variant: "destructive",
        description: "分享失败",
        duration: 2000,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {prompts?.map((prompt) => (
        <Link href={`/prompts/${prompt.id}`} key={prompt.id}>
          <Card className="group relative rounded-lg border p-6 hover:shadow-md transition-all bg-card">
            <div className="flex gap-4">
              {prompt.cover_img && (
                <div className="h-[100px] w-[100px] rounded-lg flex-shrink-0 overflow-hidden">
                  <Image 
                    src={prompt.cover_img}
                    alt={prompt.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    width={100}
                    height={100}
                  />
                </div>
              )}
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold line-clamp-1 hover:text-primary transition-colors">
                    {prompt.title}
                  </h3>
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
                      v{prompt.version}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {prompt.description || prompt.content}
                </p>
                <div className="flex flex-wrap gap-2">
                  {prompt.tags?.map((tag) => (
                    <span 
                      key={tag}
                      className="bg-secondary/80 text-secondary-foreground text-xs px-2.5 py-0.5 rounded-full hover:bg-secondary transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCopy(prompt.content);
                  }}
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    handleShare(prompt.id);
                  }}
                  className="h-8 w-8"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(prompt.id);
                  }}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
} 