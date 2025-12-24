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
import { Loader2 } from "lucide-react";
import { carSalesApi, type SellRequestPayload } from "@/services/carSalesApi";
import { useToast } from "@/hooks/use-toast";
import { formatWhatsAppMessage, openWhatsApp } from "@/utils/whatsapp";
import { MessageCircle } from "lucide-react";

interface SellCarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const SellCarModal = ({
  open,
  onOpenChange,
  onSuccess,
}: SellCarModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    mileage: "",
    message: "",
    vehicle_image: null as File | null,
  });

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      setFormData({
        name: "",
        email: "",
        phone: "",
        vehicle_make: "",
        vehicle_model: "",
        vehicle_year: "",
        mileage: "",
        message: "",
        vehicle_image: null,
      });
      setImagePreview(null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        vehicle_image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        vehicle_image: null,
      }));
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: at least email or phone required
    if (!formData.email.trim() && !formData.phone.trim()) {
      toast({
        title: "Contact information required",
        description: "Please provide either an email or phone number.",
        variant: "destructive",
      });
      return;
    }

    // Validation: name, make, model required
    if (!formData.name.trim() || !formData.vehicle_make.trim() || !formData.vehicle_model.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Vehicle Make, Vehicle Model).",
        variant: "destructive",
      });
      return;
    }



    setIsSubmitting(true);
    try {
      const payload: SellRequestPayload = {
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        vehicle_make: formData.vehicle_make.trim(),
        vehicle_model: formData.vehicle_model.trim(),
        vehicle_year: formData.vehicle_year ? Number(formData.vehicle_year) : undefined,
        mileage: formData.mileage ? Number(formData.mileage) : undefined,
        message: formData.message.trim() || undefined,
        vehicle_image: formData.vehicle_image || undefined,

        honeypot: "",
      };

      await carSalesApi.submitSellRequest(payload);

      toast({
        title: "Thank you!",
        description: "Your car sell request has been submitted successfully. Our team will contact you shortly.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        vehicle_make: "",
        vehicle_model: "",
        vehicle_year: "",
        mileage: "",
        message: "",
        vehicle_image: null,
      });
      setImagePreview(null);

      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Unable to submit your request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Sell Your Car</DialogTitle>
          <DialogDescription>
            Fill out the form below and we'll get back to you with a valuation and next steps.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                disabled={isSubmitting}
                className="text-base"
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  disabled={isSubmitting}
                  className="text-base"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+44 123 456 7890"
                  disabled={isSubmitting}
                  className="text-base"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground -mt-4">
              Please provide either an email or phone number (at least one required)
            </p>

            {/* Vehicle Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="vehicle_make">
                  Vehicle Make <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="vehicle_make"
                  name="vehicle_make"
                  value={formData.vehicle_make}
                  onChange={handleChange}
                  placeholder="e.g., BMW, Audi, Toyota"
                  required
                  disabled={isSubmitting}
                  className="text-base"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vehicle_model">
                  Vehicle Model <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="vehicle_model"
                  name="vehicle_model"
                  value={formData.vehicle_model}
                  onChange={handleChange}
                  placeholder="e.g., X5, Q7, Corolla"
                  required
                  disabled={isSubmitting}
                  className="text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="vehicle_year">Vehicle Year</Label>
                <Input
                  id="vehicle_year"
                  name="vehicle_year"
                  type="number"
                  value={formData.vehicle_year}
                  onChange={handleChange}
                  placeholder="e.g., 2020"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  disabled={isSubmitting}
                  className="text-base"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  name="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={handleChange}
                  placeholder="e.g., 50000"
                  min="0"
                  disabled={isSubmitting}
                  className="text-base"
                />
              </div>
            </div>

            {/* Vehicle Image */}
            <div className="grid gap-2">
              <Label htmlFor="vehicle_image">Vehicle Image (Optional)</Label>
              <Input
                id="vehicle_image"
                name="vehicle_image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSubmitting}
                className="text-base"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Vehicle preview"
                    className="w-full h-32 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div className="grid gap-2">
              <Label htmlFor="message">Additional Details</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your vehicle, condition, service history, etc..."
                rows={4}
                className="resize-none text-base"
                disabled={isSubmitting}
              />
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
                  "Submit Request"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 sm:order-2"
                onClick={() => {
                  const whatsappData = {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    vehicle_make: formData.vehicle_make,
                    vehicle_model: formData.vehicle_model,
                    vehicle_year: formData.vehicle_year,
                    mileage: formData.mileage,
                    message: formData.message,
                  };
                  const message = formatWhatsAppMessage(whatsappData, 'sell_car');
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

export default SellCarModal;

