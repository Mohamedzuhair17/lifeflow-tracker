import { motion } from "framer-motion";
import { User, LogOut, Zap, Database, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleExportData = () => {
    toast.info("Export is available via your cloud dashboard.");
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account</p>
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
                {user?.email ?? "Not signed in"}
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
              <h3 className="font-semibold">Cloud Storage</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              All data is securely stored in the cloud and synced across sessions.
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
              <h3 className="font-semibold">Secure & Private</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your data is protected with authentication and row-level security.
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
            Export Data
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Profile;
