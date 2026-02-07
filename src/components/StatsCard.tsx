import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import PremiumCard from "./PremiumCard";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: string;
  color?: string;
  delay?: number;
}

const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color,
  delay = 0,
}: StatsCardProps) => {
  return (
    <PremiumCard
      className="p-6 transition-all duration-500 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)] group"
      glowColor={color || "hsl(var(--primary))"}
      delay={delay}
    >
      <div className="flex flex-col justify-between h-full relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-primary/5 p-2 rounded-lg border border-primary/10 group-hover:border-primary/30 transition-colors">
            <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-all backdrop-blur-sm",
              trend.startsWith("+")
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            )}>
              {trend.startsWith("+") ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trend}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-3xl font-light tracking-tight text-white group-hover:text-primary transition-colors duration-300 drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]">
            {value}
          </h3>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
            {title}
          </p>
          <p className="text-[10px] text-muted-foreground/60 font-light truncate">
            {description}
          </p>
        </div>
      </div>
    </PremiumCard>
  );
};

export default StatsCard;
