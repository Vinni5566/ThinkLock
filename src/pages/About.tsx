import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/landing/Navbar';
import { FooterSection } from '@/components/landing/FooterSection';
import { BrainCircuit, Target, Lightbulb, TrendingUp, Shield, Activity, GraduationCap, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-3/4 -right-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <main className="pt-32 pb-32">
        <div className="container max-w-6xl px-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-28"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              Our Mission
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
              Think <span className="gradient-primary-text italic">deeper.</span><br />
              Understand <span className="text-primary">more.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-medium">
              We are fighting <span className="text-primary font-bold">cognitive atrophy</span> in the age of instant AI. ThinkLock isn't just a tool; it's a trainer for your mind.
            </p>
          </motion.div>

          {/* Core Content Grid: Problem vs Solution */}
          <div className="grid lg:grid-cols-2 gap-12 mb-36 items-stretch">
            {/* Problem Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] bg-muted/30 border border-border/50 relative overflow-hidden group hover:border-destructive/20 transition-all duration-500"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-destructive" />
                </div>
                <h2 className="text-3xl font-black tracking-tight">The Crisis</h2>
              </div>
              
              <div className="space-y-6 text-lg text-muted-foreground/80 leading-relaxed">
                <p>
                  Modern AI is built for <span className="text-foreground font-bold">speed and convenience</span>. By providing instant resolutions, it bypasses the <span className="text-destructive font-semibold italic underline decoration-destructive/30 decoration-2 underline-offset-4">necessary struggle</span> required for learning.
                </p>
                <p>
                  We are creating a generation of <span className="text-foreground font-bold italic">shallow thinkers</span> who prioritize output over genuine comprehension. When you stop reasoning, your cognitive muscles begin to waste away.
                </p>
              </div>
              
              <div className="mt-10 pt-8 border-t border-border/40 flex items-center gap-3">
                <Activity className="w-5 h-5 text-destructive/40" />
                <span className="text-sm font-black uppercase tracking-widest text-destructive/60">Risk: Dependency</span>
              </div>
            </motion.div>

            {/* Solution Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] bg-primary/5 border border-primary/20 relative overflow-hidden group hover:border-primary/40 transition-all duration-500 shadow-2xl shadow-primary/5"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-black tracking-tight">The Refusal</h2>
              </div>
              
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  ThinkLock is an <span className="text-primary font-bold">enforced thinking layer</span>. We don't hide the answer because we can't; we hide it because we <span className="text-foreground font-bold">choose to prioritize your growth.</span>
                </p>
                <p>
                  By requiring <span className="text-primary font-bold italic underline decoration-primary/30 decoration-2 underline-offset-4">active reasoning proof</span> before revelation, we transform AI into a high-performance cognitive gym.
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-primary/10 flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary/40" />
                <span className="text-sm font-black uppercase tracking-widest text-primary/60">Effect: Mastery</span>
              </div>
            </motion.div>
          </div>

          {/* Three Pillars Section (filling side space) */}
          {/* Pillars Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black tracking-tight">The Principles</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-36">
            {[
              { 
                icon: Shield, 
                title: "Enforced Effort", 
                desc: "No more copy-pasting. Prove you've thought about the problem before the AI helps you.",
                color: "text-primary"
              },
              { 
                icon: GraduationCap, 
                title: "Internal Encoding", 
                desc: "The struggle of reasoning ensures the information is actually stored in your long-term memory.",
                color: "text-success"
              },
              { 
                icon: BrainCircuit, 
                title: "Cognitive Autonomy", 
                desc: "Break the dependency loop. Use AI to augment your mind, not replace it.",
                color: "text-warning"
              },
            ].map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2rem] border border-border bg-card/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
              >
                <div className={cn("w-14 h-14 rounded-2xl bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-6 transition-colors duration-300", pillar.color)}>
                  <pillar.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black mb-3 italic">{pillar.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Vision Section with Highlighted Text */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            viewport={{ once: true }}
            className="mb-36 p-12 md:p-20 rounded-[3rem] bg-card border border-border/50 text-center relative overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl hover:border-primary/20"
          >
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 mb-8">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-black tracking-tight text-foreground">The Vision</h2>
              </div>
              <p className="text-2xl md:text-3xl font-medium leading-[1.3] text-muted-foreground max-w-4xl mx-auto">
                "We are building a future where <span className="text-foreground font-black">technology empowers human thought</span> instead of automating it away. ThinkLock is the first step toward <span className="text-primary italic font-bold underline decoration-primary/20 decoration-2 underline-offset-8">universal cognitive independence</span>."
              </p>
            </div>
          </motion.section>

          {/* Call to Action Section */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 md:p-16 rounded-[3rem] bg-primary text-primary-foreground text-center relative overflow-hidden shadow-2xl shadow-primary/20"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-50" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">
                Ready to reclaim your <span className="italic">cognitive autonomy?</span>
              </h2>
              <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto font-medium">
                Join the movement of thinkers who choose mastery over convenience. Stop outsourcing your mind.
              </p>
              <div className="flex justify-center">
                <Link 
                  to="/signup" 
                  className="px-10 py-5 rounded-full bg-white text-primary font-black uppercase tracking-widest hover:scale-105 transition-transform duration-300 shadow-xl"
                >
                  Begin Your Ascent
                </Link>
              </div>
            </div>
            
            {/* Decorative Icon */}
            <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12">
              <BrainCircuit className="w-64 h-64" />
            </div>
          </motion.section>

        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default About;
