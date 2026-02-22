import { PrismaClient, WidgetType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Clean existing data
    await prisma.analyticsEvent.deleteMany();
    await prisma.widget.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    // Create test user
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

    // Create sample widgets
    const widgets = await Promise.all([
        prisma.widget.create({
            data: {
                profileId: user.profile.id,
                type: WidgetType.TEXT,
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
                type: WidgetType.LINK,
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
                type: WidgetType.LINK,
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
                type: WidgetType.SOCIAL,
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
                type: WidgetType.IMAGE,
                config: {
                    src: 'https://picsum.photos/600/300',
                    alt: 'Banner image',
                },
                order: 4,
            },
        }),
    ]);

    console.log(`✅ Created ${widgets.length} widgets`);

    // Create sample analytics events
    const analyticsEvents = [];
    for (let i = 0; i < 25; i++) {
        analyticsEvents.push({
            profileId: user.profile.id,
            eventType: i % 3 === 0 ? 'LINK_CLICK' as const : 'PAGE_VIEW' as const,
            ipHash: `hash_${Math.random().toString(36).substring(7)}`,
            userAgent: 'Mozilla/5.0 (Seed Script)',
            referrer: i % 2 === 0 ? 'https://google.com' : 'https://twitter.com',
            metadata: i % 3 === 0 ? { widgetId: widgets[1].id } : null,
        });
    }

    await prisma.analyticsEvent.createMany({ data: analyticsEvents as any });
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
