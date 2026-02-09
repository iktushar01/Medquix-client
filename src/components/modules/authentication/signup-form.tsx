"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { handleGoogleLogin } from "@/lib/handleGoogleLogin";
import { useState, useCallback, useMemo } from "react";
import { uploadToImgbb } from "@/lib/uploadToImgbb";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  image: string;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  phone?: string;
  general?: string;
}

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    image: "",
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Memoized validation
  const passwordsMatch = useMemo(
    () => !formData.confirmPassword || formData.password === formData.confirmPassword,
    [formData.password, formData.confirmPassword]
  );

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.password.length >= 6 &&
      passwordsMatch &&
      formData.phone.trim()
    );
  }, [formData, passwordsMatch]);

  // Generic input handler
  const handleInputChange = useCallback(
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear related errors
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  // Validate password strength
  const validatePassword = useCallback((password: string): string | undefined => {
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password should contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password should contain at least one number";
    }
    return undefined;
  }, []);

  // Validate phone number
  const validatePhone = useCallback((phone: string): string | undefined => {
    const phoneRegex = /^01[3-9]\d{8}$/; // Bangladesh phone format
    if (!phoneRegex.test(phone)) {
      return "Please enter a valid phone number (e.g., 017xxxxxxxx)";
    }
    return undefined;
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Reset errors
      setErrors({});

      // Validate passwords match
      if (!passwordsMatch) {
        setErrors({ confirmPassword: "Passwords do not match" });
        return;
      }

      // Validate password strength
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        setErrors({ password: passwordError });
        return;
      }

      // Validate phone
      const phoneError = validatePhone(formData.phone);
      if (phoneError) {
        setErrors({ phone: phoneError });
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up/email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            phone: formData.phone.trim(),
            image: formData.image,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrors({ general: data.message || "Signup failed. Please try again." });
          return;
        }

        // Success - redirect
        window.location.href = "/login";
      } catch (err) {
        console.error("Signup error:", err);
        setErrors({ general: "Network error. Please check your connection." });
      } finally {
        setLoading(false);
      }
    },
    [formData, passwordsMatch, validatePassword, validatePhone]
  );

  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ general: "Image size must be less than 5MB" });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors({ general: "Please upload a valid image file" });
        return;
      }

      try {
        setImageUploading(true);
        const url = await uploadToImgbb(file);
        setFormData((prev) => ({ ...prev, image: url }));
        setErrors((prev) => ({ ...prev, general: undefined }));
      } catch (err) {
        console.error("Image upload error:", err);
        setErrors({ general: "Image upload failed. Please try again." });
      } finally {
        setImageUploading(false);
      }
    },
    []
  );

  const isSubmitDisabled = loading || imageUploading || !isFormValid;

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>

        {/* Display general errors */}
        {errors.general && (
          <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
            {errors.general}
          </div>
        )}

        {/* Profile Image Upload */}
        <Field>
          <FieldLabel>Profile Image</FieldLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={imageUploading || loading}
          />
          <FieldDescription>
            {imageUploading
              ? "Uploading image..."
              : formData.image
              ? "Image uploaded successfully ✓"
              : "Optional: Upload a profile picture (max 5MB)"}
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={handleInputChange("name")}
            disabled={loading}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={formData.email}
            onChange={handleInputChange("email")}
            disabled={loading}
            autoComplete="email"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={handleInputChange("password")}
            disabled={loading}
            autoComplete="new-password"
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <FieldDescription className="text-destructive">
              {errors.password}
            </FieldDescription>
          )}
          {!errors.password && formData.password && (
            <FieldDescription>
              Password strength: {formData.password.length < 6 ? "Weak" : "Good"}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleInputChange("confirmPassword")}
            disabled={loading}
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <FieldDescription className="text-destructive">
              {errors.confirmPassword}
            </FieldDescription>
          )}
          {!errors.confirmPassword && formData.confirmPassword && passwordsMatch && (
            <FieldDescription className="text-green-600">
              Passwords match ✓
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <Input
            id="phone"
            type="tel"
            placeholder="017xxxxxxxx"
            required
            value={formData.phone}
            onChange={handleInputChange("phone")}
            disabled={loading}
            autoComplete="tel"
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <FieldDescription className="text-destructive">
              {errors.phone}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitDisabled} className="w-full">
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            type="button"
            disabled={loading}
            className="w-full"
          >
            Login with Google
          </Button>
          <FieldDescription className="px-6 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Sign in
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}