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
    let todos = getFilteredTodos(
      selectedMonth || undefined,
      statusFilter === "all" ? undefined : statusFilter
    );
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      todos = todos.filter((t) => t.title.toLowerCase().includes(q));
    }
    return todos;
  }, [getFilteredTodos, selectedMonth, statusFilter, searchQuery]);

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold">Todos</h1>
          <p className="text-muted-foreground mt-1">
            Manage your tasks and track productivity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-1">
            <TodoForm onAdd={addTodo} />
          </div>

          {/* Right: List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-auto"
                  />
                  <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                    {(["all", "pending", "completed"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                          statusFilter === s
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Todo List */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredTodos.length > 0 ? (
                  filteredTodos.map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 text-muted-foreground"
                  >
                    <Filter className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-lg">No tasks found</p>
                    <p className="text-sm mt-1">
                      Create a new task or adjust your filters
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Todos;
