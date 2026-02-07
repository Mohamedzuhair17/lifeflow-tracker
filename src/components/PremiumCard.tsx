import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface PremiumCardProps {
    children: ReactNode;
    className?: string;
    glowColor?: string;
    delay?: number;
}

const PremiumCard = ({ children, className, glowColor = "hsl(var(--primary))", delay = 0 }: PremiumCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: delay * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group relative"
        >
            {/* Anti-Gravity Float Animation Wrapper */}
            <div className="animate-float" style={{ animationDelay: `${delay * 0.5}s` }}>
                <div
                    className={cn(
                        "frosted-glass rounded-2xl overflow-hidden relative transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]",
                        className
                    )}
                >
                    {/* Neon Light Trail - Top */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--primary)/0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Content */}
                    <div className="relative z-10">
                        {children}
                    </div>

                    {/* Interactive Glow */}
                    <div
                        className="absolute -inset-1 bg-gradient-to-br from-[hsl(var(--primary)/0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10 blur-xl"
                    />
                </div>
            </div>

            {/* Floating Shadow */}
            <div className="absolute -bottom-8 left-4 right-4 h-4 bg-black/40 blur-xl rounded-[100%] transition-transform duration-[6s] group-hover:scale-90"
                style={{ animation: 'float 6s ease-in-out infinite reverse', animationDelay: `${delay * 0.5}s` }}
            />
        </motion.div>
    );
};

export default PremiumCard;
