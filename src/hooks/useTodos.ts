import { useState, useEffect, useCallback } from "react";
import { Todo, Priority, TodoStatus } from "@/lib/types";

const STORAGE_KEY = "lifetrack_todos";

const loadTodos = (): Todo[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = useCallback(
    (title: string, priority: Priority, date: string) => {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title: title.trim(),
        priority,
        status: "pending",
        date,
        createdAt: new Date().toISOString(),
      };
      setTodos((prev) => [newTodo, ...prev]);
    },
    []
  );

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "completed" ? "pending" : "completed" }
          : t
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

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

  return { todos, addTodo, toggleTodo, deleteTodo, getFilteredTodos, getMonthlyStats };
};
