import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    glass?: boolean;
}

export default function Card({ children, className = '', glass = false }: CardProps) {
    const base = glass
        ? 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl'
        : 'bg-slate-800/80 border border-slate-700/50 shadow-lg';

    return (
        <div className={`rounded-2xl p-6 ${base} ${className}`}>
            {children}
        </div>
    );
}
