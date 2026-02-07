import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import TodoForm from "@/components/TodoForm";
import TodoCard from "@/components/TodoCard";
import { useTodos } from "@/hooks/useTodos";
import { TodoStatus } from "@/lib/types";
import { Input } from "@/components/ui/input";

const Todos = () => {
  const { addTodo, toggleTodo, deleteTodo, getFilteredTodos } = useTodos();
  const [statusFilter, setStatusFilter] = useState<TodoStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const currentMonth = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const filteredTodos = useMemo(() => {
    let tasks = getFilteredTodos(
      selectedMonth || undefined,
      statusFilter === "all" ? undefined : statusFilter
    );
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      tasks = tasks.filter((t) => t.title.toLowerCase().includes(q));
    }
    return tasks;
  }, [getFilteredTodos, selectedMonth, statusFilter, searchQuery]);

  const dailyTodos = useMemo(() => {
    return filteredTodos.filter(t => t.isDaily);
  }, [filteredTodos]);

  const regularTodos = useMemo(() => {
    return filteredTodos.filter(t => !t.isDaily);
  }, [filteredTodos]);

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold tracking-tight">My Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium opacity-80">
            Keep track of what you need to do.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-1 space-y-6">
            <TodoForm onAdd={addTodo} />

            {/* Quick Stats Mini-card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-xl p-6 bg-primary/5 border-primary/10"
            >
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold">{dailyTodos.length}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Daily Habits</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{regularTodos.length}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Remaining</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center"
            >
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter your focus..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-white/5"
                />
              </div>
              <div className="flex gap-2 shrink-0">
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-auto bg-background/50 border-white/5"
                />
                <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border border-white/5">
                  {(["all", "pending", "completed"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${statusFilter === s
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Daily Rituals Section */}
            {dailyTodos.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Habits</h3>
                </div>
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {dailyTodos.map((todo) => (
                      <TodoCard
                        key={todo.id}
                        todo={todo}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Regular Tasks Section */}
            <div className="space-y-4">
              {(dailyTodos.length > 0 && regularTodos.length > 0) && (
                <div className="flex items-center gap-2 px-1 pt-2">
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">To-do</h3>
                </div>
              )}
              <div className="space-y-3">
                <AnimatePresence mode="popLayout" initial={false}>
                  {regularTodos.length > 0 ? (
                    regularTodos.map((todo) => (
                      <TodoCard
                        key={todo.id}
                        todo={todo}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                      />
                    ))
                  ) : dailyTodos.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-24 glass-card rounded-2xl border-dashed border-white/10"
                    >
                      <Filter className="h-12 w-12 mx-auto mb-4 opacity-10" />
                      <p className="text-xl font-medium text-muted-foreground">All clear!</p>
                      <p className="text-sm text-muted-foreground/60 mt-1">
                        No tasks match your current view.
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Todos;
