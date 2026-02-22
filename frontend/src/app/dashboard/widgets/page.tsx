'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, GripVertical, Eye, EyeOff, ArrowUp, ArrowDown, X } from 'lucide-react';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import type { Widget, WidgetType, ApiResponse } from '@/lib/types';

const WIDGET_TYPES: { value: WidgetType; label: string; emoji: string }[] = [
    { value: 'LINK', label: 'Link', emoji: '🔗' },
    { value: 'TEXT', label: 'Text', emoji: '📝' },
    { value: 'IMAGE', label: 'Image', emoji: '🖼️' },
    { value: 'SOCIAL', label: 'Social', emoji: '🌐' },
];

export default function WidgetsPage() {
    const queryClient = useQueryClient();
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    const { data: widgets = [], isLoading } = useQuery<Widget[]>({
        queryKey: ['widgets'],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<Widget[]>>('/widgets');
            return data.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/widgets/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['widgets'] });
            flash('Widget deleted');
        },
    });

    const toggleMutation = useMutation({
        mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) =>
            api.patch(`/widgets/${id}`, { isVisible }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['widgets'] }),
    });

    const reorderMutation = useMutation({
        mutationFn: (widgetIds: string[]) =>
            api.post('/widgets/reorder', { widgetIds }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['widgets'] }),
    });

    const flash = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    };

    const moveWidget = (index: number, direction: 'up' | 'down') => {
        const sorted = [...widgets].sort((a, b) => a.order - b.order);
        const ids = sorted.map((w) => w.id);
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= ids.length) return;
        [ids[index], ids[targetIndex]] = [ids[targetIndex], ids[index]];
        reorderMutation.mutate(ids);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    const sorted = [...widgets].sort((a, b) => a.order - b.order);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Widgets</h1>
                    <p className="text-slate-400">Manage the content on your page</p>
                </div>
                <Button onClick={() => setShowAdd(true)} className="gap-2">
                    <Plus size={16} /> Add Widget
                </Button>
            </div>

            {message && (
                <div className="mb-6 p-3 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-sm">
                    {message}
                </div>
            )}

            {/* Add Widget Modal */}
            <AnimatePresence>
                {showAdd && (
                    <AddWidgetModal
                        onClose={() => setShowAdd(false)}
                        onSuccess={() => {
                            setShowAdd(false);
                            queryClient.invalidateQueries({ queryKey: ['widgets'] });
                            flash('Widget added!');
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Edit Widget Modal */}
            <AnimatePresence>
                {editingId && (
                    <EditWidgetModal
                        widget={widgets.find((w) => w.id === editingId)!}
                        onClose={() => setEditingId(null)}
                        onSuccess={() => {
                            setEditingId(null);
                            queryClient.invalidateQueries({ queryKey: ['widgets'] });
                            flash('Widget updated!');
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Widget List */}
            {sorted.length === 0 ? (
                <Card className="text-center py-16">
                    <p className="text-slate-400 text-lg mb-2">No widgets yet</p>
                    <p className="text-slate-500 text-sm">Add your first widget to get started</p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {sorted.map((widget, index) => (
                        <motion.div
                            key={widget.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className={`flex items-center gap-4 !py-4 ${!widget.isVisible ? 'opacity-50' : ''}`}>
                                <GripVertical size={16} className="text-slate-500 cursor-grab" />

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                                            {WIDGET_TYPES.find((t) => t.value === widget.type)?.emoji}{' '}
                                            {widget.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-300 truncate">
                                        {getWidgetPreview(widget)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button onClick={() => moveWidget(index, 'up')} disabled={index === 0}
                                        className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 disabled:opacity-30 transition-colors">
                                        <ArrowUp size={14} />
                                    </button>
                                    <button onClick={() => moveWidget(index, 'down')} disabled={index === sorted.length - 1}
                                        className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 disabled:opacity-30 transition-colors">
                                        <ArrowDown size={14} />
                                    </button>
                                    <button onClick={() => toggleMutation.mutate({ id: widget.id, isVisible: !widget.isVisible })}
                                        className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 transition-colors">
                                        {widget.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                                    </button>
                                    <button onClick={() => setEditingId(widget.id)}
                                        className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 transition-colors">
                                        <Edit3 size={14} />
                                    </button>
                                    <button onClick={() => deleteMutation.mutate(widget.id)}
                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

function getWidgetPreview(widget: Widget): string {
    const c = widget.config as Record<string, unknown>;
    switch (widget.type) {
        case 'LINK': return (c.title as string) || (c.url as string) || 'Link';
        case 'TEXT': return ((c.content as string) || '').slice(0, 80);
        case 'IMAGE': return (c.alt as string) || 'Image';
        case 'SOCIAL': return `${((c.platforms as unknown[]) || []).length} platforms`;
        default: return widget.type;
    }
}

// --- Add Widget Modal ---
function AddWidgetModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [type, setType] = useState<WidgetType>('LINK');
    const [config, setConfig] = useState<Record<string, unknown>>({});
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.post('/widgets', { type, config });
            onSuccess();
        } catch {
            setSaving(false);
        }
    };

    return (
        <ModalOverlay onClose={onClose}>
            <h2 className="text-lg font-semibold mb-4">Add Widget</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                    <div className="grid grid-cols-2 gap-2">
                        {WIDGET_TYPES.map((t) => (
                            <button
                                key={t.value}
                                onClick={() => { setType(t.value); setConfig({}); }}
                                className={`p-3 rounded-xl text-sm font-medium transition-all border ${type === t.value
                                        ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400'
                                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                                    }`}
                            >
                                {t.emoji} {t.label}
                            </button>
                        ))}
                    </div>
                </div>
                <WidgetConfigForm type={type} config={config} onChange={setConfig} />
                <div className="flex gap-3 justify-end pt-2">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} isLoading={saving}>Add Widget</Button>
                </div>
            </div>
        </ModalOverlay>
    );
}

// --- Edit Widget Modal ---
function EditWidgetModal({ widget, onClose, onSuccess }: { widget: Widget; onClose: () => void; onSuccess: () => void }) {
    const [config, setConfig] = useState<Record<string, unknown>>(widget.config);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.patch(`/widgets/${widget.id}`, { config });
            onSuccess();
        } catch {
            setSaving(false);
        }
    };

    return (
        <ModalOverlay onClose={onClose}>
            <h2 className="text-lg font-semibold mb-4">Edit Widget</h2>
            <div className="space-y-4">
                <WidgetConfigForm type={widget.type} config={config} onChange={setConfig} />
                <div className="flex gap-3 justify-end pt-2">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} isLoading={saving}>Save</Button>
                </div>
            </div>
        </ModalOverlay>
    );
}

// --- Modal Overlay ---
function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                    <X size={18} />
                </button>
                {children}
            </motion.div>
        </motion.div>
    );
}

// --- Widget Config Form ---
function WidgetConfigForm({
    type,
    config,
    onChange,
}: {
    type: WidgetType;
    config: Record<string, unknown>;
    onChange: (c: Record<string, unknown>) => void;
}) {
    const set = (key: string, value: unknown) => onChange({ ...config, [key]: value });

    switch (type) {
        case 'LINK':
            return (
                <div className="space-y-3">
                    <Input id="link-title" label="Title" value={(config.title as string) || ''} onChange={(e) => set('title', e.target.value)} placeholder="My Website" />
                    <Input id="link-url" label="URL" value={(config.url as string) || ''} onChange={(e) => set('url', e.target.value)} placeholder="https://example.com" />
                    <Input id="link-desc" label="Description (optional)" value={(config.description as string) || ''} onChange={(e) => set('description', e.target.value)} placeholder="A short description" />
                </div>
            );
        case 'TEXT':
            return (
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Content</label>
                        <textarea
                            value={(config.content as string) || ''}
                            onChange={(e) => set('content', e.target.value)}
                            rows={4}
                            placeholder="Write something..."
                            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>
                </div>
            );
        case 'IMAGE':
            return (
                <div className="space-y-3">
                    <Input id="img-src" label="Image URL" value={(config.src as string) || ''} onChange={(e) => set('src', e.target.value)} placeholder="https://example.com/image.jpg" />
                    <Input id="img-alt" label="Alt Text" value={(config.alt as string) || ''} onChange={(e) => set('alt', e.target.value)} placeholder="Image description" />
                    <Input id="img-link" label="Link URL (optional)" value={(config.linkUrl as string) || ''} onChange={(e) => set('linkUrl', e.target.value)} placeholder="https://example.com" />
                </div>
            );
        case 'SOCIAL':
            const platforms = ((config.platforms as { platform: string; url: string }[]) || []);
            return (
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">Platforms</label>
                    {platforms.map((p, i) => (
                        <div key={i} className="flex gap-2">
                            <Input
                                id={`social-name-${i}`}
                                value={p.platform}
                                onChange={(e) => {
                                    const updated = [...platforms];
                                    updated[i] = { ...updated[i], platform: e.target.value };
                                    set('platforms', updated);
                                }}
                                placeholder="github"
                                className="flex-1"
                            />
                            <Input
                                id={`social-url-${i}`}
                                value={p.url}
                                onChange={(e) => {
                                    const updated = [...platforms];
                                    updated[i] = { ...updated[i], url: e.target.value };
                                    set('platforms', updated);
                                }}
                                placeholder="https://github.com/user"
                                className="flex-[2]"
                            />
                            <button
                                onClick={() => set('platforms', platforms.filter((_, j) => j !== i))}
                                className="p-2 text-slate-400 hover:text-red-400"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => set('platforms', [...platforms, { platform: '', url: '' }])}>
                        <Plus size={14} className="mr-1" /> Add Platform
                    </Button>
                </div>
            );
        default:
            return null;
    }
}
