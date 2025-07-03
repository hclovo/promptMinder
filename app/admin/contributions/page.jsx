'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, XCircle, Clock, Eye, Trash2 } from 'lucide-react';

export default function ContributionsAdminPage() {
    const { toast } = useToast();
    const { t } = useLanguage();
    const [contributions, setContributions] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedContribution, setSelectedContribution] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentFilter, setCurrentFilter] = useState('pending');

    // 获取贡献列表
    const fetchContributions = async (status = 'pending') => {
        try {
            const response = await fetch(`/api/contributions?status=${status}&limit=50`);
            const data = await response.json();
            
            if (response.ok) {
                setContributions(data.contributions || []);
            } else {
                console.error('Failed to fetch contributions:', data.error);
            }
        } catch (error) {
            console.error('Error fetching contributions:', error);
        }
    };

    // 获取统计数据
    const fetchStats = async () => {
        try {
            const response = await fetch('/api/contributions/stats');
            const data = await response.json();
            
            if (response.ok) {
                setStats(data);
            } else {
                console.error('Failed to fetch stats:', data.error);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // 处理审核
    const handleReview = async (contributionId, status, publishToPrompts = false) => {
        setIsProcessing(true);
        
        try {
            const response = await fetch(`/api/contributions/${contributionId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status,
                    adminNotes,
                    publishToPrompts
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                const statusText = status === 'approved' ? t.admin.contributions.toast.approved : t.admin.contributions.toast.rejected;
                const publishText = publishToPrompts ? t.admin.contributions.toast.andPublished : '';
                toast({
                    title: t.admin.contributions.toast.reviewSuccess,
                    description: `贡献已${statusText}审核${publishText}`,
                    variant: "default",
                });
                setIsModalOpen(false);
                setAdminNotes('');
                fetchContributions(currentFilter);
                fetchStats();
            } else {
                toast({
                    title: t.admin.contributions.toast.reviewFailed,
                    description: data.error || '操作失败',
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error reviewing contribution:', error);
            toast({
                title: t.admin.contributions.toast.reviewFailed,
                description: t.admin.contributions.toast.networkError,
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    // 删除贡献
    const handleDelete = async (contributionId) => {
        if (!confirm('确定要删除这个贡献吗？此操作无法撤销。')) {
            return;
        }

        try {
            const response = await fetch(`/api/contributions/${contributionId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast({
                    title: t.admin.contributions.toast.deleteSuccess,
                    description: '贡献已成功删除',
                    variant: "default",
                });
                fetchContributions(currentFilter);
                fetchStats();
            } else {
                const data = await response.json();
                toast({
                    title: t.admin.contributions.toast.deleteFailed,
                    description: data.error || '操作失败',
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error deleting contribution:', error);
            toast({
                title: t.admin.contributions.toast.deleteFailed,
                description: t.admin.contributions.toast.networkError,
                variant: "destructive",
            });
        }
    };

    // 查看详情
    const handleViewDetails = (contribution) => {
        setSelectedContribution(contribution);
        setAdminNotes(contribution.admin_notes || '');
        setIsModalOpen(true);
    };

    // 状态徽章样式
    const getStatusBadge = (status) => {
        const styles = {
            pending: { variant: 'secondary', icon: Clock, text: '待审核' },
            approved: { variant: 'default', icon: CheckCircle, text: '已通过' },
            rejected: { variant: 'destructive', icon: XCircle, text: '已拒绝' }
        };
        
        const config = styles[status] || styles.pending;
        const Icon = config.icon;
        
        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                <Icon className="w-3 h-3" />
                {config.text}
            </Badge>
        );
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                fetchContributions(currentFilter),
                fetchStats()
            ]);
            setLoading(false);
        };

        loadData();
    }, [currentFilter]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">加载中...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">贡献管理</h1>
                
                {/* 统计卡片 */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card className="p-4">
                            <div className="text-2xl font-bold text-blue-600">{stats.statusStats?.total || 0}</div>
                            <div className="text-sm text-gray-600">总贡献数</div>
                        </Card>
                        <Card className="p-4">
                            <div className="text-2xl font-bold text-yellow-600">{stats.statusStats?.pending || 0}</div>
                            <div className="text-sm text-gray-600">待审核</div>
                        </Card>
                        <Card className="p-4">
                            <div className="text-2xl font-bold text-green-600">{stats.statusStats?.approved || 0}</div>
                            <div className="text-sm text-gray-600">已通过</div>
                        </Card>
                        <Card className="p-4">
                            <div className="text-2xl font-bold text-red-600">{stats.statusStats?.rejected || 0}</div>
                            <div className="text-sm text-gray-600">已拒绝</div>
                        </Card>
                    </div>
                )}

                {/* 筛选按钮 */}
                <div className="flex gap-2 mb-6">
                    {['pending', 'approved', 'rejected', 'all'].map(status => (
                        <Button
                            key={status}
                            variant={currentFilter === status ? 'default' : 'outline'}
                            onClick={() => setCurrentFilter(status)}
                        >
                            {status === 'pending' ? '待审核' : 
                             status === 'approved' ? '已通过' : 
                             status === 'rejected' ? '已拒绝' : '全部'}
                        </Button>
                    ))}
                </div>
            </div>

            {/* 贡献列表 */}
            <div className="space-y-4">
                {contributions.length === 0 ? (
                    <Card className="p-8 text-center">
                        <div className="text-gray-500">暂无贡献记录</div>
                    </Card>
                ) : (
                    contributions.map((contribution) => (
                        <Card key={contribution.id} className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-lg font-semibold">{contribution.title}</h3>
                                        {getStatusBadge(contribution.status)}
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                        类别: {contribution.role_category}
                                    </div>
                                    <div className="text-sm text-gray-500 mb-2">
                                        提交时间: {new Date(contribution.created_at).toLocaleString('zh-CN')}
                                    </div>
                                    <div className="text-sm line-clamp-2">
                                        {contribution.content.length > 150 
                                            ? contribution.content.substring(0, 150) + '...'
                                            : contribution.content
                                        }
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewDetails(contribution)}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(contribution.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* 详情和审核模态框 */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl">
                    {selectedContribution && (
                        <>
                            <DialogHeader>
                                <DialogTitle>贡献详情</DialogTitle>
                                <DialogDescription>
                                    查看详细内容并进行审核
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium">标题</Label>
                                    <div className="mt-1 p-2 bg-gray-50 rounded">{selectedContribution.title}</div>
                                </div>
                                
                                <div>
                                    <Label className="text-sm font-medium">角色/类别</Label>
                                    <div className="mt-1 p-2 bg-gray-50 rounded">{selectedContribution.role_category}</div>
                                </div>
                                
                                <div>
                                    <Label className="text-sm font-medium">提示词内容</Label>
                                    <div className="mt-1 p-3 bg-gray-50 rounded max-h-40 overflow-y-auto whitespace-pre-wrap">
                                        {selectedContribution.content}
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium">当前状态</Label>
                                    <div className="mt-1">
                                        {getStatusBadge(selectedContribution.status)}
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor="admin-notes">管理员备注</Label>
                                    <Textarea
                                        id="admin-notes"
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="添加审核备注..."
                                        rows={3}
                                    />
                                </div>
                                
                                {selectedContribution.status === 'pending' && (
                                    <div className="flex gap-2 pt-4">
                                        <Button
                                            onClick={() => handleReview(selectedContribution.id, 'approved', true)}
                                            disabled={isProcessing}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            通过并发布
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleReview(selectedContribution.id, 'approved', false)}
                                            disabled={isProcessing}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            仅通过
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleReview(selectedContribution.id, 'rejected')}
                                            disabled={isProcessing}
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            拒绝
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
} 