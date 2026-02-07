import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingDown,
  PiggyBank,
  BarChart3,
  TrendingUp,
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
  "hsl(0, 0%, 80%)", // Light Silver
  "hsl(0, 0%, 60%)", // Medium Grey
  "hsl(0, 0%, 40%)", // Dark Grey
  "hsl(0, 0%, 20%)", // Charcoal
  "hsl(0, 0%, 90%)", // White Smoke
  "hsl(0, 0%, 50%)", // Mid Grey
  "hsl(0, 0%, 30%)", // Deep Grey
  "hsl(0, 0%, 70%)", // Pale Silver
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

  const stats = useMemo(() => getMonthlyStats(selectedMonth), [getMonthlyStats, selectedMonth]);
  const expenses = useMemo(() => getExpensesByCategory(selectedMonth), [getExpensesByCategory, selectedMonth]);
  const trend = useMemo(() => getMonthlyTrend(6), [getMonthlyTrend]);
  const filteredEntries = useMemo(() => getFilteredEntries(
    selectedMonth || undefined,
    typeFilter === "all" ? undefined : typeFilter
  ), [getFilteredEntries, selectedMonth, typeFilter]);

  return (
    <AppLayout>
      <div className="space-y-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              Finance <span className="text-primary">💰</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium opacity-80">
              Where it's coming from and where it's going.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-card/40 backdrop-blur-xl p-2 rounded-2xl border border-white/5 shadow-xl">
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none w-auto h-9 text-xs font-bold uppercase tracking-wider focus-visible:ring-0"
            />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Income"
            value={`$${stats.income.toLocaleString()}`}
            description="Money coming in this month"
            icon={DollarSign}
            color="hsl(0, 0%, 80%)"
          />
          <StatsCard
            title="Spending"
            value={`$${stats.expenses.toLocaleString()}`}
            description="What you've spent so far"
            icon={TrendingDown}
            color="hsl(0, 0%, 40%)"
          />
          <StatsCard
            title="Saved"
            value={`$${stats.savings.toLocaleString()}`}
            description="Money put away for later"
            icon={PiggyBank}
            color="hsl(0, 0%, 60%)"
          />
          <StatsCard
            title="Leftover"
            value={`$${stats.balance.toLocaleString()}`}
            description="Your current balance"
            icon={BarChart3}
            color={stats.balance >= 0 ? "hsl(0, 0%, 90%)" : "hsl(0, 0%, 30%)"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Actions and Category Breakdown */}
          <div className="space-y-8">
            <FinanceForm onAdd={addEntry} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-3xl p-8 bg-card/30 relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="bg-primary/20 p-2 rounded-xl text-primary">
                  <PieChart className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">Where it Goes</h3>
              </div>

              {expenses.length > 0 ? (
                <>
                  <div className="h-[250px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenses}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {expenses.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 17, 21, 0.95)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "16px",
                            backdropFilter: "blur(12px)",
                          }}
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6 relative z-10">
                    {expenses.map((cat, i) => (
                      <div key={cat.name} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                        />
                        <span className="text-[10px] font-black text-muted-foreground truncate uppercase tracking-tighter">
                          {cat.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-20 text-center text-muted-foreground border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-sm font-medium italic">Record an expense to see breakdown.</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Side: Trend and History */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2 rounded-xl text-primary">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold">Monthly Trends</h3>
                </div>
              </div>

              <div className="h-[320px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="rgba(255,255,255,0.3)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.3)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{
                        backgroundColor: "rgba(15, 17, 21, 0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "16px",
                        backdropFilter: "blur(12px)",
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`]}
                    />
                    <Bar dataKey="income" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={20} />
                    <Bar dataKey="expenses" fill="rgba(255,255,255,0.8)" radius={[6, 6, 0, 0]} barSize={20} />
                    <Bar dataKey="savings" fill="#22c55e" radius={[6, 6, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* History List Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/30 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-xl">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest">Recent History</h3>
                </div>
                <div className="flex items-center gap-1 bg-black/20 rounded-xl p-1 w-full sm:w-auto overflow-x-auto no-scrollbar">
                  {(["all", "income", "expense", "saving"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] whitespace-nowrap font-black uppercase tracking-widest transition-all ${typeFilter === t
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        }`}
                    >
                      {t === "saving" ? "savings" : t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-3xl overflow-hidden min-h-[400px]">
                <FinanceList entries={filteredEntries} onDelete={deleteEntry} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Finance;
