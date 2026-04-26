import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSessionStore } from "@/store/useSessionStore";
import { Search, Calendar, ChevronRight, MessageSquare, ShieldCheck, Timer, Lock, X, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";

const HistoryPage = () => {
  const { sessions, setActiveSessionId, searchQuery, setSearchQuery, deleteSession, clearAllSessions } = useSessionStore();
  const navigate = useNavigate();
  const [deleteMenuOpen, setDeleteMenuOpen] = useState<string | null>(null);

  const filteredSessions = sessions.filter(s => 
    s.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.messages?.some(m => m.content?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSessionClick = (id: string) => {
    navigate(`/dashboard/session/${id}`);
  };

  const handleDelete = async (id: string) => {
    console.log('HistoryPage: handleDelete called for', id);
    await deleteSession(id);
    setDeleteMenuOpen(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter">History</h1>
          <p className="text-muted-foreground">Review your past reasoning sessions and cognitive evolution.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <button 
            onClick={async () => {
              console.log('HistoryPage: Clear History clicked');
              await clearAllSessions();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors border border-destructive/20"
          >
            <Trash2 className="w-4 h-4" />
            Clear History
          </button>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-xl py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {sessions.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-muted/10 rounded-3xl border border-dashed border-border">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-bold">No chats yet</h2>
            <p className="text-sm text-muted-foreground">Start your first thinking session to build your cognitive profile.</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-muted/10 rounded-3xl border border-dashed border-border">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-bold">No results found</h2>
            <p className="text-sm text-muted-foreground">Try searching for a different keyword or topic.</p>
          </div>
        ) : (
          filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="relative group/session flex-1 min-w-0">
                <div
                  onClick={() => handleSessionClick(session.id)}
                  className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all group overflow-hidden relative cursor-pointer"
                >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  session.status === 'active' ? 'bg-success/10 text-success' :
                  session.status === 'partial' ? 'bg-warning/10 text-warning' :
                  'bg-destructive/10 text-destructive'
                }`}>
                  {session.status === 'active' ? <ShieldCheck className="w-6 h-6" /> : 
                   session.status === 'partial' ? <Timer className="w-6 h-6" /> : 
                   <Lock className="w-6 h-6" />}
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-bold truncate text-lg group-hover:text-primary transition-colors">
                    {session.question}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {session.createdAt}
                    </span>
                    <span className="flex items-center gap-1.5 capitalize">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        session.status === 'active' ? 'bg-success' :
                        session.status === 'partial' ? 'bg-warning' :
                        'bg-destructive'
                      }`} />
                      {session.status} Guidance
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all mr-8" />
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteMenuOpen(deleteMenuOpen === session.id ? null : session.id);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-muted text-muted-foreground z-10"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {deleteMenuOpen === session.id && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2 w-40 bg-card border border-border rounded-xl shadow-2xl z-[100] overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                  <button 
                    onClick={() => handleDelete(session.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors font-medium relative z-[101]"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Session
                  </button>
                </div>
              )}
            </div>
          </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
