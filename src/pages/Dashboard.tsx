import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Clock,
  Target,
  TrendingUp,
  DollarSign,
  TrendingDown,
  PiggyBank,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import AppLayout from "@/components/AppLayout";
import StatsCard from "@/components/StatsCard";
import { useTodos } from "@/hooks/useTodos";
import { useFinance } from "@/hooks/useFinance";

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

const Dashboard = () => {
  const { getMonthlyStats: getTodoStats } = useTodos();
  const { getMonthlyStats: getFinanceStats, getExpensesByCategory, getMonthlyTrend } =
    useFinance();

  const currentMonth = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const todoStats = getTodoStats(currentMonth);
  const financeStats = getFinanceStats(currentMonth);
  const expensesByCategory = getExpensesByCategory(currentMonth);
  const monthlyTrend = getMonthlyTrend(6);

  // Build productivity chart data (last 6 months)
  const productivityData = useMemo(() => {
    const result = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const stats = getTodoStats(month);
      result.push({
        month: d.toLocaleDateString("en-US", { month: "short" }),
        completed: stats.completed,
        pending: stats.pending,
      });
    }
    return result;
  }, [getTodoStats]);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Your monthly overview at a glance
          </p>
        </motion.div>

        {/* Todo Stats */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            Task Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Tasks"
              value={todoStats.total}
              icon={<Target className="h-5 w-5" />}
              variant="default"
            />
            <StatsCard
              title="Completed"
              value={todoStats.completed}
              icon={<CheckSquare className="h-5 w-5" />}
              variant="success"
            />
            <StatsCard
              title="Pending"
              value={todoStats.pending}
              icon={<Clock className="h-5 w-5" />}
              variant="accent"
            />
            <StatsCard
              title="Productivity"
              value={`${todoStats.completionRate}%`}
              icon={<TrendingUp className="h-5 w-5" />}
              variant="primary"
            />
          </div>
        </div>

        {/* Finance Stats */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Finance Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Income"
              value={`$${financeStats.income.toLocaleString()}`}
              icon={<DollarSign className="h-5 w-5" />}
              variant="success"
            />
            <StatsCard
              title="Expenses"
              value={`$${financeStats.expenses.toLocaleString()}`}
              icon={<TrendingDown className="h-5 w-5" />}
              variant="destructive"
            />
            <StatsCard
              title="Savings"
              value={`$${financeStats.savings.toLocaleString()}`}
              icon={<PiggyBank className="h-5 w-5" />}
              variant="primary"
            />
            <StatsCard
              title="Balance"
              value={`$${financeStats.balance.toLocaleString()}`}
              icon={<BarChart3 className="h-5 w-5" />}
              variant={financeStats.balance >= 0 ? "success" : "destructive"}
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Productivity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-base font-semibold mb-6">Task Productivity</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={productivityData}>
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
                />
                <Bar dataKey="completed" fill="hsl(168, 80%, 42%)" radius={[6, 6, 0, 0]} name="Completed" />
                <Bar dataKey="pending" fill="hsl(38, 92%, 50%)" radius={[6, 6, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Expense Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-base font-semibold mb-6">Expenses by Category</h3>
            {expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {expensesByCategory.map((_, i) => (
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
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[260px] text-muted-foreground text-sm">
                No expense data this month
              </div>
            )}
            {expensesByCategory.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {expensesByCategory.map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    <span className="text-muted-foreground">{cat.name}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Monthly Finance Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-6 lg:col-span-2"
          >
            <h3 className="text-base font-semibold mb-6">Financial Trend (6 Months)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyTrend}>
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
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="hsl(152, 69%, 45%)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="hsl(0, 84%, 60%)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Expenses"
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="hsl(200, 70%, 55%)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Savings"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
