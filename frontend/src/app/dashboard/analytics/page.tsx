'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart3, Eye, MousePointerClick, Globe } from 'lucide-react';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import type { AnalyticsStats, ApiResponse } from '@/lib/types';

export default function AnalyticsPage() {
    const { data: stats, isLoading } = useQuery<AnalyticsStats>({
        queryKey: ['analytics'],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<AnalyticsStats>>('/analytics/stats');
            return data.data;
        },
    });

    const { data: referrers } = useQuery<{ referrer: string; _count: { id: number } }[]>({
        queryKey: ['analytics-referrers'],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<{ referrer: string; _count: { id: number } }[]>>('/analytics/stats/referrers');
            return data.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-1">Analytics</h1>
            <p className="text-slate-400 mb-8">Track your page performance</p>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard
                    icon={Eye}
                    label="Page Views"
                    value={stats?.totalViews || 0}
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                />
                <StatCard
                    icon={MousePointerClick}
                    label="Link Clicks"
                    value={stats?.totalClicks || 0}
                    color="text-purple-400"
                    bg="bg-purple-500/10"
                />
                <StatCard
                    icon={BarChart3}
                    label="CTR"
                    value={
                        stats && stats.totalViews > 0
                            ? `${((stats.totalClicks / stats.totalViews) * 100).toFixed(1)}%`
                            : '0%'
                    }
                    color="text-emerald-400"
                    bg="bg-emerald-500/10"
                />
            </div>

            {/* Top Referrers */}
            <Card className="mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Globe size={18} className="text-indigo-400" />
                    Top Referrers
                </h2>
                {!referrers || referrers.length === 0 ? (
                    <p className="text-sm text-slate-500">No referrer data yet</p>
                ) : (
                    <div className="space-y-3">
                        {referrers.map((r, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <span className="text-sm text-slate-300 truncate">
                                    {r.referrer || 'Direct'}
                                </span>
                                <div className="flex items-center gap-3">
                                    <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full"
                                            style={{
                                                width: `${Math.min(
                                                    100,
                                                    (r._count.id / (referrers[0]?._count.id || 1)) * 100,
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm text-slate-400 w-8 text-right">
                                        {r._count.id}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Recent Events */}
            <Card>
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                {!stats?.recent || stats.recent.length === 0 ? (
                    <p className="text-sm text-slate-500">No activity yet</p>
                ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {stats.recent.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-center gap-3 py-2 border-b border-slate-800/50 last:border-0"
                            >
                                <div
                                    className={`w-2 h-2 rounded-full ${event.eventType === 'PAGE_VIEW' ? 'bg-blue-400' : 'bg-purple-400'
                                        }`}
                                />
                                <span className="text-xs text-slate-400 font-mono">
                                    {new Date(event.createdAt).toLocaleString()}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                                    {event.eventType === 'PAGE_VIEW' ? 'View' : 'Click'}
                                </span>
                                {event.referrer && (
                                    <span className="text-xs text-slate-500 truncate">{event.referrer}</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    color,
    bg,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: number | string;
    color: string;
    bg: string;
}) {
    return (
        <Card className="text-center">
            <div className={`inline-flex p-3 rounded-xl ${bg} mb-3`}>
                <Icon size={22} className={color} />
            </div>
            <p className="text-3xl font-bold mb-1">{value}</p>
            <p className="text-sm text-slate-400">{label}</p>
        </Card>
    );
}
