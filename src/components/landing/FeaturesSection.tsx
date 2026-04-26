import { motion } from 'framer-motion';
import { BrainCircuit, BarChart3, ShieldCheck, Zap, History, MousePointer2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: BrainCircuit,
    title: 'Thinking Graph',
    description: 'Visualize reasoning pathways in real-time. See concept connections and missing logical steps.',
  },
  {
    icon: BarChart3,
    title: 'Cognitive Scoring',
    description: 'Effort-based assessment of your understanding. Track your cognitive improvement over time.',
  },
  {
    icon: ShieldCheck,
    title: 'Anti-Gaming AI',
    description: 'Advanced detection of prompt manipulation and shortcuts. Prevents bypassing the thinking block.',
  },
  {
    icon: Zap,
    title: 'Adaptive Enforcement',
    description: 'Difficulty adjusts automatically to your mastery level. Weaker areas get more challenge.',
  },
  {
    icon: History,
    title: 'Reasoning Replay',
    description: 'Review and debug your own thought process like a developer. See where your logic failed.',
  },
  {
    icon: MousePointer2,
    title: 'Dependency Tracker',
    description: 'Measure exactly how much you rely on AI across different domains. Build self-reliance.',
  },
];

export const FeaturesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="features" className="py-32 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest mb-6"
          >
            Capabilities
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Intelligence, <span className="gradient-primary-text">not shortcuts</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Every feature is designed to transform AI from a dependency into a high-performance cognitive gym.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "relative p-8 rounded-3xl border bg-card/50 transition-all duration-300 ease-out h-full flex flex-col group",
                hoveredIndex !== null && hoveredIndex !== i ? "opacity-60 grayscale-[0.5] scale-[0.98]" : "opacity-100",
                hoveredIndex === i ? "border-primary/50 shadow-xl shadow-primary/5 -translate-y-2 scale-[1.03]" : "border-border"
              )}
              style={{
                // @ts-ignore
                "--feature-icon-color": "hsl(var(--primary))"
              }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-primary/10 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-primary/5">
                <f.icon className="w-7 h-7 text-primary transition-all duration-300 ease-out group-hover:scale-110" style={{ color: "var(--feature-icon-color)" }} />
              </div>
              <h3 className="text-2xl font-black mb-3 tracking-tight">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm flex-1">
                {f.description}
              </p>

              {/* Hover glow effect */}
              {hoveredIndex === i && (
                <div className="absolute inset-0 rounded-3xl bg-primary/5 blur-2xl -z-10 animate-pulse" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

