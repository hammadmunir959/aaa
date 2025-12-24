import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bot, Settings, LayoutTemplate, Shield, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/DashboardHeader";
import ChatbotContext from "./ChatbotContext";
import ChatbotSettings from "./ChatbotSettings";
import LandingPageManagement from "./LandingPageManagement";
import AnimatedSection from "@/components/AnimatedSection";

const SuperAdminConfigurations = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Derive active tab from URL or default to 'chatbot-context'
    const deriveTabFromPath = (pathname: string): "chatbot-context" | "chatbot-settings" | "landing-page" => {
        if (pathname.includes("chatbot-settings")) return "chatbot-settings";
        if (pathname.includes("landing-page")) return "landing-page";
        return "chatbot-context";
    };

    const [activeTab, setActiveTab] = useState<"chatbot-context" | "chatbot-settings" | "landing-page">(
        deriveTabFromPath(location.pathname)
    );

    useEffect(() => {
        setActiveTab(deriveTabFromPath(location.pathname));
    }, [location.pathname]);

    const onTabChange = (value: string) => {
        const next = value as "chatbot-context" | "chatbot-settings" | "landing-page";
        setActiveTab(next);
        // Update URL to reflect tab change (optional, but good for bookmarking/navigation)
        // We'll keep it simple and just stay on /super-admin/configs for now, 
        // or we could append query params or sub-routes.
        // simpler to just use state for now unless deep linking is strictly required. 
        // But since the user asked to "move pages", keeping them as tabs in one page is fine.
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <DashboardHeader />

            <main className="flex-grow py-8 bg-background">
                <div className="container mx-auto px-4">
                    <AnimatedSection>
                        <div className="flex items-center gap-4 mb-8">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate("/super-admin/dashboard")}
                                className="rounded-full hover:bg-muted"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold flex items-center gap-2">
                                    <Shield className="w-8 h-8 text-primary" />
                                    Configurations
                                </h1>
                                <p className="text-muted-foreground">Manage global settings, chatbot, and landing page content</p>
                            </div>
                        </div>

                        <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
                            <div className="border-b pb-4">
                                <TabsList className="bg-transparent p-0 gap-6 h-auto">
                                    <TabsTrigger
                                        value="chatbot-context"
                                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-0 py-2"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Bot className="w-4 h-4" />
                                            Chatbot Context
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="chatbot-settings"
                                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-0 py-2"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Settings className="w-4 h-4" />
                                            Chatbot Settings
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="landing-page"
                                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-0 py-2"
                                    >
                                        <div className="flex items-center gap-2">
                                            <LayoutTemplate className="w-4 h-4" />
                                            Landing Page
                                        </div>
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="bg-card rounded-xl border shadow-sm p-6 min-h-[500px]">
                                <TabsContent value="chatbot-context" className="mt-0">
                                    <div className="max-w-4xl">
                                        <h2 className="text-xl font-semibold mb-4">Chatbot Knowledge Base</h2>
                                        <p className="text-sm text-muted-foreground mb-6">Manage the context and knowledge base for the AI assistant.</p>
                                        {/* ChatbotContext usually fetches its own data, so we can just render it. 
                         However, it might rely on being in a specific route or props. 
                         Looking at the file list, it's a page component. We might need to ensure it works embedded.
                     */}
                                        <ChatbotContext embedded />
                                    </div>
                                </TabsContent>

                                <TabsContent value="chatbot-settings" className="mt-0">
                                    <div className="max-w-4xl">
                                        <h2 className="text-xl font-semibold mb-4">Bot Configuration</h2>
                                        <p className="text-sm text-muted-foreground mb-6">Configure behavior, models, and general settings.</p>
                                        <ChatbotSettings embedded />
                                    </div>
                                </TabsContent>

                                <TabsContent value="landing-page" className="mt-0">
                                    <div className="max-w-5xl">
                                        <h2 className="text-xl font-semibold mb-4">Landing Page Content</h2>
                                        <p className="text-sm text-muted-foreground mb-6">Update the main landing page visuals and contact info.</p>
                                        <LandingPageManagement embedded />
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </AnimatedSection>
                </div>
            </main>
        </div>
    );
};

export default SuperAdminConfigurations;
