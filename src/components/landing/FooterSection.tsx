import { BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FooterSection = () => (
  <footer className="border-t border-border bg-card/30 py-16 transition-all duration-300 ease-out">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-12 items-start">
        {/* Column 1: Brand & Mission */}
        <div className="flex flex-col items-start">
          <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-tighter mb-4 hover:opacity-80 transition-opacity">
            <BrainCircuit className="w-6 h-6 text-primary" />
            <span>ThinkLock</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xs">
            An AI system designed to build real understanding, not dependency.
          </p>
          <p className="text-xs font-medium text-primary italic">
            "This AI doesn’t replace thinking. It enforces it."
          </p>
        </div>

        {/* Column 2: Product */}
        <div className="flex flex-col items-start">
          <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-foreground">Product</h4>
          <ul className="space-y-4">
            <li><Link to="/#features" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 ease-out">Features</Link></li>
            <li><Link to="/#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 ease-out">How it Works</Link></li>
            <li><Link to="/#problem" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 ease-out">Problem</Link></li>
          </ul>
        </div>

        {/* Column 3: Project */}
        <div className="flex flex-col items-start">
          <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-foreground">Project</h4>
          <ul className="space-y-4">
            <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 ease-out">About</Link></li>
            <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 ease-out">Contact</Link></li>
            <li><a href="https://github.com/Vinni5566/cognitive-shield" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 ease-out">Source</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border mt-16 pt-8 text-center text-xs text-muted-foreground">
        © 2026 ThinkLock. All rights reserved.
      </div>
    </div>
  </footer>
);
