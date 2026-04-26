import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl border-border bg-card/95 backdrop-blur-xl">
        <DialogHeader className="flex flex-col items-center pt-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 glow-primary"
          >
            <BrainCircuit className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <DialogTitle className="text-2xl font-bold text-center">
            Continue your thinking journey
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground pt-2 px-4">
            You’re thinking better already. Save your progress and continue building genuine intelligence.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-6">
          <Button 
            className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold text-lg"
            onClick={() => navigate('/signup')}
          >
            Sign Up Now
          </Button>
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl border-border text-base"
            onClick={() => navigate('/login')}
          >
            I already have an account
          </Button>
        </div>
        <DialogFooter className="sm:justify-center">
          <button 
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            Continue later
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
