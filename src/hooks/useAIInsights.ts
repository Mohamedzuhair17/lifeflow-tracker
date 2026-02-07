import { useMemo } from "react";
import { useTodos } from "./useTodos";
import { useFinance } from "./useFinance";
import { useProfile } from "./useProfile";

export interface Insight {
    type: "success" | "warning" | "info" | "tip";
    title: string;
    message: string;
    action?: string;
}

export const useAIInsights = () => {
    const { getMonthlyStats: getTodoStats, getGamificationStats } = useTodos();
    const { getMonthlyTrend, getExpensesByCategory } = useFinance();
    const { profile } = useProfile();

    const insights = useMemo(() => {
        const list: Insight[] = [];
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, "0")}`;

        const todoStats = getTodoStats(currentMonth);
        const trend = getMonthlyTrend(2);
        const gamification = getGamificationStats();

        // 1. Welcome / Motivational Insight
        if (profile.nickname) {
            list.push({
                type: "info",
                title: `Welcome back, ${profile.nickname}!`,
                message: profile.goal
                    ? `You're working towards: "${profile.goal}". Let's make progress today.`
                    : "You haven't set a primary goal yet. Setting a target increases completion by 40%!",
                action: profile.goal ? undefined : "/profile"
            });
        }

        // 2. Productivity Insight
        if (todoStats.completionRate > 80) {
            list.push({
                type: "success",
                title: "Productivity Powerhouse",
                message: `You've completed ${todoStats.completionRate}% of your tasks this month. Your focus is elite!`,
            });
        } else if (todoStats.completionRate < 30 && todoStats.total > 5) {
            list.push({
                type: "warning",
                title: "Falling Behind?",
                message: "Your task completion rate is currently below 30%. Try breaking your goals into smaller parts.",
            });
        }

        // 3. Financial Trend
        if (trend.length >= 2) {
            const current = trend[trend.length - 1];
            const previous = trend[trend.length - 2];

            if (current.expenses < previous.expenses * 0.9) {
                list.push({
                    type: "success",
                    title: "Thrifty Habit!",
                    message: "Impressive savings! You've spent less than last month. Keep that momentum going.",
                });
            }
        }

        // 4. Ritual Streak
        if (gamification.currentStreak >= 3) {
            list.push({
                type: "success",
                title: `${gamification.currentStreak} Day Streak!`,
                message: "You're building consistent daily rituals. Consistency is the secret to long-term success.",
            });
        } else if (gamification.totalCompleted > 0 && gamification.currentStreak === 0) {
            list.push({
                type: "tip",
                title: "Restart the Streak",
                message: "You've missed your daily rituals recently. Starting again today is all that matters.",
            });
        }

        // 5. Category Analysis
        const categories = getExpensesByCategory(currentMonth);
        const topCategory = categories.length > 0 ? categories.sort((a, b) => b.value - a.value)[0] : null;

        if (topCategory && topCategory.value > 100) {
            list.push({
                type: "info",
                title: "Spending Focus",
                message: `Most of your spending this month is on "${topCategory.name}". Is this aligned with your goals?`,
            });
        }

        // 6. Default insight for new users
        if (list.length === 0) {
            list.push({
                type: "tip",
                title: "Welcome to Focus!",
                message: "Start by adding your first task or daily ritual. Consistency is the foundation of success.",
                action: "/todos"
            });
        }

        return list;
    }, [getTodoStats, getGamificationStats, getMonthlyTrend, getExpensesByCategory, profile]);

    return { insights };
};
