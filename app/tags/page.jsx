'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/modal';
import { Trash2, Pencil, ArrowLeft } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

const TagsSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>

      <div className="space-y-8">
        {/* 公共标签骨架 */}
        <div>
          <Skeleton className="h-7 w-24 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={`public-${index}`} className="h-10 rounded-lg" />
            ))}
          </div>
        </div>

        {/* 私有标签骨架 */}
        <div>
          <Skeleton className="h-7 w-24 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={`private-${index}`} className="h-10 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TagsPage() {
  const router = useRouter();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [editingTag, setEditingTag] = useState({ id: null, name: '' });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      if (!response.ok) {
        throw new Error('获取标签失败');
      }
      const data = await response.json();
      setTags(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tagId) => {
    setSelectedTagId(tagId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/tags?id=${selectedTagId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '删除标签失败');
      }

      setDeleteModalOpen(false);
      // 删除成功后刷新列表
      fetchTags();
    } catch (err) {
      setError(err.message);
      // 3秒后清除错误信息
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEdit = (tag) => {
    setEditingTag({ id: tag.id, name: tag.name });
    setEditModalOpen(true);
  };

  const confirmEdit = async () => {
    try {
      const response = await fetch(`/api/tags?id=${editingTag.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingTag.name }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '更新标签失败');
      }

      setEditModalOpen(false);
      // 更新成功后刷新列表
      fetchTags();
    } catch (err) {
      setError(err.message);
      // 3秒后清除错误信息
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return <TagsSkeleton />;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => router.push('/prompts')}
          className="py-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm text-gray-500">返回提示词列表</span>
        </button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">标签管理</h1>
        <Link
          href="/tags/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          新建标签
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {tags.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          暂无标签，点击右上角添加新标签
        </div>
      ) : (
        <div className="space-y-8">
          {/* 公共标签部分 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">公共标签</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tags.filter(tag => !tag.user_id).map((tag) => (
                <div
                  key={tag.id}
                  className="group relative bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 hover:border-indigo-300 transition-colors"
                >
                  <div className="inline-flex items-center">
                    <span className="text-sm font-medium text-gray-700">{tag.name}</span>
                  </div>
                </div>
              ))}
              {tags.filter(tag => !tag.user_id).length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-4">
                  暂无公共标签
                </div>
              )}
            </div>
          </div>

          {/* 私有标签部分 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">私有标签</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tags.filter(tag => tag.user_id).map((tag) => (
                <div
                  key={tag.id}
                  className="group relative bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 hover:border-indigo-300 transition-colors"
                >
                  <div className="inline-flex items-center">
                    <span className="text-sm font-medium text-gray-700">{tag.name}</span>
                    <span className="ml-2 px-2 py-0.5 text-[10px] font-medium bg-indigo-50 text-indigo-600 rounded-full">私有</span>
                  </div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(tag)}
                      className="p-1.5 hover:bg-gray-100 rounded-full"
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="p-1.5 hover:bg-gray-100 rounded-full"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
              {tags.filter(tag => tag.user_id).length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-4">
                  暂无私有标签
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>确认删除</ModalTitle>
          </ModalHeader>
          <p className="py-4">确定要删除这个标签吗？此操作无法撤销。</p>
          <ModalFooter>
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-gray-500 hover:text-gray-700"
            >
              取消
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              删除
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>编辑标签</ModalTitle>
          </ModalHeader>
          <div className="py-4">
            <Input
              value={editingTag.name}
              onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
              placeholder="请输入标签名称"
              className="w-full"
            />
          </div>
          <ModalFooter>
            <button
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-gray-500 hover:text-gray-700"
            >
              取消
            </button>
            <button
              onClick={confirmEdit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              保存
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
} 