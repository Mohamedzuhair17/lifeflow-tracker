import { useState, useEffect, useCallback } from "react";
import { Todo, Priority, TodoStatus } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export const useTodos = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("lifetrack_todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  // Sync from Supabase on mount/auth change
  useEffect(() => {
    if (!user) return;

    const fetchTodos = async () => {
      setLoading(true);
      console.log("Fetching todos from Supabase for user:", user.id);

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase fetch error:", error);
        toast.error("Failed to load todos from cloud: " + error.message);
      } else if (data) {
        console.log("Fetched todos from Supabase:", data.length, "items");
        const mappedTodos: Todo[] = data.map((t) => ({
          id: t.id,
          title: t.title,
          priority: t.priority as Priority,
          status: t.status as TodoStatus,
          date: t.date,
          isDaily: t.is_daily,
          createdAt: t.created_at,
        }));
        setTodos(mappedTodos);
        localStorage.setItem("lifetrack_todos", JSON.stringify(mappedTodos));
      }
      setLoading(false);
    };

    fetchTodos();
  }, [user]);

  // Persistence to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem("lifetrack_todos", JSON.stringify(todos));
    }
  }, [todos, user]);

  const addTodo = useCallback(
    async (title: string, priority: Priority, date: string, isDaily: boolean = false) => {
      const id = crypto.randomUUID();
      const newTodo: Todo = {
        id,
        title: title.trim(),
        priority,
        status: "pending",
        date,
        isDaily,
        createdAt: new Date().toISOString(),
      };

      setTodos((prev) => [newTodo, ...prev]);

      if (user) {
        const { error } = await supabase.from("todos").insert({
          id,
          user_id: user.id,
          title: newTodo.title,
          priority: newTodo.priority,
          status: newTodo.status,
          date: newTodo.date,
          is_daily: newTodo.isDaily,
        });
        if (error) toast.error("Cloud sync failed: " + error.message);
      }
    },
    [user]
  );

  const toggleTodo = useCallback(
    async (id: string) => {
      let newStatus: TodoStatus = "pending";
      let updatedTodos: Todo[] = [];

      setTodos((prev) => {
        updatedTodos = prev.map((t) => {
          if (t.id === id) {
            newStatus = t.status === "completed" ? "pending" : "completed";
            return { ...t, status: newStatus };
          }
          return t;
        });
        return updatedTodos;
      });

      // Persist to localStorage immediately
      localStorage.setItem("lifetrack_todos", JSON.stringify(updatedTodos));

      if (user) {
        console.log(`Updating todo ${id} to status: ${newStatus} for user: ${user.id}`);

        const { error, data } = await supabase
          .from("todos")
          .update({ status: newStatus })
          .eq("id", id)
          .eq("user_id", user.id)
          .select();

        if (error) {
          console.error("Toggle todo error:", error);
          toast.error("Failed to sync: " + error.message);
        } else {
          console.log("Successfully updated todo in Supabase:", data);
          toast.success(newStatus === "completed" ? "Task completed! 🎉" : "Task reopened");
        }
      } else {
        console.warn("No user found, only saving locally");
        toast.success(newStatus === "completed" ? "Task completed! 🎉" : "Task reopened");
      }
    },
    [user]
  );

  const deleteTodo = useCallback(async (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));

    if (user) {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) toast.error("Cloud sync failed: " + error.message);
    }
  }, [user]);

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

  const getDailyRitualsStats = useCallback(() => {
    const daily = todos.filter((t) => t.isDaily);
    const completed = daily.filter((t) => t.status === "completed").length;
    return {
      total: daily.length,
      completed,
      pending: daily.length - completed,
      completionRate: daily.length > 0 ? Math.round((completed / daily.length) * 100) : 0,
    };
  }, [todos]);

  const getGamificationStats = useCallback(() => {
    const completedTodos = todos.filter((t) => t.status === "completed");

    // XP Logic: 10 XP per normal task, 20 XP per daily ritual
    const totalXP = completedTodos.reduce((acc, t) => acc + (t.isDaily ? 20 : 10), 0);
    const level = Math.floor(totalXP / 100) + 1;
    const progressToNextLevel = totalXP % 100;

    // Streak Logic: Consecutive days with at least one daily ritual completed
    const dailyCompletions = todos
      .filter((t) => t.isDaily && t.status === "completed")
      .map((t) => t.date)
      .sort();

    const uniqueDates = Array.from(new Set(dailyCompletions));
    let currentStreak = 0;
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    if (uniqueDates.length > 0) {
      const lastDate = uniqueDates[uniqueDates.length - 1];
      if (lastDate === today || lastDate === yesterday) {
        currentStreak = 1;
        for (let i = uniqueDates.length - 2; i >= 0; i--) {
          const d1 = new Date(uniqueDates[i + 1]);
          const d2 = new Date(uniqueDates[i]);
          const diff = (d1.getTime() - d2.getTime()) / (1000 * 3600 * 24);
          if (diff === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    return {
      totalXP,
      level,
      progressToNextLevel,
      currentStreak,
      totalCompleted: completedTodos.length
    };
  }, [todos]);

  return {
    todos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
    getFilteredTodos,
    getMonthlyStats,
    getDailyRitualsStats,
    getGamificationStats,
  };
};
