import { useSessionStore } from '@/store/useSessionStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SessionSelector = () => {
  const { sessions, activeSessionId, setActiveSessionId } = useSessionStore();
  const navigate = useNavigate();

  const handleValueChange = (value: string) => {
    if (value === 'none') {
        setActiveSessionId(null);
        return;
    }
    setActiveSessionId(value);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-card/50 p-4 rounded-2xl border border-border/50 mb-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
        <MessageSquare className="w-4 h-4 text-primary" />
        Analyze Session:
      </div>
      <Select value={activeSessionId || 'none'} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full sm:w-[300px] bg-background/50 border-border/50 rounded-xl">
          <SelectValue placeholder="Select a session to analyze" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-border/50 shadow-xl">
          <SelectItem value="none" className="text-muted-foreground italic">No session selected</SelectItem>
          {sessions.map((session) => (
            <SelectItem key={session.id} value={session.id || ''} className="cursor-pointer">
              {session.question || 'Untitled Session'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
