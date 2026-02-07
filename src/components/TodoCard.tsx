import { Todo } from "@/lib/types";
import { motion } from "framer-motion";
import { Trash2, Check, Clock, AlertTriangle, AlertCircle, Circle, Repeat } from "lucide-react";

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityConfig = {
  low: {
    label: "Low",
    icon: Circle,
    className: "bg-info/10 text-info border-info/20",
  },
  medium: {
    label: "Medium",
    icon: AlertTriangle,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  high: {
    label: "High",
    icon: AlertCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const TodoCard = ({ todo, onToggle, onDelete }: TodoCardProps) => {
  const priority = priorityConfig[todo.priority];
  const PriorityIcon = priority.icon;
  const isCompleted = todo.status === "completed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className={`glass-card rounded-xl p-4 transition-all duration-200 border-white/5 ${isCompleted ? "opacity-40 grayscale-[0.5]" : "hover:border-primary/20 shadow-lg hover:shadow-primary/5"
        }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(todo.id)}
          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isCompleted
              ? "bg-primary border-primary shadow-lg shadow-primary/20"
              : "border-muted-foreground/30 hover:border-primary hover:scale-110"
            }`}
        >
          {isCompleted && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`font-semibold text-base tracking-tight ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"
              }`}
          >
            {todo.title}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span
              className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${priority.className}`}
            >
              <PriorityIcon className="h-2.5 w-2.5" />
              {priority.label}
            </span>

            {todo.isDaily ? (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                <Repeat className="h-2.5 w-2.5" />
                Daily Ritual
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                <Clock className="h-2.5 w-2.5" />
                {new Date(todo.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onDelete(todo.id)}
          className="flex-shrink-0 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default TodoCard;
