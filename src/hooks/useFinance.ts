import { useState, useEffect, useCallback } from "react";
import { FinanceEntry, FinanceType } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const useFinance = () => {
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEntries = useCallback(async () => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("finance_entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching finance entries:", error);
      toast.error("Failed to load finance data");
    } else {
      setEntries(
        (data || []).map((e) => ({
          id: e.id,
          type: e.type as FinanceType,
          category: e.category as FinanceEntry["category"],
          amount: Number(e.amount),
          description: e.description,
          date: e.date,
          createdAt: e.created_at,
        }))
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const addEntry = useCallback(
    async (
      type: FinanceType,
      category: string,
      amount: number,
      description: string,
      date: string
    ) => {
      if (!user) return;
      const { data, error } = await supabase
        .from("finance_entries")
        .insert({
          user_id: user.id,
          type,
          category,
          amount,
          description: description.trim(),
          date,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding entry:", error);
        toast.error("Failed to add entry");
      } else if (data) {
        setEntries((prev) => [
          {
            id: data.id,
            type: data.type as FinanceType,
            category: data.category as FinanceEntry["category"],
            amount: Number(data.amount),
            description: data.description,
            date: data.date,
            createdAt: data.created_at,
          },
          ...prev,
        ]);
      }
    },
    [user]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      setEntries((prev) => prev.filter((e) => e.id !== id));

      const { error } = await supabase
        .from("finance_entries")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting entry:", error);
        toast.error("Failed to delete entry");
        fetchEntries();
      }
    },
    [fetchEntries]
  );

  const getMonthlyStats = useCallback(
    (month: string) => {
      const monthEntries = entries.filter((e) => e.date.startsWith(month));
      const income = monthEntries
        .filter((e) => e.type === "income")
        .reduce((sum, e) => sum + e.amount, 0);
      const expenses = monthEntries
        .filter((e) => e.type === "expense")
        .reduce((sum, e) => sum + e.amount, 0);
      const savings = monthEntries
        .filter((e) => e.type === "saving")
        .reduce((sum, e) => sum + e.amount, 0);

      return {
        income,
        expenses,
        savings,
        balance: income - expenses - savings,
      };
    },
    [entries]
  );

  const getExpensesByCategory = useCallback(
    (month: string) => {
      const monthExpenses = entries.filter(
        (e) => e.type === "expense" && e.date.startsWith(month)
      );
      const categoryMap = new Map<string, number>();
      monthExpenses.forEach((e) => {
        categoryMap.set(
          e.category,
          (categoryMap.get(e.category) || 0) + e.amount
        );
      });
      return Array.from(categoryMap, ([name, value]) => ({ name, value }));
    },
    [entries]
  );

  const getMonthlyTrend = useCallback(
    (months: number = 6) => {
      const result = [];
      const now = new Date();
      for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const stats = getMonthlyStats(month);
        result.push({
          month: d.toLocaleDateString("en-US", { month: "short" }),
          income: stats.income,
          expenses: stats.expenses,
          savings: stats.savings,
        });
      }
      return result;
    },
    [getMonthlyStats]
  );

  const getFilteredEntries = useCallback(
    (month?: string, type?: FinanceType) => {
      return entries.filter((e) => {
        if (month && !e.date.startsWith(month)) return false;
        if (type && e.type !== type) return false;
        return true;
      });
    },
    [entries]
  );

  return {
    entries,
    loading,
    addEntry,
    deleteEntry,
    getMonthlyStats,
    getExpensesByCategory,
    getMonthlyTrend,
    getFilteredEntries,
  };
};
