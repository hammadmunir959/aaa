import React, { Component, ErrorInfo, ReactNode } from "react";
import ErrorPage from "./ErrorPage";
import { Button } from "./ui/button";
import { RefreshCcw } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <ErrorPage
                    code="500"
                    title="Engine Trouble"
                    message="We've encountered an unexpected error under the hood. Our mechanics have been notified."
                >
                    <div className="pt-4">
                        <Button
                            onClick={() => window.location.reload()}
                            size="lg"
                            className="h-12 px-8 font-medium gap-2 bg-gold hover:bg-gold/90 text-black border-none"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Restart Engine
                        </Button>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-8 p-4 bg-red-950/30 border border-red-500/20 rounded-lg text-left max-w-2xl mx-auto overflow-auto max-h-[200px]">
                                <p className="font-mono text-red-400 text-sm whitespace-pre-wrap">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}
                    </div>
                </ErrorPage>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
