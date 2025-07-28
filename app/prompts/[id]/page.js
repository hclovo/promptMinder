'use client';
import { useRouter } from 'next/navigation';
import { useState, use } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import ChatTest from '@/components/chat/ChatTest';
import { useLanguage } from '@/contexts/LanguageContext';
import VariableInputs from '@/components/prompt/VariableInputs';
import { replaceVariables } from '@/lib/promptVariables';
import PromptHeader from '@/components/prompt/PromptHeader';
import PromptContent from '@/components/prompt/PromptContent';
import DeleteConfirmDialog from '@/components/prompt/DeleteConfirmDialog';
import { PromptSkeleton } from '@/components/prompt/PromptSkeleton';
import { usePromptDetail } from '@/hooks/use-prompt-detail';

export default function PromptDetail({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useLanguage();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const {
    prompt,
    versions,
    selectedVersion,
    variableValues,
    hasVariables,
    isLoading,
    handleVersionChange,
    handleVariablesChange,
    updatePrompt
  } = usePromptDetail(id);

  // Calculate rendered content when variables are present
  const renderedContent = hasVariables && prompt ? 
    replaceVariables(prompt.content, variableValues) : 
    prompt?.content || '';

  if (!t || isLoading) {
    return <PromptSkeleton />;
  }

  if (!prompt) {
    return <PromptSkeleton />;
  }

  const tp = t.promptDetailPage;

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      <div className="flex items-center space-x-2 mb-6">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:bg-secondary"
          onClick={() => router.push('/prompts')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {tp.backToList}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[calc(100vh-12rem)] flex flex-col">
          <Card className="border-none shadow-lg bg-gradient-to-br from-background to-secondary/10 flex-1 overflow-hidden flex flex-col">
            <CardContent className="p-4 sm:p-6 flex flex-col h-full">
              <PromptHeader
                prompt={prompt}
                versions={versions}
                selectedVersion={selectedVersion}
                onVersionChange={handleVersionChange}
                onDelete={() => setShowDeleteConfirm(true)}
                t={t}
              />

              {/* Variable inputs */}
              <div className="mb-3">
                <VariableInputs
                  content={prompt.content}
                  onVariablesChange={handleVariablesChange}
                  className=""
                />
              </div>

              {/* Prompt content */}
              <PromptContent
                prompt={prompt}
                onPromptUpdate={updatePrompt}
                hasVariables={hasVariables}
                renderedContent={renderedContent}
                t={t}
              />
            </CardContent>
          </Card>
        </div>

        <div className="h-[calc(100vh-12rem)]">
          <ChatTest 
            prompt={prompt} 
            t={t} 
            variableValues={variableValues}
            hasVariables={hasVariables}
          />
        </div>
      </div>

      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        promptId={id}
        t={t}
      />
    </div>
  );
}