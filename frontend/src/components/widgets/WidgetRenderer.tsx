'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { Widget, LinkWidgetConfig, TextWidgetConfig, ImageWidgetConfig, SocialWidgetConfig, SocialPlatform } from '@/lib/types';

interface Props {
    widget: Widget;
    index: number;
    onLinkClick?: (widgetId: string) => void;
}

export default function WidgetRenderer({ widget, index, onLinkClick }: Props) {
    const config = widget.config as Record<string, unknown>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
        >
            {widget.type === 'LINK' && <LinkWidget config={config as unknown as LinkWidgetConfig} widgetId={widget.id} onLinkClick={onLinkClick} />}
            {widget.type === 'TEXT' && <TextWidget config={config as unknown as TextWidgetConfig} />}
            {widget.type === 'IMAGE' && <ImageWidget config={config as unknown as ImageWidgetConfig} />}
            {widget.type === 'SOCIAL' && <SocialWidget config={config as unknown as SocialWidgetConfig} />}
        </motion.div>
    );
}

function LinkWidget({ config, widgetId, onLinkClick }: { config: LinkWidgetConfig; widgetId: string; onLinkClick?: (id: string) => void }) {
    return (
        <a
            href={config.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onLinkClick?.(widgetId)}
            className="block glass rounded-2xl p-5 hover:bg-white/[0.08] transition-all duration-300 group"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg group-hover:text-indigo-400 transition-colors">
                        {config.title}
                    </h3>
                    {config.description && (
                        <p className="text-sm text-slate-400 mt-0.5">{config.description}</p>
                    )}
                </div>
                <ExternalLink size={18} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </div>
        </a>
    );
}

function TextWidget({ config }: { config: TextWidgetConfig }) {
    return (
        <div className={`glass rounded-2xl p-5 text-${config.align || 'left'}`}>
            <p className={`text-slate-200 ${config.fontSize === 'lg' ? 'text-lg' :
                    config.fontSize === 'xl' ? 'text-xl' : 'text-base'
                }`}>
                {config.content}
            </p>
        </div>
    );
}

function ImageWidget({ config }: { config: ImageWidgetConfig }) {
    const img = (
        <div className="glass rounded-2xl overflow-hidden">
            <img
                src={config.src}
                alt={config.alt || ''}
                className="w-full object-cover"
                loading="lazy"
            />
        </div>
    );

    if (config.linkUrl) {
        return (
            <a href={config.linkUrl} target="_blank" rel="noopener noreferrer" className="block hover:opacity-90 transition-opacity">
                {img}
            </a>
        );
    }
    return img;
}

const platformIcons: Record<string, string> = {
    github: '🐙',
    twitter: '𝕏',
    linkedin: '💼',
    instagram: '📸',
    youtube: '▶️',
    tiktok: '🎵',
    facebook: '📘',
    twitch: '🎮',
    discord: '💬',
    spotify: '🎧',
    dribbble: '🏀',
    behance: '🎨',
};

function SocialWidget({ config }: { config: SocialWidgetConfig }) {
    return (
        <div className="glass rounded-2xl p-5">
            <div className="flex flex-wrap gap-3 justify-center">
                {config.platforms?.map((p: SocialPlatform, i: number) => (
                    <a
                        key={i}
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
                    >
                        <span className="text-lg">{platformIcons[p.platform.toLowerCase()] || '🔗'}</span>
                        <span className="text-sm font-medium capitalize">{p.platform}</span>
                    </a>
                ))}
            </div>
        </div>
    );
}
