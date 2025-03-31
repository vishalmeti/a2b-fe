// src/pages/NotFoundV2.tsx (or your preferred location)

import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Ghost } from "lucide-react"; // Using a different icon
import { Button } from "@/components/ui/button"; // Recommended

const NotFoundV2 = () => {
    const location = useLocation();
    const attemptedPath = location.pathname; // Store path for display

    useEffect(() => {
        console.error(
            `404 Error: User attempted to access non-existent route: ${attemptedPath}`
        );
    }, [attemptedPath]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div
                className="
                    w-full max-w-lg bg-card text-card-foreground
                    p-8 md:p-12 rounded-xl border shadow-md text-center
                    transition-shadow duration-300 ease-in-out hover:shadow-xl
                    animate-fade-in
                "
            >
                <div className="mb-6 flex justify-center">
                    <Ghost className="w-20 h-20 text-primary animate-bounce" strokeWidth={1.5} />
                </div>

                <div
                    className="animate-fade-in"
                    style={{ animationDelay: '150ms' }}
                >
                    <h1 className="text-7xl lg:text-8xl font-extrabold text-primary mb-3 tracking-tight">
                        404
                    </h1>
                    <p className="text-xl lg:text-2xl text-muted-foreground mb-4">
                        Page Not Found
                    </p>
                    {/* Updated paragraph for path display */}
                    <p className="text-sm text-muted-foreground/80 mb-8">
                        Sorry, we couldn't find the page:{" "} {/* Added space for readability */}
                        {/* Apply break-words to the code element */}
                        <code className="bg-muted px-1 py-0.5 rounded text-muted-foreground font-mono break-words">
                            {attemptedPath}
                        </code>
                    </p>
                </div>

                <div
                    className="animate-fade-in"
                    style={{ animationDelay: '300ms' }}
                >
                    <Button asChild size="lg">
                        <Link to="/">Return to Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundV2;