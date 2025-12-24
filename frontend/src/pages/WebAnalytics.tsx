import { useState } from "react";
import { BarChart3, ExternalLink, RefreshCcw, AlertTriangle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardNavBar from "@/components/DashboardNavBar";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Default/Placeholder URL - Replace this with your actual Looker Studio Embed URL
const DEFAULT_EMBED_URL = "https://lookerstudio.google.com/embed/reporting/3791d972-728b-4817-9545-02e3c152c15e/page/iN6iF";

const WebAnalytics = () => {
  // Simple local state to allow testing the clear/set flow. 
  // In a real app, you might fetch this from an API or env var, 
  // but for now, pasting it in the code or UI is fine for a quick integration.
  const [embedUrl, setEmbedUrl] = useState(DEFAULT_EMBED_URL);
  const [tempUrl, setTempUrl] = useState("");

  const handleSaveUrl = () => {
    if (tempUrl) {
      setEmbedUrl(tempUrl);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.08),_transparent_55%)]">
      <DashboardHeader />
      <DashboardNavBar />
      <main className="flex-grow py-8 h-full flex flex-col">
        <div className="container mx-auto px-4 lg:px-6 flex-grow flex flex-col">
          <AnimatedSection className="flex-grow flex flex-col">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Intelligence
                </p>
                <h1 className="text-3xl font-semibold text-foreground">Web Analytics</h1>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("https://lookerstudio.google.com/", "_blank")}
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Looker Studio
                </Button>
                {embedUrl && (
                  <Button variant="ghost" size="sm" onClick={() => setEmbedUrl("")}>
                    Change Report URL
                  </Button>
                )}
              </div>
            </div>

            {embedUrl ? (
              <div className="flex flex-col gap-6 h-full">
                <div className="flex-grow w-full bg-card border rounded-3xl overflow-hidden shadow-sm min-h-[600px] relative">
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    title="Google Analytics Report"
                    allowFullScreen
                    sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                  />
                </div>

                {/* Troubleshooting Guide */}
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-amber-800 dark:text-amber-400">
                      <AlertTriangle className="h-5 w-5" />
                      Troubleshooting Access Issues
                    </CardTitle>
                    <CardDescription className="text-amber-700/80 dark:text-amber-500">
                      If you see "Viewing disabled by report owner" or connection errors, follow these steps.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1" className="border-amber-200 dark:border-amber-900/50">
                        <AccordionTrigger className="text-amber-900 dark:text-amber-300">
                          Error: "Viewing in other websites has been disabled by the report owner"
                        </AccordionTrigger>
                        <AccordionContent className="text-amber-800 dark:text-amber-400">
                          <ol className="list-decimal list-inside space-y-2 ml-2">
                            <li>Open your report in <strong>Looker Studio</strong>.</li>
                            <li>Go to <strong>File</strong> {'>'} <strong>Embed report</strong>.</li>
                            <li>Ensure <strong>Enable embedding</strong> is checked.</li>
                            <li>If already checked, uncheck it and check it again, then save.</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2" className="border-amber-200 dark:border-amber-900/50">
                        <AccordionTrigger className="text-amber-900 dark:text-amber-300">
                          Error: "Request access" or Permission Denied
                        </AccordionTrigger>
                        <AccordionContent className="text-amber-800 dark:text-amber-400">
                          <ol className="list-decimal list-inside space-y-2 ml-2">
                            <li>Click the <strong>Share</strong> button in Looker Studio (top right).</li>
                            <li>Change access to <strong>"Unlisted"</strong> (Anyone with the link can view).</li>
                            <li>Alternatively, explicitly add the Google Account you are using to view this dashboard.</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3" className="border-amber-200 dark:border-amber-900/50 border-b-0">
                        <AccordionTrigger className="text-amber-900 dark:text-amber-300">
                          Blank Screen or Connection Error
                        </AccordionTrigger>
                        <AccordionContent className="text-amber-800 dark:text-amber-400">
                          <p className="mb-2">This is often due to browser privacy settings blocking third-party cookies needed by Google.</p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Try opening the page in a normal window (not Incognito).</li>
                            <li>Allow "Cross-site tracking" for lookerstudio.google.com if prompted.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="max-w-3xl mx-auto border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-background mt-8">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-2xl">Connect Your Google Analytics Report</CardTitle>
                  <CardDescription>
                    Embed a free Looker Studio report to see rich, native charts right here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6 pt-4">
                  <div className="w-full max-w-md space-y-4">
                    <div className="bg-background/50 p-4 rounded-lg border text-sm space-y-2">
                      <p className="font-semibold">How to get your Embed URL:</p>
                      <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                        <li>Link your GA4 property to Looker Studio.</li>
                        <li>Create a report (or use a GA4 template).</li>
                        <li>Click <strong>File {'>'} Embed report</strong>.</li>
                        <li>Check "Embed URL" and copy the link.</li>
                      </ol>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Paste Embed URL here..."
                        value={tempUrl}
                        onChange={(e) => setTempUrl(e.target.value)}
                        className="bg-background"
                      />
                      <Button onClick={handleSaveUrl}>
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </AnimatedSection>
        </div>
      </main>
    </div>
  );
};

export default WebAnalytics;
