"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    await prisma.analyticsEvent.deleteMany();
    await prisma.widget.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    const password = await bcrypt.hash('password123', 12);
    const user = await prisma.user.create({
        data: {
            email: 'demo@olnktr.com',
            username: 'demo',
            password,
            profile: {
                create: {
                    displayName: 'Demo User',
                    bio: 'Welcome to my page! 🚀 I build cool things on the internet.',
                    theme: {
                        primaryColor: '#6366f1',
                        backgroundColor: '#0f172a',
                        textColor: '#f8fafc',
                        fontFamily: 'Inter',
                        cardStyle: 'glass',
                    },
                    layoutConfig: {
                        direction: 'vertical',
                        spacing: 'md',
                        maxWidth: '640px',
                    },
                },
            },
        },
        include: { profile: true },
    });
    console.log(`✅ Created user: ${user.email} (username: ${user.username})`);
    if (!user.profile) {
        throw new Error('Profile was not created');
    }
    const widgets = await Promise.all([
        prisma.widget.create({
            data: {
                profileId: user.profile.id,
                type: client_1.WidgetType.TEXT,
                config: {
                    content: '👋 Hey there! Welcome to my personal page.',
                    align: 'center',
                    fontSize: 'lg',
                },
                order: 0,
            },
        }),
        prisma.widget.create({
            data: {
                profileId: user.profile.id,
                type: client_1.WidgetType.LINK,
                config: {
                    title: '🌐 My Website',
                    url: 'https://example.com',
                    description: 'Check out my portfolio',
                },
                order: 1,
            },
        }),
        prisma.widget.create({
            data: {
                profileId: user.profile.id,
                type: client_1.WidgetType.LINK,
                config: {
                    title: '📝 My Blog',
                    url: 'https://blog.example.com',
                    description: 'Read my latest articles',
                },
                order: 2,
            },
        }),
        prisma.widget.create({
            data: {
                profileId: user.profile.id,
                type: client_1.WidgetType.SOCIAL,
                config: {
                    platforms: [
                        { platform: 'github', url: 'https://github.com/demo' },
                        { platform: 'twitter', url: 'https://twitter.com/demo' },
                        { platform: 'linkedin', url: 'https://linkedin.com/in/demo' },
                        { platform: 'instagram', url: 'https://instagram.com/demo' },
                    ],
                },
                order: 3,
            },
        }),
        prisma.widget.create({
            data: {
                profileId: user.profile.id,
                type: client_1.WidgetType.IMAGE,
                config: {
                    src: 'https://picsum.photos/600/300',
                    alt: 'Banner image',
                },
                order: 4,
            },
        }),
    ]);
    console.log(`✅ Created ${widgets.length} widgets`);
    const analyticsEvents = [];
    for (let i = 0; i < 25; i++) {
        analyticsEvents.push({
            profileId: user.profile.id,
            eventType: i % 3 === 0 ? 'LINK_CLICK' : 'PAGE_VIEW',
            ipHash: `hash_${Math.random().toString(36).substring(7)}`,
            userAgent: 'Mozilla/5.0 (Seed Script)',
            referrer: i % 2 === 0 ? 'https://google.com' : 'https://twitter.com',
            metadata: i % 3 === 0 ? { widgetId: widgets[1].id } : null,
        });
    }
    await prisma.analyticsEvent.createMany({ data: analyticsEvents });
    console.log(`✅ Created ${analyticsEvents.length} analytics events`);
    console.log('\n🎉 Seeding complete!');
    console.log('📧 Login credentials:');
    console.log('   Email: demo@olnktr.com');
    console.log('   Password: password123');
    console.log('   Profile: /@demo');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map