import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';
import { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthBackground = () => {
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // 15 nodes for a clean network
    const nodes = useMemo(() => {
        return Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 2,
            baseX: Math.random() * 100,
            baseY: Math.random() * 100,
        }));
    }, []);

    return (
        <div className="relative w-full h-full gradient-primary overflow-hidden flex flex-col justify-center items-center px-12 text-white">
            {/* Background Layer: Animated Gradient Blob */}
            <div className="absolute inset-0 z-0">
                <motion.div 
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.4, 0.3],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.2)_0%,transparent_70%)]"
                />
            </div>

            {/* Midground Layer: Nodes & Lines (Thinking Graph) */}
            <div className="absolute inset-0 z-10 opacity-40">
                <svg className="w-full h-full">
                    {/* Draw Lines */}
                    {nodes.map((node, i) => {
                        const connections = nodes.slice(i + 1, i + 3); // Each node connects to 2 neighbors
                        return connections.map((conn, j) => (
                            <motion.line 
                                key={`line-${i}-${j}`}
                                x1={`${node.x}%`}
                                y1={`${node.y}%`}
                                x2={`${conn.x}%`}
                                y2={`${conn.y}%`}
                                stroke="currentColor"
                                strokeWidth="0.5"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ 
                                    pathLength: [0, 1, 0.5],
                                    opacity: [0.1, 0.3, 0.1],
                                    x1: [`${node.x}%`, `${node.x + (Math.random() - 0.5) * 4}%`],
                                    y1: [`${node.y}%`, `${node.y + (Math.random() - 0.5) * 4}%`],
                                }}
                                transition={{
                                    duration: 10 + Math.random() * 5,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                style={{ willChange: "transform" }}
                            />
                        ));
                    })}
                    
                    {/* Draw Nodes */}
                    {nodes.map((node) => (
                        <motion.circle 
                            key={node.id}
                            cx={`${node.x}%`}
                            cy={`${node.y}%`}
                            r={node.size}
                            fill="currentColor"
                            initial={{ opacity: 0 }}
                            animate={{ 
                                opacity: [0.2, 0.6, 0.2],
                                scale: [1, 1.5, 1],
                                cx: [`${node.x}%`, `${node.x + (Math.random() - 0.5) * 5}%`],
                                cy: [`${node.y}%`, `${node.y + (Math.random() - 0.5) * 5}%`],
                            }}
                            transition={{
                                duration: 8 + Math.random() * 4,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{ willChange: "transform" }}
                        />
                    ))}
                </svg>
            </div>

            {/* Parallax Foreground Content */}
            <motion.div 
                style={{
                    x: (mousePosition.x - window.innerWidth / 2) * 0.02,
                    y: (mousePosition.y - window.innerHeight / 2) * 0.02,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className="relative z-20 flex flex-col items-center text-center cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
                onClick={() => navigate('/')}
            >
                <div className="w-20 h-20 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-8 shadow-2xl transition-all hover:bg-white/20">
                    <BrainCircuit className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-6xl font-black mb-4 tracking-tighter drop-shadow-2xl">
                    ThinkLock
                </h1>
                <p className="text-xl font-bold uppercase tracking-[0.3em] opacity-80 mb-12">
                    Enforcing thinking
                </p>
                <div className="max-w-md h-[1px] w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent mb-12" />
                <p className="text-2xl font-medium leading-relaxed italic max-w-sm opacity-90">
                    "This AI doesn’t give answers.<br /> 
                    <span className="text-white font-black not-italic underline decoration-white/20 decoration-2 underline-offset-8">It makes you think.</span>"
                </p>
            </motion.div>

            {/* Glassmorphism Accents */}
            <div className="absolute top-1/4 -right-20 w-80 h-80 bg-white/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-white/5 rounded-full blur-[100px]" />
        </div>
    );
};
