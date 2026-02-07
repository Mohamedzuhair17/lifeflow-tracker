import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Clock,
  Target,
  TrendingUp,
  BarChart3,
  Star,
  Flame,
  Award,
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
  AreaChart,
  Area,
} from "recharts";
import AppLayout from "@/components/AppLayout";
import StatsCard from "@/components/StatsCard";
import PremiumCard from "@/components/PremiumCard";
import { useTodos } from "@/hooks/useTodos";
import { useFinance } from "@/hooks/useFinance";
import { useProfile } from "@/hooks/useProfile";
import AIInsightsCard from "@/components/AIInsightsCard";


const CHART_COLORS = [
  "hsl(0, 0%, 90%)", // White/Silver
  "hsl(0, 0%, 40%)", // Medium Grey
  "hsl(0, 0%, 20%)", // Dark Grey
  "hsl(0, 0%, 60%)", // Light Grey
  "hsl(220, 10%, 80%)", // Cool Silver
  "hsl(0, 0%, 10%)", // Almost Black
];

const Dashboard = () => {
  const { getMonthlyStats: getTodoStats, getDailyRitualsStats, todos, getGamificationStats } = useTodos();
  const { getExpensesByCategory, getMonthlyTrend } =
    useFinance();
  const { profile } = useProfile();

  const gamification = getGamificationStats();

  const currentMonth = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const todoStats = getTodoStats(currentMonth);
  const dailyStats = getDailyRitualsStats();
  const expenseData = getExpensesByCategory(currentMonth);
  const trendData = getMonthlyTrend(6);



  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Top Header & Level Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
              Hi, <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">{profile.nickname || "there"}</span>
              <motion.span
                animate={{ rotate: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 5 }}
                className="inline-block origin-bottom-right"
              >
                👋
              </motion.span>
            </h1>
            <p className="text-muted-foreground font-medium opacity-80 max-w-md">
              {profile.goal ? `Targeting: ${profile.goal}` : "Let's focus on what matters today."}
            </p>
          </motion.div>

          {/* Gamification Level Section */}
          <PremiumCard className="flex items-center gap-6 p-4 md:px-6 md:py-4 glow-primary" glowColor="rgba(255,255,255,0.1)">
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 tracking-wider">Focus Score</span>
                <span className="text-xl font-black text-white italic">Lvl {gamification.level}</span>
              </div>
              <div className="w-40 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${gamification.progressToNextLevel}%` }}
                  transition={{ duration: 1, ease: "circOut" }}
                  className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                />
              </div>
            </div>
            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
              <Star className="h-5 w-5 text-white" fill="currentColor" />
            </div>
          </PremiumCard>
        </div>

        {/* AI Insights Section */}
        <AIInsightsCard />

        {/* Global Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Tasks Done"
            value={todoStats.completed.toString()}
            description={`${todoStats.completionRate}% Complete`}
            icon={CheckSquare}
            trend="+15%"
            delay={1}
            color="hsl(0, 0%, 90%)"
          />
          <StatsCard
            title="Daily Goals"
            value={`${dailyStats.completed}/${dailyStats.total}`}
            description="Today's progress"
            icon={Clock}
            delay={2}
            color="hsl(0, 0%, 60%)"
          />
          <StatsCard
            title="Day Streak"
            value={`${gamification.currentStreak} Days`}
            description="Keep it up!"
            icon={Flame}
            delay={3}
            color="hsl(0, 0%, 80%)"
          />
          <StatsCard
            title="Points"
            value={gamification.totalXP.toLocaleString()}
            description="Your progress"
            icon={Award}
            delay={4}
            color="hsl(0, 0%, 50%)"
          />
        </div>

        {/* Data Visualization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <PremiumCard className="p-8 h-full" delay={5}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2.5 rounded-xl text-white border border-white/10">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Monthly Overview</h2>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold opacity-70">Income & Spending</p>
                  </div>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} barGap={8}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fff" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} dy={10} fontFamily="Inter" fontWeight={300} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} dx={-10} fontFamily="Inter" fontWeight={300} />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-[#050505] border border-white/10 rounded-xl p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">{label}</p>
                              <div className="space-y-2">
                                {payload.map((entry: any) => {
                                  const color = entry.name === 'Income' ? 'hsl(var(--primary))' :
                                    entry.name === 'Expenses' ? '#fff' :
                                      entry.name === 'Savings' ? '#22c55e' : '#fff';
                                  return (
                                    <div key={entry.name} className="flex items-center gap-3 min-w-[120px]">
                                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: color }}>
                                        {entry.name}
                                      </span>
                                      <span className="text-sm font-bold ml-auto text-white numbers-font">
                                        {entry.value}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="income" name="Income" fill="url(#colorIncome)" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="expenses" name="Expenses" fill="url(#colorExpense)" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="savings" name="Savings" fill="url(#colorSavings)" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </PremiumCard>
          </div>
        </div>

        {/* FEATURE 6: Advanced Financial Forecasting */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PremiumCard className="p-8 group" delay={7}>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2.5 rounded-xl text-white border border-white/10">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Spending Trends</h2>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest opacity-60">Last 6 Months</p>
                </div>
              </div>
            </div>

            <div className="h-[250px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorIncomeArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpenseArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#888" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#888" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} dy={10} fontFamily="Inter" />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} dx={-10} fontFamily="Inter" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#050505",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px -10px rgba(0,0,0,0.8)",
                      color: "#fff"
                    }}
                    itemStyle={{ color: "#fff", fontFamily: "Inter" }}
                    labelStyle={{ color: "hsl(var(--primary))", marginBottom: "8px", fontFamily: "Inter", fontWeight: 600, textTransform: "uppercase", fontSize: "10px", letterSpacing: "1px" }}
                  />
                  <Area type="monotone" dataKey="income" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorIncomeArea)" />
                  <Area type="monotone" dataKey="expenses" stroke="#888" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenseArea)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </PremiumCard>

          <PremiumCard className="p-8" delay={8}>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/10 p-2.5 rounded-xl text-white border border-white/10">
                <Target className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">Spending Breakdown</h2>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {expenseData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                        style={{ filter: "drop-shadow(0px 0px 4px rgba(255,255,255,0.1))" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#09090b",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                      color: "#fff"
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </PremiumCard>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
