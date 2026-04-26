import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, AlertTriangle, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';

const messages = [
  {
    type: 'user' as const,
    text: 'What causes inflation?',
  },
  {
    type: 'blocked' as const,
    icon: XCircle,
    label: 'NO EFFORT DETECTED',
    text: 'Answer withheld. Show your reasoning first.',
  },
  {
    type: 'user' as const,
    text: 'I think inflation happens when money supply increases faster than goods produced, reducing purchasing power...',
  },
  {
    type: 'hint' as const,
    icon: AlertTriangle,
    label: 'PARTIAL REASONING',
    text: 'Good start. Consider demand-pull vs cost-push factors.',
  },
  {
    type: 'user' as const,
    text: 'Right — demand-pull when spending exceeds supply, cost-push from rising input costs. Plus expectations can be self-fulfilling.',
  },
  {
    type: 'unlocked' as const,
    icon: CheckCircle2,
    label: 'UNDERSTANDING CONFIRMED',
    text: 'Excellent! You clearly understand the core mechanics. Full answer: Inflation stems from...',
  },
];

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-muted/30 rounded-2xl rounded-bl-sm px-4 py-2 border border-border/50">
      <MoreHorizontal className="w-5 h-5 text-muted-foreground animate-pulse" />
    </div>
  </div>
);

export const ChatPreview = () => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (visibleCount < messages.length) {
      const isAI = messages[visibleCount].type !== 'user';
      
      const timeout = setTimeout(() => {
        if (isAI && !isTyping) {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setVisibleCount(prev => prev + 1);
          }, 1500);
        } else {
          setVisibleCount(prev => prev + 1);
        }
      }, isAI ? 600 : 1200);

      return () => clearTimeout(timeout);
    } else {
      // Loop the animation after a delay
      const loopTimeout = setTimeout(() => {
        setVisibleCount(0);
      }, 5000);
      return () => clearTimeout(loopTimeout);
    }
  }, [visibleCount, isTyping]);

  return (
    <div className="glass-card rounded-2xl p-1 glow-primary max-w-lg mx-auto">
      <div className="bg-card rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/20">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground ml-2 uppercase">ThinkLock — Active Session</span>
        </div>
        <div className="p-4 space-y-4 h-[420px] overflow-y-auto scrollbar-hide flex flex-col">
          <AnimatePresence mode="popLayout">
            {messages.slice(0, visibleCount).map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full"
              >
                {msg.type === 'user' ? (
                  <div className="flex justify-end">
                    <div className="chat-bubble-user max-w-[85%] text-[13px] leading-relaxed shadow-sm">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div
                      className={`max-w-[90%] rounded-2xl rounded-bl-sm px-4 py-3 border text-[13px] leading-relaxed shadow-sm ${
                        msg.type === 'blocked'
                          ? 'status-blocked'
                          : msg.type === 'hint'
                          ? 'status-hint'
                          : 'status-unlocked'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5 opacity-80">
                        {msg.icon && <msg.icon className="w-3.5 h-3.5" />}
                        <span className="text-[10px] font-black tracking-tighter uppercase whitespace-nowrap">{msg.label}</span>
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

