import { motion } from 'framer-motion';
import { AlertCircle, Brain, Target } from 'lucide-react';

const reasons = [
  {
    icon: AlertCircle,
    title: "AI Dependency",
    description: "Instant answers create a 'copy-paste' habit, eroding our ability to think through complex problems from first principles."
  },
  {
    icon: Brain,
    title: "Shallow Thinking",
    description: "When AI does the heavy lifting, we lose the cognitive struggle necessary for neuroplasticity and deep neural encoding."
  },
  {
    icon: Target,
    title: "Real-world Impact",
    description: "Decision-making skills are atrophying. ThinkLock restores the 'reasoning muscle' required for innovation and leadership."
  }
];

export const WhyThisExistsSection = () => (
  <section id="problem" className="py-24 relative overflow-hidden bg-muted/30">
    <div className="container">
      <div className="max-w-3xl mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6"
        >
          The Problem
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black mb-6 leading-tight"
        >
          We are losing the <span className="gradient-primary-text">art of thinking.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground leading-relaxed"
        >
          In a world of instant AI answers, the human mind is becoming a spectator. ThinkLock was built to reverse this trend by making reasoning the prerequisite for information.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {reasons.map((reason, i) => (
          <motion.div
            key={reason.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 + 0.3 }}
            className="p-8 rounded-2xl bg-card border border-border group hover:border-primary/30 transition-all duration-300 ease-out hover:shadow-lg hover:scale-105"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <reason.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {reason.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="mt-20 p-8 md:p-12 rounded-3xl gradient-card border border-border/50 text-center relative overflow-hidden transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-32 -mt-32" />
        <h3 className="text-2xl md:text-3xl font-black mb-4">"Not another AI assistant."</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          ThinkLock doesn't help you skip thinking. <span className="text-foreground font-semibold">It ensures you do it.</span> By enforcing active reasoning, we turn every AI interaction into a cognitive growth opportunity.
        </p>
      </motion.div>
    </div>
  </section>
);
