'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import WidgetRenderer from '@/components/widgets/WidgetRenderer';
import type { Profile, Widget, ThemeConfig } from '@/lib/types';

export default function PublicProfilePage() {
    const params = useParams();
    const slug = (params.username as string) || '';
    const username = slug.startsWith('%40') ? slug.slice(3) : slug;

    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!username) return;

        const fetchProfile = async () => {
            try {
                const { data } = await api.get(`/profiles/${username}`);
                setProfile(data.data);

                // Track page view
                api.post('/analytics/track', {
                    username,
                    eventType: 'PAGE_VIEW',
                }).catch(() => { });
            } catch {
                setError('Profile not found');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    const handleLinkClick = (widgetId: string) => {
        api.post('/analytics/track', {
            username,
            eventType: 'LINK_CLICK',
            metadata: { widgetId },
        }).catch(() => { });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-3">404</h1>
                    <p className="text-slate-400">{error || 'Profile not found'}</p>
                </div>
            </div>
        );
    }

    const theme = (profile.theme || {}) as ThemeConfig;
    const widgets = (profile.widgets || []) as Widget[];

    return (
        <div
            className="min-h-screen py-12 px-6"
            style={{
                background: theme.backgroundColor || '#0a0e1a',
                color: theme.textColor || '#f8fafc',
                fontFamily: theme.fontFamily || 'Inter, sans-serif',
            }}
        >
            <div className="max-w-xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-white/10">
                        {profile.avatarUrl ? (
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${profile.avatarUrl}`}
                                alt={profile.displayName || username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div
                                className="w-full h-full flex items-center justify-center text-2xl font-bold"
                                style={{ background: theme.primaryColor || '#6366f1' }}
                            >
                                {(profile.displayName || username)[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* Name & Bio */}
                    <h1 className="text-2xl font-bold mb-1">
                        {profile.displayName || username}
                    </h1>
                    <p className="text-sm opacity-60 mb-2">@{(profile.user?.username || username)}</p>
                    {profile.bio && (
                        <p className="text-base opacity-70 max-w-md mx-auto">{profile.bio}</p>
                    )}
                </motion.div>

                {/* Widgets */}
                <div className="space-y-4">
                    {widgets.map((widget, index) => (
                        <WidgetRenderer
                            key={widget.id}
                            widget={widget}
                            index={index}
                            onLinkClick={handleLinkClick}
                        />
                    ))}
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-12 pt-8 border-t border-white/5"
                >
                    <a
                        href="/"
                        className="text-xs opacity-40 hover:opacity-60 transition-opacity"
                    >
                        Powered by olnktr
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
