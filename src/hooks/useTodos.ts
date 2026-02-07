import { useState, useEffect, useCallback } from "react";
import { Todo, Priority, TodoStatus } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch todos from database
  const fetchTodos = useCallback(async () => {
    if (!user) {
      setTodos([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching todos:", error);
      toast.error("Failed to load tasks");
    } else {
      setTodos(
        (data || []).map((t) => ({
          id: t.id,
          title: t.title,
          priority: t.priority as Priority,
          status: t.status as TodoStatus,
          date: t.date,
          createdAt: t.created_at,
        }))
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = useCallback(
    async (title: string, priority: Priority, date: string) => {
      if (!user) return;
      const { data, error } = await supabase
        .from("todos")
        .insert({
          user_id: user.id,
          title: title.trim(),
          priority,
          status: "pending",
          date,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding todo:", error);
        toast.error("Failed to add task");
      } else if (data) {
        setTodos((prev) => [
          {
            id: data.id,
            title: data.title,
            priority: data.priority as Priority,
            status: data.status as TodoStatus,
            date: data.date,
            createdAt: data.created_at,
          },
          ...prev,
        ]);
      }
    },
    [user]
  );

  const toggleTodo = useCallback(
    async (id: string) => {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;
      const newStatus = todo.status === "completed" ? "pending" : "completed";

      // Optimistic update
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );

      const { error } = await supabase
        .from("todos")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) {
        console.error("Error toggling todo:", error);
        // Revert
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: todo.status } : t))
        );
        toast.error("Failed to update task");
      }
    },
    [todos]
  );

  const deleteTodo = useCallback(async (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));

    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete task");
      fetchTodos(); // re-fetch on error
    }
  }, [fetchTodos]);

  const getFilteredTodos = useCallback(
    (month?: string, status?: TodoStatus) => {
      return todos.filter((t) => {
        if (month && !t.date.startsWith(month)) return false;
        if (status && t.status !== status) return false;
        return true;
      });
    },
    [todos]
  );

  const getMonthlyStats = useCallback(
    (month: string) => {
      const monthTodos = todos.filter((t) => t.date.startsWith(month));
      const total = monthTodos.length;
      const completed = monthTodos.filter((t) => t.status === "completed").length;
      return {
        total,
        completed,
        pending: total - completed,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    },
    [todos]
  );

  return {
    todos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
    getFilteredTodos,
    getMonthlyStats,
  };
};
