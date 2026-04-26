import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { BrainCircuit, MessageSquare, GitBranch, UserCircle, ShieldAlert, FileText, Settings, Sun, Moon, Menu, X, History, BarChart3, Lock, Timer, ShieldCheck, LogOut, Plus, MoreVertical, Trash2 } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockSession } from '@/lib/mockData';
import { useAuthStore } from '@/store/useAuthStore';
import { useSessionStore } from '@/store/useSessionStore';

const navGroups = [
  {
    label: 'Core',
    items: [
      { title: 'Reasoning Lab', icon: BrainCircuit, path: '/dashboard/chat' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { title: 'Thinking Graph', icon: GitBranch, path: '/dashboard/thinking-graph' },
      { title: 'Cognitive Profile', icon: UserCircle, path: '/dashboard/cognitive-profile' },
      { title: 'History', icon: History, path: '/dashboard/history' },
    ],
  },
  {
    label: 'System',
    items: [
      { title: 'Anti-Gaming', icon: ShieldAlert, path: '/dashboard/anti-gaming' },
      { title: 'Reasoning Replay', icon: FileText, path: '/dashboard/reasoning-replay' },
      { title: 'Dependency Tracker', icon: BarChart3, path: '/dashboard/dependency-tracker' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { title: 'Settings', icon: Settings, path: '/dashboard/settings' },
    ],
  },
];

const DashboardLayout = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { activeSessionId, sessions, setActiveSessionId, fetchSessions } = useSessionStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const activeSessionDetails = (sessions || []).find((s) => s?.id === activeSessionId);
  const recentSessions = (sessions || []).slice(0, 2);
  const { deleteSession } = useSessionStore();
  const [deleteMenuOpen, setDeleteMenuOpen] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    console.log('DashboardLayout: handleDelete called for', id);
    await deleteSession(id);
    setDeleteMenuOpen(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPageInfo = (pathname: string) => {
    switch (pathname) {
      case '/dashboard/chat':
        return { title: 'Reasoning Lab', desc: 'Active reasoning session' };
      case '/dashboard/thinking-graph':
        return { title: 'Thinking Graph', desc: 'Visualize how your reasoning evolves' };
      case '/dashboard/cognitive-profile':
        return { title: 'Cognitive Profile', desc: 'Your personalized thinking analytics' };
      case '/dashboard/history':
        return { title: 'History', desc: 'Review past reasoning sessions' };
      case '/dashboard/anti-gaming':
        return { title: 'Anti-Gaming', desc: 'System integrity and behavior detection' };
      case '/dashboard/reasoning-replay':
        return { title: 'Reasoning Replay', desc: 'Step-by-step logic evolution' };
      case '/dashboard/dependency-tracker':
        return { title: 'Dependency Tracker', desc: 'Measure your independence from AI' };
      case '/dashboard/settings':
        return { title: 'Settings', desc: 'Manage your ThinkLock preferences' };
      default:
        if (pathname.startsWith('/dashboard/session/')) {
          return { title: 'Session View', desc: 'Reviewing past reasoning' };
        }
        return { title: 'Dashboard', desc: '' };
    }
  };

  const { title, desc } = getPageInfo(location.pathname);

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 border-r border-border bg-card flex-col shrink-0">
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-border">
            <Link to="/" className="flex items-center gap-2 font-bold">
              <BrainCircuit className="w-6 h-6 text-primary" />
              <div className="flex flex-col">
                <span className="text-sm leading-none">ThinkLock</span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Enforcing Thinking</span>
              </div>
            </Link>
          </div>
          <nav className="flex-1 p-3 space-y-6 overflow-y-auto custom-scrollbar">

            {recentSessions.length > 0 && (
              <div>
                <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground tracking-wider">
                  Recent Sessions
                </div>
                <div className="space-y-0.5">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="relative group/session">
                      <button
                        onClick={() => {
                          navigate(`/dashboard/session/${session.id}`);
                          setSidebarOpen(false);
                        }}
                        className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                          activeSessionId === session.id
                            ? 'bg-muted/50 text-foreground font-medium pr-10'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted pr-10'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 shrink-0" />
                        <span className="truncate">{session.question}</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteMenuOpen(deleteMenuOpen === session.id ? null : session.id);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted opacity-0 group-hover/session:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                      
                      {deleteMenuOpen === session.id && (
                        <div className="absolute right-2 top-10 w-32 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden py-1">
                          <button 
                            onClick={() => handleDelete(session.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-muted transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Chat
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {navGroups.map((group) => (
              <div key={group.label}>
                <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground tracking-wider">
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => {
                          if (item.path === '/dashboard/chat') {
                            setActiveSessionId(null);
                          }
                          setSidebarOpen(false);
                        }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                          active
                            ? 'gradient-primary text-primary-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between group cursor-pointer" onClick={handleLogout}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground uppercase">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{user?.name || 'User'}</div>
                  <div className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</div>
                </div>
              </div>
              <LogOut className="w-4 h-4 text-destructive opacity-0 group-hover:opacity-100 transition-all duration-200" />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="p-5 border-b border-border">
                  <Link to="/" className="flex items-center gap-2 font-bold">
                    <BrainCircuit className="w-6 h-6 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-sm leading-none">ThinkLock</span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Enforcing Thinking</span>
                    </div>
                  </Link>
                </div>
                <nav className="flex-1 p-3 space-y-6 overflow-y-auto custom-scrollbar">

                  {recentSessions.length > 0 && (
                    <div>
                      <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground tracking-wider">
                        Recent Sessions
                      </div>
                      <div className="space-y-0.5">
                        {recentSessions.map((session) => (
                          <div key={session.id} className="relative group/session">
                            <button
                              onClick={() => {
                                navigate(`/dashboard/session/${session.id}`);
                                setSidebarOpen(false);
                              }}
                              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                                activeSessionId === session.id
                                  ? 'bg-muted/50 text-foreground font-medium pr-10'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted pr-10'
                              }`}
                            >
                              <MessageSquare className="w-4 h-4 shrink-0" />
                              <span className="truncate">{session.question}</span>
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteMenuOpen(deleteMenuOpen === session.id ? null : session.id);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted opacity-100 lg:opacity-0 group-hover/session:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                            
                            {deleteMenuOpen === session.id && (
                              <div className="absolute right-2 top-10 w-32 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden py-1">
                                <button 
                                  onClick={() => handleDelete(session.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-muted transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete Chat
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {navGroups.map((group) => (
                    <div key={group.label}>
                      <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground tracking-wider">
                        {group.label}
                      </div>
                      <div className="space-y-0.5">
                        {group.items.map((item) => {
                          const active = location.pathname === item.path;
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => {
                                if (item.path === '/dashboard/chat') {
                                  setActiveSessionId(null);
                                }
                                setSidebarOpen(false);
                              }}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                                active
                                  ? 'gradient-primary text-primary-foreground font-medium'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                              }`}
                            >
                              <item.icon className="w-4 h-4" />
                              {item.title}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
                <div className="p-4 border-t border-border">
                  <div className="flex items-center justify-between group cursor-pointer" onClick={handleLogout}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground uppercase">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{user?.name || 'User'}</div>
                        <div className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</div>
                      </div>
                    </div>
                    <LogOut className="w-4 h-4 text-destructive opacity-0 group-hover:opacity-100 transition-all duration-200" />
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-14 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-card/80 backdrop-blur-md sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-muted">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h1 className="font-bold text-sm">
                  {activeSessionDetails ? `Session: ${activeSessionDetails.question}` : title}
                </h1>
              </div>
              <p className="hidden md:block text-xs text-muted-foreground">
                {activeSessionDetails ? "Active reasoning session" : desc}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted transition-colors">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="relative group">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground cursor-pointer uppercase shadow-md transition-transform duration-300 hover:scale-105">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl shadow-xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-bold truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="p-1">
                  <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-destructive hover:bg-muted font-medium transition-colors rounded-lg">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-background/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
