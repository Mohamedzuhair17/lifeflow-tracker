import { motion } from "framer-motion";
import { User, LogOut, Zap, Database, Shield } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Profile = () => {
  const handleClearData = () => {
    if (window.confirm("Are you sure? This will delete all your local data.")) {
      localStorage.removeItem("lifetrack_todos");
      localStorage.removeItem("lifetrack_finance");
      toast.success("All data cleared. Refresh to see changes.");
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = {
      todos: JSON.parse(localStorage.getItem("lifetrack_todos") || "[]"),
      finance: JSON.parse(localStorage.getItem("lifetrack_finance") || "[]"),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lifetrack-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account and data</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">LifeTrack User</h2>
              <p className="text-sm text-muted-foreground">
                Local session — no account required
              </p>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Local Storage</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              All data is stored locally in your browser. No server, no tracking.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Privacy First</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your data never leaves your device. Complete privacy by design.
            </p>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={handleExportData}
          >
            <Zap className="h-4 w-4" />
            Export Data (JSON)
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
            onClick={handleClearData}
          >
            <LogOut className="h-4 w-4" />
            Clear All Data
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Profile;
