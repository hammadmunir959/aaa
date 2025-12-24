import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

interface ErrorPageProps {
    code: string | number;
    title: string;
    message: string;
    children?: React.ReactNode;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ code, title, message, children }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <AnimatedSection>
                <div className="text-center relative z-10 px-4">
                    <div className="relative inline-block">
                        <h1 className="text-[150px] md:text-[220px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-tr from-accent/20 to-accent/5 select-none animate-pulse-slow">
                            {code}
                        </h1>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
                            <span className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
                                {code}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6 -mt-8 md:-mt-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                            {title}
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-[600px] mx-auto leading-relaxed">
                            {message}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                            <Link to="/">
                                <Button size="lg" className="h-14 px-8 font-bold text-base gap-2 bg-gold hover:bg-gold/90 text-black border-none shadow-lg hover:shadow-yellow-500/20 transition-all duration-300">
                                    <Home className="w-5 h-5" />
                                    Return Home
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => window.history.back()}
                                className="h-14 px-8 font-medium text-base gap-2 hover:bg-secondary border-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Go Back
                            </Button>
                        </div>

                        {children}
                    </div>
                </div>
            </AnimatedSection>
        </div>
    );
};

export default ErrorPage;
