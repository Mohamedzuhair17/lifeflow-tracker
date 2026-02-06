import { Todo } from "@/lib/types";
import { motion } from "framer-motion";
import { Trash2, Check, Clock, AlertTriangle, AlertCircle, Circle } from "lucide-react";

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className={`glass-card rounded-xl p-4 transition-all duration-200 ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(todo.id)}
          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            isCompleted
              ? "bg-primary border-primary"
              : "border-muted-foreground/30 hover:border-primary"
          }`}
        >
          {isCompleted && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`font-medium ${
              isCompleted ? "line-through text-muted-foreground" : ""
            }`}
          >
            {todo.title}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span
              className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border ${priority.className}`}
            >
              <PriorityIcon className="h-3 w-3" />
              {priority.label}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(todo.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
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
