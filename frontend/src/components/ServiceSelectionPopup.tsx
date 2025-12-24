import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { inquiriesApi } from "@/services/inquiriesApi";
import { X } from "lucide-react";



// Event name for popup closure
const POPUP_CLOSED_EVENT = "service-popup-closed";

const ServiceSelectionPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { theme } = useTheme();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    queryType: "",
    message: "",
    privacyConsent: false,
  });

  // Get landing popup settings from theme, or use defaults
  const landingPopup = theme?.theme.landing_popup;
  const isEnabled = landingPopup?.enabled ?? true; // Default to enabled if not set


  useEffect(() => {
    // Only show popup if enabled in theme settings
    if (isEnabled) {
      setTimeout(() => {
        setIsOpen(true);
      }, 5000); // Show after 5 seconds
    }
  }, [isEnabled]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (!open && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(POPUP_CLOSED_EVENT));
      // Reset form when closing
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        queryType: "",
        message: "",
        privacyConsent: false,
      });

    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.privacyConsent) {
      toast({
        title: "Privacy Consent Required",
        description: "Please tick the box to consent to our privacy policy.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await inquiriesApi.create({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.queryType || "General Query",
        message: formData.message,

      });

      toast({
        title: "Request Submitted",
        description: "Thank you! We'll call you back soon.",
      });

      handleOpenChange(false);

    } catch (error) {
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error ? error.message : "Unable to submit your request right now.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if disabled
  if (!isEnabled) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[85vw] md:w-[600px] max-w-[600px] max-h-[80vh] overflow-y-auto p-0 bg-background border-2 border-accent/20 shadow-2xl [&>button]:hidden animate-in fade-in-0 duration-300 gap-0">
        {/* Add required DialogTitle and DialogDescription for accessibility */}
        <VisuallyHidden>
          <DialogTitle>Request a Free Call Back</DialogTitle>
          <DialogDescription>
            Fill out this form to request a free call back from our team. We'll contact you as soon as possible to discuss your needs.
          </DialogDescription>
        </VisuallyHidden>

        <div className="relative bg-background rounded-lg">
          {/* Custom Close button - positioned absolutely */}
          <button
            onClick={() => handleOpenChange(false)}
            className="absolute right-3 top-3 z-20 rounded-full bg-accent/10 hover:bg-accent/20 text-accent transition-all p-1.5"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Title */}
          <div className="pt-4 pb-3 px-4 text-center border-b border-border/50">
            <h2 className="text-lg sm:text-2xl font-bold text-accent" aria-hidden="true">
              REQUEST A FREE-CALL BACK
            </h2>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-background">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
              {/* Left Column */}
              <div className="space-y-2">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="w-full h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    placeholder="Enter your phone number"
                    className="w-full h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                    placeholder="Enter your message"
                    rows={2}
                    className="w-full resize-none min-h-[60px]"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-2">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Enter Your Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    placeholder="your.email@example.com"
                    className="w-full h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="queryType" className="text-sm font-medium">
                    Select a Option
                  </Label>
                  <Select
                    value={formData.queryType}
                    onValueChange={(value) => handleInputChange("queryType", value)}
                    required
                  >
                    <SelectTrigger id="queryType" className="w-full h-9">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General Query">General Query</SelectItem>
                      <SelectItem value="Had an Accident">Had an Accident</SelectItem>
                      <SelectItem value="Replacement Vehicle Service">
                        Replacement Vehicle Service
                      </SelectItem>
                      <SelectItem value="Storage Service">Storage Service</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>


            {/* Privacy Consent Checkbox */}
            <div className="flex items-start gap-2 mb-3">
              <Checkbox
                id="privacyConsent"
                checked={formData.privacyConsent}
                onCheckedChange={(checked) =>
                  handleInputChange("privacyConsent", checked === true)
                }
                className={cn(
                  "mt-0.5 h-4 w-4 border-2 transition-all",
                  formData.privacyConsent
                    ? "border-accent bg-accent data-[state=checked]:bg-accent data-[state=checked]:border-accent ring-2 ring-accent/30 shadow-sm"
                    : "border-input hover:border-accent/50"
                )}
              />
              <Label
                htmlFor="privacyConsent"
                className="text-xs text-foreground cursor-pointer leading-relaxed flex-1"
              >
                By ticking the box you consent for us to contact you in line with our privacy
                policy
              </Label>
            </div>



            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-accent text-accent-foreground hover:bg-accent/90 px-6 py-2 h-9 rounded-md font-medium text-sm w-full sm:w-auto"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>


    </Dialog>
  );
};

export default ServiceSelectionPopup;
