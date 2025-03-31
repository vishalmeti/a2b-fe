import { useState, useEffect } from 'react';
// Import Loader2 for the spinner
import { Loader2, Computer, Camera, Book, Gamepad2, Headphones, Handshake } from 'lucide-react';
// Import motion and AnimatePresence from framer-motion
import { motion, AnimatePresence, Variants } from 'framer-motion';

// --- Configuration ---
const items = [Computer, Camera, Handshake, Book, Headphones, Gamepad2];
const iconCycleInterval = 1800; // ms per icon
const ellipsisIntervalDuration = 400; // ms per dot change

// --- Animation Variants ---

// Enhanced Icon Variants (Unchanged from V3)
const iconVariants: Variants = {
    initial: { opacity: 0, scale: 0.3, rotate: -90, y: 30 },
    animate: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        y: [0, -5, 0], // Floating
        transition: {
            rotate: { type: 'spring', stiffness: 150, damping: 15, delay: 0.1 },
            scale: { type: 'spring', stiffness: 150, damping: 15, delay: 0.1 },
            opacity: { duration: 0.3, delay: 0.1 },
            y: { duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
        },
    },
    exit: {
        opacity: 0,
        scale: 0.5,
        rotate: 90,
        y: -30,
        transition: { duration: 0.4, ease: 'anticipate' },
    },
};

// Text Variants (Unchanged from V3)
const textVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 20, delay: 0.3 },
    },
};

// --- Main Component ---

export const LoadingScreen = ({ baseMessage = "Loading" }: { baseMessage?: string }) => {
    const [currentIcon, setCurrentIcon] = useState(0);
    const [ellipsisCount, setEllipsisCount] = useState(1); // For animating "..."

    // Effect for cycling through icons (Unchanged)
    useEffect(() => {
        const iconInterval = setInterval(() => {
            setCurrentIcon((prev) => (prev + 1) % items.length);
        }, iconCycleInterval);
        return () => clearInterval(iconInterval);
    }, []);

    // Effect for animating the ellipsis (Unchanged)
    useEffect(() => {
        const ellipsisInt = setInterval(() => {
            setEllipsisCount((count) => (count % 3) + 1); // Cycles 1, 2, 3
        }, ellipsisIntervalDuration);
        return () => clearInterval(ellipsisInt);
    }, []);

    const Icon = items[currentIcon];
    const animatedEllipsis = '.'.repeat(ellipsisCount); // String of dots: ".", "..", "..."
    // Padding to prevent layout shift (Unchanged)
    const ellipsisPadding = '\u00A0'.repeat(3 - ellipsisCount); // Non-breaking spaces

    return (
        // Main container: Reduced vertical gap to gap-4
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center flex-col gap-4 z-50">

            {/* Icon and Spinner Container: Resized to w-20 h-20 */}
            <div className="relative flex items-center justify-center w-40 h-40">

                {/* Spinner (Loader2) positioned behind the icon */}
                <Loader2
                    className="absolute w-full h-full animate-spin text-primary/30 z-[5]" // Adjusted color/opacity, z-index below icon
                />

                {/* Animated Icon (in front) */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIcon} // Key change triggers animation
                        variants={iconVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="z-10" // Icon is topmost (z-index: 10)
                    >
                        {/* Icon size remains w-12 h-12 */}
                        <Icon className="w-20 h-20 text-primary" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Animated Loading Text (Unchanged from V3) */}
            <motion.p
                className="text-xl font-semibold text-foreground tracking-wide min-h-[2em]"
                variants={textVariants}
                initial="hidden"
                animate="visible"
                key={baseMessage} // Re-animate if baseMessage prop changes
            >
                {baseMessage}
                {/* Render animated dots and padding */}
                <span>{animatedEllipsis}</span>
                <span className="opacity-0">{ellipsisPadding}</span> {/* Invisible Padding */}
            </motion.p>
        </div>
    );
};