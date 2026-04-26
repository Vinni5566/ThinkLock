import { motion } from 'framer-motion';
import { HelpCircle, Lightbulb, Unlock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const steps = [
  {
    icon: HelpCircle,
    title: 'Ask',
    description: 'Submit your question to the AI system as you normally would.',
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    id: 1
  },
  {
    icon: Lightbulb,
    title: 'Think',
    description: 'Demonstrate your own reasoning. The system evaluates depth and effort.',
    color: 'text-warning',
    bg: 'bg-warning/10',
    id: 2
  },
  {
    icon: Unlock,
    title: 'Unlock',
    description: 'Once reasoning meets the threshold, the full AI answer is revealed.',
    color: 'text-success',
    bg: 'bg-success/10',
    id: 3
  },
];

export const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">How it works</h2>
          <p className="text-muted-foreground text-lg">Three steps to genuine understanding.</p>
        </motion.div>

        <div className="relative grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-[40%] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent z-0" />

          {steps.map((step, i) => {
            const isActive = activeStep === step.id;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                onMouseEnter={() => setActiveStep(step.id)}
                className={cn(
                  "relative z-10 p-8 rounded-3xl border bg-card/50 transition-all duration-300 ease-out text-center group cursor-default",
                  isActive 
                    ? "border-primary/50 shadow-2xl shadow-primary/10 scale-[1.05] -translate-y-2 opacity-100" 
                    : "border-border opacity-80 hover:opacity-100"
                )}
              >
                <div className={cn(
                  "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 ease-out",
                  step.bg,
                  isActive && "scale-110 shadow-lg"
                )}>
                  <step.icon className={cn("w-10 h-10 transition-all duration-300 ease-out", step.color)} />
                </div>
                <div className={cn(
                  "text-[10px] font-black uppercase tracking-widest mb-2 transition-colors duration-300",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  STEP {i + 1}
                </div>
                <h3 className="text-2xl font-black mb-3 tracking-tight">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {step.description}
                </p>

                {/* Subtle outer glow on active */}
                {isActive && (
                  <div className="absolute inset-0 rounded-3xl bg-primary/5 blur-xl -z-10 animate-pulse" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
