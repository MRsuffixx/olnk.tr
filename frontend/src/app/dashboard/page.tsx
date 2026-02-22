'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Upload } from 'lucide-react';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import type { Profile, ApiResponse } from '@/lib/types';

export default function DashboardProfilePage() {
    const queryClient = useQueryClient();
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const { data: profile, isLoading } = useQuery<Profile>({
        queryKey: ['profile'],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<Profile>>('/profiles/me');
            return data.data;
        },
    });

    const [form, setForm] = useState({
        displayName: '',
        bio: '',
    });

    // Sync form with profile data
    const isFormLoaded = profile && !form.displayName && !form.bio;
    if (isFormLoaded) {
        setForm({
            displayName: profile.displayName || '',
            bio: profile.bio || '',
        });
    }

    const saveMutation = useMutation({
        mutationFn: async () => {
            setSaving(true);
            await api.patch('/profiles/me', {
                displayName: form.displayName,
                bio: form.bio,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            setMessage('Profile saved!');
            setTimeout(() => setMessage(''), 3000);
            setSaving(false);
        },
        onError: () => {
            setMessage('Failed to save');
            setSaving(false);
        },
    });

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            await api.post('/profiles/me/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            setMessage('Avatar updated!');
            setTimeout(() => setMessage(''), 3000);
        } catch {
            setMessage('Failed to upload avatar');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-1">Profile</h1>
            <p className="text-slate-400 mb-8">Manage your personal information and appearance</p>

            {message && (
                <div className={`mb-6 p-3 rounded-lg text-sm ${message.includes('Failed') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                    }`}>
                    {message}
                </div>
            )}

            <div className="space-y-6">
                {/* Avatar */}
                <Card>
                    <h2 className="text-lg font-semibold mb-4">Avatar</h2>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center">
                            {profile?.avatarUrl ? (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${profile.avatarUrl}`}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl font-bold text-slate-400">
                                    {profile?.displayName?.[0]?.toUpperCase() || '?'}
                                </span>
                            )}
                        </div>
                        <label className="cursor-pointer">
                            <Button variant="secondary" size="sm" className="gap-2" type="button" onClick={() => document.getElementById('avatar-input')?.click()}>
                                <Upload size={14} /> Upload
                            </Button>
                            <input
                                id="avatar-input"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarUpload}
                            />
                        </label>
                    </div>
                </Card>

                {/* Profile Info */}
                <Card>
                    <h2 className="text-lg font-semibold mb-4">Information</h2>
                    <div className="space-y-4">
                        <Input
                            id="displayName"
                            label="Display Name"
                            value={form.displayName}
                            onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                            placeholder="Your display name"
                        />
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Bio</label>
                            <textarea
                                value={form.bio}
                                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                                placeholder="Tell the world about yourself..."
                                rows={4}
                                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 hover:border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                            />
                        </div>
                    </div>
                </Card>

                <Button onClick={() => saveMutation.mutate()} isLoading={saving} className="gap-2">
                    <Save size={16} /> Save Changes
                </Button>
            </div>
        </div>
    );
}
