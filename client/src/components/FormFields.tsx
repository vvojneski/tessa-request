import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface BaseFieldProps {
  name: string;
  label: string;
  description?: string;
  className?: string;
}

export function TextField({ name, label, description, className, ...props }: BaseFieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-foreground/90 font-medium">{label}</Label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <Input id={name} {...register(name)} className={error ? "border-destructive focus-visible:ring-destructive" : ""} {...props} />
      {error && <p className="text-sm text-destructive font-medium animate-in slide-in-from-top-1">{error}</p>}
    </div>
  );
}

export function TextAreaField({ name, label, description, className, ...props }: BaseFieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-foreground/90 font-medium">{label}</Label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <Textarea id={name} {...register(name)} className={error ? "border-destructive focus-visible:ring-destructive" : ""} {...props} />
      {error && <p className="text-sm text-destructive font-medium animate-in slide-in-from-top-1">{error}</p>}
    </div>
  );
}

export function CheckboxGroup({ name, label, options }: { name: string; label: string; options: { value: string; label: string }[] }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string;

  return (
    <div className="space-y-3">
      <Label className="text-foreground/90 font-medium">{label}</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-3 p-3 rounded-lg border border-input hover:bg-accent/50 hover:border-primary/50 cursor-pointer transition-all group">
            <input
              type="checkbox"
              value={option.value}
              {...register(name)}
              className="w-4 h-4 rounded border-input bg-transparent text-primary focus:ring-primary/50 group-hover:border-primary transition-colors"
            />
            <span className="text-sm group-hover:text-primary transition-colors">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-destructive font-medium">{error}</p>}
    </div>
  );
}

export function RadioGroup({ name, label, options, description }: { name: string; label: string; description?: string; options: { value: string; label: string }[] }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string;

  return (
    <div className="space-y-3">
      <Label className="text-foreground/90 font-medium">{label}</Label>
      {description && <p className="text-xs text-muted-foreground mb-2">{description}</p>}
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-3 p-3 rounded-lg border border-input hover:bg-accent/50 hover:border-primary/50 cursor-pointer transition-all group has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input
              type="radio"
              value={option.value}
              {...register(name)}
              className="w-4 h-4 border-input bg-transparent text-primary focus:ring-primary/50 group-hover:border-primary transition-colors"
            />
            <span className="text-sm group-hover:text-primary transition-colors">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-destructive font-medium">{error}</p>}
    </div>
  );
}
