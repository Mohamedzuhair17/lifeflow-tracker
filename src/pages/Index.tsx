import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  CheckSquare,
  Wallet,
  BarChart3,
  Zap,
  ArrowRight,
  Shield,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: CheckSquare,
    title: "Smart Todos",
    description:
      "Create, prioritize, and track tasks with monthly productivity analytics.",
  },
  {
    icon: Wallet,
    title: "Finance Tracker",
    description:
      "Monitor income, expenses, and savings with categorized entries and charts.",
  },
  {
    icon: BarChart3,
    title: "Monthly Analytics",
    description:
      "Visual dashboards with charts to track your productivity and spending trends.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your data is securely stored in the cloud with user authentication and encryption.",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description:
      "Fully responsive design that works beautifully on any screen size.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "See how your habits evolve month over month with trend analysis.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

import { useAuth } from "@/hooks/useAuth";

const LandingPage = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Focus Logo" className="h-7 w-7 object-contain" />
            <span className="text-xl font-bold tracking-tight">Focus</span>
          </div>
          <Link
            to={user ? "/dashboard" : "/auth"}
            className={cn(buttonVariants({ size: "sm" }), "gap-2")}
          >
            {user ? "Dashboard" : "Get Started"} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-50 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20"
            >
              <img src="/logo.png" alt="Logo" className="h-4 w-4" />
              All-in-One Personal Management
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              Track Your Life.{" "}
              <span className="text-gradient">One App.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Manage your daily todos, track monthly productivity, and take
              control of your personal finances — all in one beautiful
              dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-20">
              <Link
                to={user ? "/dashboard" : "/auth"}
                className={cn(buttonVariants({ size: "lg" }), "gap-2 text-base px-8")}
              >
                {user ? "Go to Dashboard" : "Start Tracking"} <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "text-base px-8")}
              >
                See Features
              </a>
            </div>
          </motion.div>
        </div>

        {/* Decorative glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px] animate-pulse_glow pointer-events-none" />
      </section>

      {/* Features */}
      <section id="features" className="py-24 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A powerful suite of tools designed to help you stay organized,
              productive, and financially aware.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-12 sm:p-16 glow-primary"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Take Control?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Start tracking your tasks, finances, and productivity today.
              Create your free account in seconds.
            </p>
            <Link
              to={user ? "/dashboard" : "/auth"}
              className={cn(buttonVariants({ size: "lg" }), "gap-2 text-base px-8")}
            >
              {user ? "Explore your Dashboard" : "Launch Focus"} <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Focus Logo" className="h-5 w-5 object-contain" />
            <span className="font-semibold">Focus</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Focus. Your data, your control.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
