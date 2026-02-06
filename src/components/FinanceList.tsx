import { FinanceEntry } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, DollarSign, TrendingDown, PiggyBank } from "lucide-react";

interface FinanceListProps {
  entries: FinanceEntry[];
  onDelete: (id: string) => void;
}

const typeIcons = {
  income: { icon: DollarSign, color: "text-success", bg: "bg-success/10" },
  expense: { icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/10" },
  saving: { icon: PiggyBank, color: "text-info", bg: "bg-info/10" },
};

const FinanceList = ({ entries, onDelete }: FinanceListProps) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Wallet className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p>No entries yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {entries.map((entry) => {
          const config = typeIcons[entry.type];
          const Icon = config.icon;
          return (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="glass-card rounded-xl p-4 flex items-center gap-4"
            >
              <div className={`${config.bg} ${config.color} p-2.5 rounded-lg`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{entry.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{entry.category}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <span
                className={`font-semibold text-sm ${
                  entry.type === "income"
                    ? "text-success"
                    : entry.type === "expense"
                    ? "text-destructive"
                    : "text-info"
                }`}
              >
                {entry.type === "expense" ? "-" : "+"}$
                {entry.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              <button
                onClick={() => onDelete(entry.id)}
                className="flex-shrink-0 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// Fix missing import
import { Wallet } from "lucide-react";

export default FinanceList;
