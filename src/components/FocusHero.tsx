import { useMemo } from "react";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import PremiumCard from "./PremiumCard";
import { useTodos } from "@/hooks/useTodos";
import { cn } from "@/lib/utils";

const FocusHero = () => {
    const { todos, toggleTodo } = useTodos();

    const primaryTask = useMemo(() => {
        // Find highest priority incomplete task
        const incomplete = todos.filter(t => t.status === 'pending');
        if (incomplete.length === 0) return null;

        // Sort by priority (high > medium > low) and then date
        return incomplete.sort((a, b) => {
            const priorityMap = { high: 3, medium: 2, low: 1 };
            const pDiff = priorityMap[b.priority] - priorityMap[a.priority];
            if (pDiff !== 0) return pDiff;
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        })[0];
    }, [todos]);

    if (!primaryTask) {
        return (
            <PremiumCard className="p-8 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col justify-center">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-2 animate-pulse">
                        <CheckCircle2 className="h-8 w-8 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        All Clear for Now
                    </h2>
                    <p className="text-muted-foreground max-w-md">
                        You've crushed your tasks. Take a breath, or add a new focus for today.
                    </p>
                </div>
            </PremiumCard>
        );
    }

    return (
        <PremiumCard
            className="p-0 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] group/hero h-full"
            glowColor="rgba(59, 130, 246, 0.2)"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />

            <div className="p-8 md:p-10 relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between gap-6">
                    <div className="space-y-6 flex-1">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                Current Focus
                            </span>
                            {primaryTask.priority === 'high' && (
                                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                            )}
                        </div>

                        <div className="space-y-2">
                            <h2 className={cn(
                                "text-3xl md:text-5xl font-black tracking-tight transition-all duration-300 text-white leading-tight",
                                "group-hover/hero:text-blue-100 placeholder-opacity-50"
                            )}>
                                {primaryTask.title || "Untitled Task"}
                            </h2>
                            <p className="text-lg text-muted-foreground font-medium flex items-center gap-2">
                                <span className={cn(
                                    "inline-block w-2 h-2 rounded-full",
                                    primaryTask.isDaily ? "bg-amber-400" : "bg-blue-400"
                                )} />
                                {primaryTask.isDaily ? "Daily Ritual" : "Task"}
                                <span className="opacity-30">•</span>
                                {new Date(primaryTask.date).toLocaleDateString(undefined, { weekday: 'long' })}
                            </p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleTodo(primaryTask.id)}
                            className="group flex items-center gap-3 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-500/25 mt-4"
                        >
                            <div className="relative w-5 h-5">
                                <Circle className="h-5 w-5 opacity-100 group-hover:opacity-0 transition-opacity absolute inset-0" strokeWidth={2.5} />
                                <CheckCircle2 className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span>Mark as Complete</span>
                            <ArrowRight className="h-4 w-4 ml-1 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                        </motion.button>
                    </div>

                    <div className="hidden md:flex flex-col items-end justify-between h-full min-h-[140px]">
                        <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 backdrop-blur-md">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="h-6 w-6 border-[3px] border-blue-500 border-t-transparent rounded-full" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </PremiumCard>
    );
};

export default FocusHero;
