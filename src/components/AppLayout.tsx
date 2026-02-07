import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Wallet,
  User,
  Zap,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const navItems = [
  { path: "/dashboard", label: "Home", icon: LayoutDashboard },
  { path: "/todos", label: "Todos", icon: CheckSquare },
  { path: "/finance", label: "Finance", icon: Wallet },
  { path: "/profile", label: "Me", icon: User },
];

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (user && !profile.nickname && location.pathname !== "/onboarding") {
      navigate("/onboarding", { replace: true });
    }
  }, [profile.nickname, user, authLoading, profileLoading, navigate, location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="liquid-metal-bg" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute w-24 h-24 rounded-full border-2 border-primary/20 animate-ping opacity-20" />
          <div className="absolute w-16 h-16 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <img src="/logo.png" alt="Loading" className="h-8 w-8 object-contain relative z-10" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background relative selection:bg-primary/30 text-foreground overflow-hidden">
      {/* Obsidian Background */}
      <div className="liquid-metal-bg" />

      {/* Ambient Energy Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 100%), linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, .05) 25%, rgba(0, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .05) 75%, rgba(0, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, .05) 25%, rgba(0, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .05) 75%, rgba(0, 255, 255, .05) 76%, transparent 77%, transparent)',
        backgroundSize: '50px 50px'
      }} />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 border-r border-white/5 bg-black/40 backdrop-blur-xl z-30 shadow-2xl">
        <div className="flex h-20 items-center gap-3 px-8 border-b border-white/5 relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="relative z-10 p-2 bg-primary/10 rounded-lg border border-primary/20">
            <img src="/logo.png" alt="Focus Logo" className="h-6 w-6 object-contain" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Focus</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group ${isActive
                  ? "text-white shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)]"
                  : "text-muted-foreground hover:text-white"
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                  />
                )}
                <item.icon className={`h-5 w-5 relative z-10 transition-colors ${isActive ? "text-primary drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]" : "group-hover:text-primary"}`} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/60 backdrop-blur-xl border-b border-white/10 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Focus Logo" className="h-6 w-6 object-contain" />
          <span className="text-lg font-bold">Focus</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-30 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative w-64 h-full bg-[#050510] border-r border-white/10 pt-20 px-4 flex flex-col shadow-2xl">
              <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                        ? "bg-primary/10 text-white border border-primary/20 shadow-[0_0_15px_-5px_hsl(var(--primary)/0.5)]"
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                        }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="pb-8 pt-4 border-t border-white/10 mt-auto">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:pl-72 pt-16 lg:pt-0 min-h-screen relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="min-h-full"
          >
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AppLayout;
