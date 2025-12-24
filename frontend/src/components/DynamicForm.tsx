import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface FormField {
    name: string;
    type: "text" | "number" | "email" | "date" | "textarea" | "checkbox" | "file";
    label: string;
    required?: boolean;
    placeholder?: string;
    description?: string;
}

export interface FormSchema {
    fields: FormField[];
}

interface DynamicFormProps {
    schema: FormSchema;
    initialData?: Record<string, any>;
    onSubmit: (data: Record<string, any>) => void;
    isLoading?: boolean;
    submitLabel?: string;
}

const DynamicForm = ({ schema, initialData, onSubmit, isLoading, submitLabel = "Submit" }: DynamicFormProps) => {
    const [formData, setFormData] = useState<Record<string, any>>(initialData || {});
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (name: string, value: any) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleFileChange = (name: string, files: FileList | null) => {
        if (files && files.length > 0) {
            // For now, just store the file object. Logic to upload might be separate or handled in parent.
            // If the parent expects a file object, this is fine.
            handleChange(name, files[0]);
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (schema.fields) {
            schema.fields.forEach((field) => {
                if (field.required) {
                    if (field.type === "checkbox") return; // Checkbox false is valid
                    if (!formData[field.name] && formData[field.name] !== 0) {
                        newErrors[field.name] = `${field.label} is required`;
                    }
                }
            });
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {schema.fields?.map((field) => (
                <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>
                        {field.label} {field.required && <span className="text-destructive">*</span>}
                    </Label>

                    {field.type === "textarea" ? (
                        <Textarea
                            id={field.name}
                            placeholder={field.placeholder}
                            value={formData[field.name] || ""}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                        />
                    ) : field.type === "checkbox" ? (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={field.name}
                                checked={!!formData[field.name]}
                                onCheckedChange={(checked) => handleChange(field.name, checked)}
                            />
                            <span className="text-sm text-muted-foreground">{field.description}</span>
                        </div>
                    ) : field.type === "file" ? (
                        <Input
                            id={field.name}
                            type="file"
                            onChange={(e) => handleFileChange(field.name, e.target.files)}
                        />
                    ) : (
                        <Input
                            id={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formData[field.name] || ""}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                        />
                    )}

                    {field.description && field.type !== "checkbox" && (
                        <p className="text-xs text-muted-foreground">{field.description}</p>
                    )}

                    {errors[field.name] && (
                        <p className="text-xs text-destructive font-medium">{errors[field.name]}</p>
                    )}
                </div>
            ))}

            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitLabel}
            </Button>
        </form>
    );
};

export default DynamicForm;
