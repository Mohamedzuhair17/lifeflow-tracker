import { useState } from "react";
import { FinanceType, EXPENSE_CATEGORIES } from "@/lib/types";
import { motion } from "framer-motion";
import { Plus, DollarSign, TrendingDown, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment", "Other Income"] as const;
const SAVING_CATEGORIES = ["Savings"] as const;

interface FinanceFormProps {
  onAdd: (
    type: FinanceType,
    category: string,
    amount: number,
    description: string,
    date: string
  ) => void;
}

const typeConfig = {
  income: {
    label: "Income",
    icon: DollarSign,
    color: "text-success",
    bgColor: "bg-success/10",
    categories: INCOME_CATEGORIES,
  },
  expense: {
    label: "Expense",
    icon: TrendingDown,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    categories: EXPENSE_CATEGORIES,
  },
  saving: {
    label: "Saving",
    icon: PiggyBank,
    color: "text-info",
    bgColor: "bg-info/10",
    categories: SAVING_CATEGORIES,
  },
};

const FinanceForm = ({ onAdd }: FinanceFormProps) => {
  const [type, setType] = useState<FinanceType>("income");
  const [category, setCategory] = useState<string>("Salary");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const config = typeConfig[type];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    onAdd(type, category, parsedAmount, description, date);
    setAmount("");
    setDescription("");
    toast.success(`${config.label} added successfully`);
  };

  const handleTypeChange = (newType: FinanceType) => {
    setType(newType);
    const cats = typeConfig[newType].categories;
    setCategory(cats[0]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Add Entry</h3>

      {/* Type Tabs */}
      <div className="flex gap-2 mb-5">
        {(Object.keys(typeConfig) as FinanceType[]).map((t) => {
          const tc = typeConfig[t];
          const Icon = tc.icon;
          const isActive = type === t;
          return (
            <button
              key={t}
              onClick={() => handleTypeChange(t)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? `${tc.bgColor} ${tc.color} border border-current/20`
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tc.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {config.categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
            Amount
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
            Description
          </label>
          <Input
            placeholder="Enter description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={100}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
            Date
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Add {config.label}
        </Button>
      </form>
    </motion.div>
  );
};

export default FinanceForm;
