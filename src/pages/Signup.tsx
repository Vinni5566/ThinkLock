import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrainCircuit, Mail, Lock, ArrowRight, Loader2, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { useToast } from '@/components/ui/use-toast';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast({
                title: "Passwords don't match",
                description: "Please ensure both passwords are identical.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            login({ id: '1', email, name: email.split('@')[0] });
            setLoading(false);
            toast({
                title: "Account created",
                description: "Welcome to ThinkLock. Your cognitive journey begins.",
            });
            navigate('/dashboard/chat');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex bg-background overflow-hidden relative transition-all duration-300 ease-out">
            {/* LEFT SECTION: Visual Identity (Desktop) */}
            <div className="hidden lg:block w-1/2 h-screen border-r border-border/10 shadow-2xl z-20">
                <AuthBackground />
            </div>

            {/* RIGHT SECTION: Form */}
            <main className="w-full lg:w-1/2 h-screen flex flex-col justify-center items-center p-6 sm:p-12 relative bg-card/20 backdrop-blur-3xl z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key="signup-form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full max-w-md py-6 flex flex-col justify-center space-y-6 my-auto"
                    >
                        {/* MOBILE BRAND HEADER */}
                        <div 
                            className="lg:hidden flex flex-col items-center mb-2 cursor-pointer transition-transform duration-300 hover:scale-[1.03]" 
                            onClick={() => navigate('/')}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 transition-all duration-300 ease-out hover:scale-110">
                                <BrainCircuit className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter mb-1">ThinkLock</h2>
                            <p className="text-xs font-black uppercase tracking-widest text-primary/60">Enforcing thinking</p>
                        </div>

                        {/* CONTEXT LINE */}
                        <div className="space-y-2">
                            <p className="text-sm font-black uppercase tracking-widest text-primary/60 flex items-center gap-2">
                                <Info className="w-4 h-4" /> REGISTRATION
                            </p>
                            <h1 className="text-3xl font-black tracking-tight leading-tight">
                                Start <br /> 
                                <span className="gradient-primary-text italic underline decoration-primary/20 decoration-2 underline-offset-8">Understanding.</span>
                            </h1>
                            <p className="text-muted-foreground pt-1">Join the revolution of conscious AI interaction.</p>
                        </div>

                        {/* FORM */}
                        <form className="space-y-5" onSubmit={handleSignup}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest opacity-60">Email Address</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-all duration-300 group-focus-within:text-primary" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@company.com"
                                            required
                                            className="pl-12 h-12 rounded-2xl border-border bg-background focus:ring-primary transition-all duration-300 shadow-sm hover:border-primary/30"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest opacity-60">Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-all duration-300 group-focus-within:text-primary" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            className="pl-12 h-12 rounded-2xl border-border bg-background focus:ring-primary transition-all duration-300 shadow-sm hover:border-primary/30"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password" className="text-xs font-black uppercase tracking-widest opacity-60">Confirm Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-all duration-300 group-focus-within:text-primary" />
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            className="pl-12 h-12 rounded-2xl border-border bg-background focus:ring-primary transition-all duration-300 shadow-sm hover:border-primary/30"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button 
                                className="w-full h-12 rounded-2xl gradient-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all duration-300 ease-out hover:scale-[1.02] hover:brightness-110 active:scale-95 disabled:opacity-70"
                                type="submit" 
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        Create Account <ArrowRight className="w-4 h-4" />
                                    </div>
                                )}
                            </Button>
                        </form>

                        {/* BRAND LINE & SWITCH */}
                        <div className="pt-2 flex flex-col items-center gap-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 text-center">
                                No shortcuts. Just thinking.
                            </p>
                            <p className="text-sm text-center text-muted-foreground font-medium">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary hover:primary-text-shadow transition-all font-black decoration-primary/20 underline decoration-2 underline-offset-4">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Decorative background flair */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] z-0" />
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] z-0 lg:hidden" />
        </div>
    );
};

export default Signup;
