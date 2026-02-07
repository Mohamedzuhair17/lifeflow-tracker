import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Repeat } from "lucide-react";
import { Priority } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface TodoFormProps {
  onAdd: (title: string, priority: Priority, date: string, isDaily?: boolean) => void;
}

const TodoForm = ({ onAdd }: TodoFormProps) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isDaily, setIsDaily] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    onAdd(title, priority, date, isDaily);
    setTitle("");
    setIsDaily(false);
    toast.success(isDaily ? "Daily task created!" : "Task added!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-6 shadow-xl border-white/5"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Plus className="h-5 w-5 text-primary" />
        New Task
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-muted-foreground mb-1.5 block">Task Title</Label>
          <Input
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="bg-background/50"
          />
        </div>

        <div>
          <Label className="text-muted-foreground mb-1.5 block">Priority</Label>
          <div className="flex gap-2">
            {(["low", "medium", "high"] as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all duration-200 border ${priority === p
                  ? p === "low"
                    ? "bg-info/10 text-info border-info/30"
                    : p === "medium"
                      ? "bg-warning/10 text-warning border-warning/30"
                      : "bg-destructive/10 text-destructive border-destructive/30"
                  : "text-muted-foreground hover:bg-muted border-transparent"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-white/5 transition-all">
          <div className="flex items-center gap-2">
            <Repeat className={`h-4 w-4 ${isDaily ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
            <div className="space-y-0.5">
              <Label htmlFor="daily-toggle" className="text-sm font-medium">Daily Task</Label>
              <p className="text-[10px] text-muted-foreground">Repeats every single day</p>
            </div>
          </div>
          <Switch
            id="daily-toggle"
            checked={isDaily}
            onCheckedChange={setIsDaily}
          />
        </div>

        {!isDaily && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Label className="text-muted-foreground mb-1.5 block">Due Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-background/50"
            />
          </motion.div>
        )}

        <Button type="submit" className="w-full gap-2 h-11 text-base font-semibold">
          <Plus className="h-4 w-4" />
          Add {isDaily ? "Daily" : "Task"}
        </Button>
      </form>
    </motion.div>
  );
};

export default TodoForm;
