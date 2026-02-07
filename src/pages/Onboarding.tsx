import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Quote, Target, Calendar, ArrowRight, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const Onboarding = () => {
    const { profile, updateProfile } = useProfile();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        nickname: "",
        age: "",
        favQuote: "",
        goal: "",
    });

    // If already set up, redirect to dashboard
    useEffect(() => {
        if (profile.nickname) {
            navigate("/dashboard", { replace: true });
        }
    }, [profile.nickname, navigate]);

    const handleNext = () => {
        if (step === 1 && !formData.nickname.trim()) {
            toast.error("Please tell us your name!");
            return;
        }
        if (step < 4) {
            setStep(step + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = async () => {
        if (!formData.goal.trim()) {
            toast.error("Set a goal to stay focused!");
            return;
        }
        await updateProfile(formData);
        toast.success("Welcome to Focus, " + formData.nickname + "!");
        navigate("/dashboard", { replace: true });
    };

    const progress = (step / 4) * 100;

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 gradient-hero opacity-30" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-lg glass-card rounded-3xl p-8 md:p-12 shadow-2xl border-white/10"
            >
                {/* Progress bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-muted rounded-t-3xl overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                    />
                </div>

                <div className="mb-10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Zap className="h-6 w-6 text-primary" />
                        <span className="font-bold text-lg">Setup Focus</span>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        Step {step} of 4
                    </span>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tight">What should we call you?</h2>
                                <p className="text-muted-foreground italic">Your nickname or first name works great.</p>
                            </div>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    autoFocus
                                    value={formData.nickname}
                                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                    placeholder="Enter your nickname..."
                                    className="pl-12 h-14 text-lg bg-background/50 border-white/5"
                                    onKeyDown={(e) => e.key === "Enter" && handleNext()}
                                />
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tight">How old are you?</h2>
                                <p className="text-muted-foreground italic">We use this to tailor your tracking experience.</p>
                            </div>
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="number"
                                    autoFocus
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    placeholder="Your age..."
                                    className="pl-12 h-14 text-lg bg-background/50 border-white/5"
                                    onKeyDown={(e) => e.key === "Enter" && handleNext()}
                                />
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tight">A quote to live by?</h2>
                                <p className="text-muted-foreground italic">Something that inspires you every morning.</p>
                            </div>
                            <div className="relative group">
                                <Quote className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors scale-x-[-1]" />
                                <Textarea
                                    autoFocus
                                    value={formData.favQuote}
                                    onChange={(e) => setFormData({ ...formData, favQuote: e.target.value })}
                                    placeholder="Words that move you..."
                                    className="pl-12 min-h-[120px] text-lg bg-background/50 border-white/5 pt-4"
                                />
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                                    <Sparkles className="h-3 w-3" />
                                    Finally
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">Your primary goal?</h2>
                                <p className="text-muted-foreground italic">What's the one thing you want to achieve this month?</p>
                            </div>
                            <div className="relative group">
                                <Target className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    autoFocus
                                    value={formData.goal}
                                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                    placeholder="e.g. Save $1000 or complete 50 tasks"
                                    className="pl-12 h-14 text-lg bg-background/50 border-white/5"
                                    onKeyDown={(e) => e.key === "Enter" && handleNext()}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-12 flex items-center justify-between">
                    {step > 1 ? (
                        <Button variant="ghost" onClick={() => setStep(step - 1)} className="text-muted-foreground">
                            Back
                        </Button>
                    ) : (
                        <div />
                    )}
                    <Button onClick={handleNext} className="gap-2 px-8 h-12 text-base rounded-xl group">
                        {step === 4 ? "Begin Journey" : "Continue"}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default Onboarding;
