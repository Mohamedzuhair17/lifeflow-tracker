import { useState, useEffect, useCallback } from "react";
import { FinanceEntry, FinanceType } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export const useFinance = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<FinanceEntry[]>(() => {
    const saved = localStorage.getItem("lifetrack_finance");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  // Sync from Supabase
  useEffect(() => {
    if (!user) return;

    const fetchFinance = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("finance_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (data) {
        const mapped: FinanceEntry[] = data.map((e) => ({
          id: e.id,
          type: e.type as FinanceType,
          category: e.category as FinanceEntry["category"],
          amount: e.amount,
          description: e.description,
          date: e.date,
          createdAt: e.created_at,
        }));
        setEntries(mapped);
        localStorage.setItem("lifetrack_finance", JSON.stringify(mapped));
      } else if (error) {
        toast.error("Failed to load finance data from cloud");
      }
      setLoading(false);
    };

    fetchFinance();
  }, [user]);

  // Local persistence fallback
  useEffect(() => {
    if (!user) {
      localStorage.setItem("lifetrack_finance", JSON.stringify(entries));
    }
  }, [entries, user]);

  const addEntry = useCallback(
    async (
      type: FinanceType,
      category: string,
      amount: number,
      description: string,
      date: string
    ) => {
      const id = crypto.randomUUID();
      const newEntry: FinanceEntry = {
        id,
        type,
        category: category as FinanceEntry["category"],
        amount,
        description: description.trim(),
        date,
        createdAt: new Date().toISOString(),
      };

      setEntries((prev) => [newEntry, ...prev]);

      if (user) {
        const { error } = await supabase.from("finance_entries").insert({
          id,
          user_id: user.id,
          type,
          category,
          amount,
          description: description.trim(),
          date,
        });
        if (error) toast.error("Cloud sync failed: " + error.message);
      }
    },
    [user]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      setEntries((prev) => prev.filter((e) => e.id !== id));

      if (user) {
        const { error } = await supabase
          .from("finance_entries")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);
        if (error) toast.error("Cloud sync failed: " + error.message);
      }
    },
    [user]
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
