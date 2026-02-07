import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, AlertTriangle, CheckCircle, Info, Lightbulb } from "lucide-react";
import { useAIInsights, Insight } from "@/hooks/useAIInsights";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import PremiumCard from "./PremiumCard";

const AIInsightsCard = () => {
    const { insights } = useAIInsights();

    const getIcon = (type: Insight["type"]) => {
        switch (type) {
            case "success": return <CheckCircle className="h-4 w-4 text-emerald-400" />;
            case "warning": return <AlertTriangle className="h-4 w-4 text-amber-400" />;
            case "tip": return <Lightbulb className="h-4 w-4 text-primary" />;
            default: return <Info className="h-4 w-4 text-blue-400" />;
        }
    };

    const getBg = (type: Insight["type"]) => {
        switch (type) {
            case "success": return "bg-emerald-500/5 group-hover:bg-emerald-500/10 border-emerald-500/10";
            case "warning": return "bg-amber-500/5 group-hover:bg-amber-500/10 border-amber-500/10";
            case "tip": return "bg-primary/5 group-hover:bg-primary/10 border-primary/10";
            default: return "bg-blue-500/5 group-hover:bg-blue-500/10 border-blue-500/10";
        }
    };

    // Now always has at least one insight from useAIInsights hook

    return (
        <PremiumCard className="p-6 h-full flex flex-col relative overflow-hidden" glowColor="rgba(var(--primary), 0.3)">
            {/* Neural Core Background Effect */}
            <div className="absolute top-0 right-0 p-12 opacity-20 pointer-events-none">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/40 blur-[40px] rounded-full animate-pulse" />
                    <div className="h-24 w-24 border border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-2 border border-primary/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                </div>
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/40 blur-lg rounded-full animate-pulse" />
                        <div className="relative bg-black/50 p-2.5 rounded-xl border border-primary/30 backdrop-blur-md shadow-[0_0_15px_-3px_hsl(var(--primary)/0.5)]">
                            <Sparkles className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-primary/80 to-white">Neural Insights</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_5px_hsl(var(--primary))]" />
                            <span className="text-[10px] uppercase tracking-widest text-primary/70 font-medium">System Online</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {insights.map((insight, i) => (
                        <motion.div
                            key={insight.title}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "p-4 rounded-xl border relative overflow-hidden group transition-colors duration-300",
                                getBg(insight.type)
                            )}
                        >
                            <div className="flex gap-3 items-start relative z-10">
                                <div className="mt-0.5 shrink-0 bg-background/50 p-1.5 rounded-full backdrop-blur-sm border border-white/5 shadow-sm">
                                    {getIcon(insight.type)}
                                </div>
                                <div className="space-y-1.5 flex-1 min-w-0">
                                    <h3 className="font-bold text-sm truncate pr-4">{insight.title}</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                                        {insight.message}
                                    </p>
                                    {insight.action && (
                                        <div className="pt-2">
                                            <Button asChild variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1 hover:bg-white/5">
                                                <Link to={insight.action}>
                                                    Take Action <ArrowRight className="h-2.5 w-2.5 opacity-50" />
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </PremiumCard>
    );
};

export default AIInsightsCard;
