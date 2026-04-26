import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChatPreview } from './ChatPreview';
import { useAuthStore } from '@/store/useAuthStore';

export const HeroSection = () => {
  const { isLoggedIn } = useAuthStore();
  
  return (
  <section className="relative min-h-screen flex items-center overflow-hidden">
    {/* Background glow */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
    </div>

    <div className="container relative z-10 grid lg:grid-cols-2 gap-16 items-center py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur mb-8 transition-all duration-300 ease-out hover:border-primary/30 hover:bg-card/80">
          <ShieldAlert className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">AI Thinking Enforcement System</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
          Answers aren’t the problem.{' '}
          <span className="gradient-primary-text">Thinking is.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed">
          ThinkLock blocks instant AI answers and forces you to reason first — so you actually understand, not just copy.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg" className="gradient-primary text-primary-foreground px-8 h-12 text-base font-semibold rounded-xl glow-primary transition-all duration-300 ease-out hover:scale-[1.03]">
            <Link to={isLoggedIn ? "/dashboard/chat" : "/signup"}>
              {isLoggedIn ? "Go to Dashboard" : "Try Think Mode"} <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 text-base rounded-xl border-border cursor-pointer transition-all duration-300 ease-out hover:bg-muted/50 hover:border-primary/20 hover:text-primary hover:scale-105" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
            <span>See How It Works</span>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="hidden lg:block"
      >
        <ChatPreview />
      </motion.div>
    </div>
  </section>
  );
};
