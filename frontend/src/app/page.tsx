'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Layout, BarChart3 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text">
            olnktr
          </Link>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 pt-20">
        <div className="max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-8">
              <Sparkles size={14} />
              <span>Build your personal micro-site</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              Your world,{' '}
              <span className="gradient-text">one link</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto mb-10">
              Create a stunning personal page with customizable widgets, beautiful themes,
              and powerful analytics. Share everything that matters in one place.
            </p>

            <div className="flex items-center gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="gap-2">
                  Start for free <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/@demo">
                <Button variant="secondary" size="lg">
                  View demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24"
          >
            {[
              { icon: Layout, title: 'Widget System', desc: 'Links, text, images & social — all customizable' },
              { icon: Sparkles, title: 'Themes', desc: 'Beautiful themes with glass effects and gradients' },
              { icon: BarChart3, title: 'Analytics', desc: 'Track page views, clicks, and referrers' },
            ].map((f, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-left hover:bg-white/[0.08] transition-all duration-300">
                <f.icon className="text-indigo-400 mb-3" size={24} />
                <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-slate-500">
        <p>© 2026 olnktr. Built with ♥</p>
      </footer>
    </div>
  );
}
