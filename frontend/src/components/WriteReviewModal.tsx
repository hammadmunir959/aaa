import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, MessageCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { testimonialsApi } from "@/services/testimonialsApi";
import { useToast } from "@/hooks/use-toast";
import { formatWhatsAppMessage, openWhatsApp } from "@/utils/whatsapp";

interface WriteReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const WriteReviewModal = ({
  open,
  onOpenChange,
  onSuccess,
}: WriteReviewModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    feedback: "",
    rating: 5,
    service_type: "",
  });

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      setFormData({
        name: "",
        feedback: "",
        rating: 5,
        service_type: "",
      });
    }
  }, [open]);



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      service_type: value || "",
    }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating: rating,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.feedback.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }



    setIsSubmitting(true);
    try {
      await testimonialsApi.create({
        name: formData.name.trim(),
        feedback: formData.feedback.trim(),
        rating: formData.rating,
        service_type: formData.service_type || undefined,
        honeypot: "",
      });

      toast({
        title: "Thank you!",
        description: "Your review has been published successfully and is now visible on our testimonials page.",
      });

      // Reset form
      setFormData({
        name: "",
        feedback: "",
        rating: 5,
        service_type: "",
      });

      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Unable to submit your review. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (currentRating: number) => {
    return (
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingClick(star)}
            disabled={isSubmitting}
            className="focus:outline-none transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Star
              className={`w-8 h-8 ${star <= currentRating
                ? "fill-accent text-accent"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          ({currentRating} / 5)
        </span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with us. Your feedback helps us improve our services and assists others in making informed decisions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Your Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                disabled={isSubmitting}
                className="text-base"
              />
            </div>

            {/* Service Type (Optional) */}
            <div className="grid gap-2">
              <Label htmlFor="service_type">Service Type (Optional)</Label>
              <Select
                value={formData.service_type || undefined}
                onValueChange={handleServiceTypeChange}
                disabled={isSubmitting}
              >
                <SelectTrigger id="service_type" className="text-base">
                  <SelectValue placeholder="Select service type (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car_hire">Car Hire</SelectItem>
                  <SelectItem value="car_rental">Car Rental</SelectItem>
                  <SelectItem value="claims_management">Claims Management</SelectItem>
                  <SelectItem value="car_purchase_sale">Car Purchase/Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rating */}
            <div className="grid gap-2">
              <Label>
                Rating <span className="text-destructive">*</span>
              </Label>
              {renderStarRating(formData.rating)}
              <p className="text-xs text-muted-foreground">
                Click on the stars to set your rating (1-5)
              </p>
            </div>

            {/* Feedback */}
            <div className="grid gap-2">
              <Label htmlFor="feedback">
                Your Review <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                placeholder="Tell us about your experience..."
                rows={6}
                className="resize-none text-base"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Please be honest and detailed in your review. Your review will be moderated before being published.
              </p>
            </div>



            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="sm:order-3"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 sm:order-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 sm:order-2"
                onClick={() => {
                  const whatsappData = {
                    name: formData.name,
                    feedback: formData.feedback,
                    service_type: formData.service_type,
                  };
                  const message = formatWhatsAppMessage(whatsappData, 'testimonial');
                  openWhatsApp(import.meta.env.VITE_WHATSAPP_PHONE || "+447943770119", message);
                }}
                disabled={isSubmitting}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send on WhatsApp
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>


    </Dialog>
  );
};

export default WriteReviewModal;

