import { Button } from '@/components/ui/button';
import { BrainCircuit, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { isLoggedIn, user, logout } = useAuthStore();
  const location = useLocation();

  const navLinks = [
    { name: 'Features', href: '/#features' },
    { name: 'How it Works', href: '/#how-it-works' },
    { name: 'Problem', href: '/#problem' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl transition-all duration-300 ease-out">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-tighter">
          <BrainCircuit className="w-6 h-6 text-primary" />
          ThinkLock
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href || (link.href.startsWith('/#') && location.pathname === '/');
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-bold transition-all duration-300 ease-out relative py-1 group",
                  "text-primary shadow-sm"
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute bottom-0 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ease-out w-full opacity-100"
                )} />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted transition-all duration-300 ease-out hover:scale-105">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Button asChild size="sm" className="gradient-primary text-primary-foreground rounded-xl h-9 px-5 font-bold shadow-lg shadow-primary/20 transition-all duration-300 ease-out hover:scale-105">
                <Link to="/dashboard/chat">Dashboard</Link>
              </Button>
              <div className="relative group">
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground cursor-pointer uppercase shadow-md transition-transform duration-300 hover:scale-105">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="absolute right-0 top-full mt-2 w-40 bg-card rounded-xl shadow-xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                  <div className="p-2 border-b border-border">
                    <p className="text-sm font-bold truncate px-2">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate px-2">{user?.email || ''}</p>
                  </div>
                  <div className="p-1">
                    <Link to="/dashboard/settings" className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted font-medium transition-colors rounded-lg">
                      Settings
                    </Link>
                    <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-muted font-medium transition-colors rounded-lg">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex transition-all duration-300 ease-out hover:bg-muted">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="gradient-primary text-primary-foreground rounded-xl h-9 px-5 font-bold shadow-lg shadow-primary/20 transition-all duration-300 ease-out hover:scale-[1.03]">
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
