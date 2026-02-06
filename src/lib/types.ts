export type Priority = "low" | "medium" | "high";
export type TodoStatus = "pending" | "completed";
export type FinanceType = "income" | "expense" | "saving";

export const EXPENSE_CATEGORIES = [
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Entertainment",
  "Health",
  "Education",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface Todo {
  id: string;
  title: string;
  priority: Priority;
  status: TodoStatus;
  date: string; // ISO date string
  createdAt: string;
}

export interface FinanceEntry {
  id: string;
  type: FinanceType;
  category: ExpenseCategory | "Salary" | "Freelance" | "Investment" | "Savings" | "Other Income";
  amount: number;
  description: string;
  date: string; // ISO date string
  createdAt: string;
}

export interface MonthlyStats {
  month: string; // "YYYY-MM"
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
}
