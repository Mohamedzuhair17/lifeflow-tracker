import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: "up" | "down" | "neutral";
  variant?: "default" | "primary" | "accent" | "success" | "destructive";
}

const variantStyles = {
  default: "glass-card",
  primary: "glass-card border-primary/20 glow-primary",
  accent: "glass-card border-accent/20 glow-accent",
  success: "glass-card border-success/20",
  destructive: "glass-card border-destructive/20",
};

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  destructive: "bg-destructive/10 text-destructive",
};

const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
}: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`${variantStyles[variant]} rounded-xl p-6`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div
          className={`${iconVariantStyles[variant]} rounded-lg p-3`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
