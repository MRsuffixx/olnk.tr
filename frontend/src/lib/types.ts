// Shared types matching backend DTOs

export interface User {
    id: string;
    email: string;
    username: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        tokens: AuthTokens;
        user: User;
    };
}

export interface Profile {
    id: string;
    userId: string;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
    theme: ThemeConfig;
    layoutConfig: LayoutConfig;
    user?: { username: string; email?: string };
    widgets?: Widget[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ThemeConfig {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    cardStyle: string;
}

export interface LayoutConfig {
    direction: string;
    spacing: string;
    maxWidth: string;
}

export type WidgetType = 'LINK' | 'TEXT' | 'IMAGE' | 'SOCIAL';

export interface Widget {
    id: string;
    profileId: string;
    type: WidgetType;
    config: Record<string, unknown>;
    order: number;
    isVisible: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface LinkWidgetConfig {
    title: string;
    url: string;
    description?: string;
    icon?: string;
}

export interface TextWidgetConfig {
    content: string;
    align?: string;
    fontSize?: string;
}

export interface ImageWidgetConfig {
    src: string;
    alt?: string;
    linkUrl?: string;
}

export interface SocialPlatform {
    platform: string;
    url: string;
}

export interface SocialWidgetConfig {
    platforms: SocialPlatform[];
}

export interface AnalyticsStats {
    totalViews: number;
    totalClicks: number;
    recent: AnalyticsEvent[];
}

export interface AnalyticsEvent {
    id: string;
    eventType: 'PAGE_VIEW' | 'LINK_CLICK';
    referrer: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
}
