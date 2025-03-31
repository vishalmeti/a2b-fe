import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Computer, Camera, Book, Gamepad2, Headphones, Handshake } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Button } from "@/components/ui/button"; // Adjust path if needed

// --- Configuration ---
const items = [Computer, Camera, Handshake, Book, Headphones, Gamepad2];
const iconCycleInterval = 1800; // ms per icon
const ellipsisIntervalDuration = 400; // ms per dot change
const cancelButtonDelay = 8000; // 5000ms = 5 seconds
const longerDelayMessageDelay = 3000; // 8000ms = 8 seconds

// --- Animation Variants --- (Unchanged)
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
    const [ellipsisCount, setEllipsisCount] = useState(1);
    // --- State to control button visibility ---
    const [showCancelButton, setShowCancelButton] = useState(false);
    const [showLongerMessage, setShowLongerMessage] = useState(false);
    const navigate = useNavigate();

    // --- Effect to show button after delay ---
    useEffect(() => {
        // Set a timer to show the button after the specified delay
        const timer = setTimeout(() => {
            setShowCancelButton(true);
        }, cancelButtonDelay);

        // Cleanup function: Clear the timer if the component unmounts
        // before the timer finishes (e.g., loading completes quickly)
        return () => clearTimeout(timer);

    }, []); // Empty dependency array ensures this runs only once on mount

    // Add effect for longer message
    useEffect(() => {
        const longerMessageTimer = setTimeout(() => {
            setShowLongerMessage(true);
        }, longerDelayMessageDelay); // Show after 8 seconds

        return () => clearTimeout(longerMessageTimer);
    }, []);

    // Effects for icon cycle and ellipsis (Unchanged)
    useEffect(() => {
        const iconInterval = setInterval(() => {
            setCurrentIcon((prev) => (prev + 1) % items.length);
        }, iconCycleInterval);
        return () => clearInterval(iconInterval);
    }, []);

    useEffect(() => {
        const ellipsisInt = setInterval(() => {
            setEllipsisCount((count) => (count % 3) + 1);
        }, ellipsisIntervalDuration);
        return () => clearInterval(ellipsisInt);
    }, []);

    const Icon = items[currentIcon];
    const animatedEllipsis = '.'.repeat(ellipsisCount);
    const ellipsisPadding = '\u00A0'.repeat(3 - ellipsisCount);

    const handleCancelAndGoHome = () => {
        navigate('/');
    };

    return (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center flex-col gap-5 z-50">

            {/* Icon and Spinner Container */}
            <div className="relative flex items-center justify-center w-40 h-40">
                {/* Spinner (Loader2) */}
                <Loader2
                    className="absolute w-full h-full animate-spin text-primary/30 z-[5]"
                />
                {/* Animated Icon */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIcon}
                        variants={iconVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="z-10"
                    >
                        <Icon className="w-20 h-20 text-primary" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Animated Loading Text */}
            <motion.p
                className="text-xl font-semibold text-foreground tracking-wide min-h-[2em]"
                variants={textVariants}
                initial="hidden"
                animate="visible"
                key={baseMessage}
            >
                {baseMessage}
                <span>{animatedEllipsis}</span>
                <span className="opacity-0">{ellipsisPadding}</span>
            </motion.p>

            {/* Taking longer message */}
            <AnimatePresence>
                {showLongerMessage && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-muted-foreground italic"
                    >
                        This is taking longer than usual, please wait...
                    </motion.p>
                )}
            </AnimatePresence>

            {/* --- Conditionally Rendered Cancel Button --- */}
            {/* Render only if showCancelButton is true */}
            {showCancelButton && (
                <motion.div
                    className="animate-fade-in" // Use fade-in animation when it appears
                    // Removed inline animationDelay, appearance is controlled by mounting now
                >
                    <Button
                        variant="outline" // Outline variant is subtle and fits most themes well
                        onClick={handleCancelAndGoHome}
                        className="border-primary/30 hover:bg-primary/10 hover:text-primary" // Add subtle theme hover colors
                        aria-label="Return to homepage" // Accessibility
                    >
                        Return to Homepage
                    </Button>
                </motion.div>
            )}

        </div>
    );
};