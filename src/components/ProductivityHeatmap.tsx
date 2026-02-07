import { useMemo } from "react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HeatmapProps {
    data: { date: string; count: number }[];
}

const ProductivityHeatmap = ({ data }: HeatmapProps) => {
    // Generate last 30 days
    const last30Days = useMemo(() => {
        const days = [];
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
            const dateStr = d.toISOString().split("T")[0];
            const match = data.find(d => d.date === dateStr);
            days.push({
                date: dateStr,
                displayDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                count: match ? match.count : 0
            });
        }
        return days;
    }, [data]);

    const hasAnyActivity = useMemo(() => {
        return last30Days.some(day => day.count > 0);
    }, [last30Days]);

    const getColor = (count: number) => {
        if (count === 0) return "bg-white/10 border border-white/5";
        if (count === 1) return "bg-emerald-500/30 border border-emerald-500/20";
        if (count === 2) return "bg-emerald-500/50 border border-emerald-500/30";
        if (count === 3) return "bg-emerald-500/70 border border-emerald-500/40";
        return "bg-emerald-500 border border-emerald-500/50";
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Activity Heatmap</h3>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-sm bg-white/10 border border-white/5" />
                        <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/30 border border-emerald-500/20" />
                        <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/70 border border-emerald-500/40" />
                        <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 border border-emerald-500/50" />
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="grid grid-cols-10 gap-2">
                <TooltipProvider>
                    {last30Days.map((day, i) => (
                        <Tooltip key={day.date}>
                            <TooltipTrigger asChild>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.01 }}
                                    className={`aspect-square rounded-md ${getColor(day.count)} cursor-pointer transition-all hover:scale-110 hover:ring-2 hover:ring-emerald-500/50`}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs font-medium">{day.displayDate}</p>
                                <p className="text-[10px] text-muted-foreground">
                                    {day.count === 0 ? "No tasks" : `${day.count} task${day.count > 1 ? 's' : ''}`} completed
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </div>

            {!hasAnyActivity && (
                <div className="text-center py-2">
                    <p className="text-xs text-muted-foreground italic">
                        Complete tasks to see your activity pattern! 📊
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductivityHeatmap;
