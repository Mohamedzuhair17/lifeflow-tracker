import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingDown,
  PiggyBank,
  BarChart3,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import AppLayout from "@/components/AppLayout";
import StatsCard from "@/components/StatsCard";
import FinanceForm from "@/components/FinanceForm";
import FinanceList from "@/components/FinanceList";
import { useFinance } from "@/hooks/useFinance";
import { FinanceType } from "@/lib/types";
import { Input } from "@/components/ui/input";

const CHART_COLORS = [
  "hsl(168, 80%, 42%)",
  "hsl(38, 92%, 50%)",
  "hsl(262, 60%, 60%)",
  "hsl(340, 75%, 60%)",
  "hsl(200, 70%, 55%)",
  "hsl(152, 69%, 45%)",
  "hsl(30, 80%, 55%)",
  "hsl(280, 65%, 55%)",
];

const Finance = () => {
  const {
    addEntry,
    deleteEntry,
    getMonthlyStats,
    getExpensesByCategory,
    getMonthlyTrend,
    getFilteredEntries,
  } = useFinance();

  const currentMonth = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [typeFilter, setTypeFilter] = useState<FinanceType | "all">("all");

  const stats = getMonthlyStats(selectedMonth);
  const expenses = getExpensesByCategory(selectedMonth);
  const trend = getMonthlyTrend(6);
  const filteredEntries = getFilteredEntries(
    selectedMonth || undefined,
    typeFilter === "all" ? undefined : typeFilter
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold">Finance</h1>
          <p className="text-muted-foreground mt-1">
            Track income, expenses, and savings
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Income"
            value={`$${stats.income.toLocaleString()}`}
            icon={<DollarSign className="h-5 w-5" />}
            variant="success"
          />
          <StatsCard
            title="Expenses"
            value={`$${stats.expenses.toLocaleString()}`}
            icon={<TrendingDown className="h-5 w-5" />}
            variant="destructive"
          />
          <StatsCard
            title="Savings"
            value={`$${stats.savings.toLocaleString()}`}
            icon={<PiggyBank className="h-5 w-5" />}
            variant="primary"
          />
          <StatsCard
            title="Balance"
            value={`$${stats.balance.toLocaleString()}`}
            icon={<BarChart3 className="h-5 w-5" />}
            variant={stats.balance >= 0 ? "success" : "destructive"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form + Charts */}
          <div className="space-y-6">
            <FinanceForm onAdd={addEntry} />

            {/* Pie Chart */}
            {expenses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl p-6"
              >
                <h3 className="text-base font-semibold mb-4">Expense Breakdown</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={expenses}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {expenses.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.75rem",
                        color: "hsl(var(--foreground))",
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-2">
                  {expenses.map((cat, i) => (
                    <div key={cat.name} className="flex items-center gap-1.5 text-xs">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className="text-muted-foreground">{cat.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: List + Bar Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Monthly Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-xl p-6"
            >
              <h3 className="text-base font-semibold mb-4">Monthly Overview</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.75rem",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`]}
                  />
                  <Bar dataKey="income" fill="hsl(152, 69%, 45%)" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expenses" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="Expenses" />
                  <Bar dataKey="savings" fill="hsl(200, 70%, 55%)" radius={[4, 4, 0, 0]} name="Savings" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Entry List */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-auto"
                />
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                  {(["all", "income", "expense", "saving"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                        typeFilter === t
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t === "saving" ? "savings" : t}
                    </button>
                  ))}
                </div>
              </div>
              <FinanceList entries={filteredEntries} onDelete={deleteEntry} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Finance;
