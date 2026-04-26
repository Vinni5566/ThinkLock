import { Navbar } from "@/components/landing/Navbar";
import { FooterSection } from "@/components/landing/FooterSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: "Message Dispatched",
        description: "Your inquiry has been logged in our secure system.",
      });
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      <Navbar />
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 -right-64 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10" />
      
      <main className="flex-1 pt-40 pb-32">
        <div className="container max-w-2xl px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                Get in Touch
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9]">
                Connect with the <span className="text-primary italic">Shield.</span>
              </h1>
              <p className="text-lg text-muted-foreground font-medium max-w-md mx-auto">
                Have questions about our cognitive enforcement protocols or technical architecture? We're here.
              </p>
            </div>

            <motion.form 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              onSubmit={handleSubmit} 
              className="space-y-8 bg-card/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-border/50 shadow-2xl shadow-primary/5 relative overflow-hidden group hover:border-primary/20 transition-all duration-500"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Identity</label>
                  <Input id="name" placeholder="Full name" required className="rounded-2xl h-14 bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300" />
                </div>
                <div className="space-y-3">
                  <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Digital Mail</label>
                  <Input id="email" type="email" placeholder="email@example.com" required className="rounded-2xl h-14 bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300" />
                </div>
              </div>
              <div className="space-y-3">
                <label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Inquiry Details</label>
                <Textarea id="message" placeholder="How can we assist your cognitive growth?" required className="min-h-[180px] rounded-[2rem] bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300 pt-5" />
              </div>
              <Button 
                type="submit" 
                className="w-full h-16 rounded-2xl gradient-primary text-primary-foreground font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Dispatching..." : "Transmit Message"}
              </Button>
            </motion.form>
          </motion.div>
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default Contact;
