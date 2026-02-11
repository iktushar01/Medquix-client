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
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

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
  const [showPassword, setShowPassword] = useState(false);

  // Helper for quick testing
  const handleQuickFill = () => {
    setFormData({
      name: "Test User",
      email: `test${Math.floor(Math.random() * 1000)}@example.com`,
      password: "Password123",
      confirmPassword: "Password123",
      phone: "01712345678",
      image: "",
    });
  };

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

  const handleInputChange = useCallback(
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const validatePassword = useCallback((password: string): string | undefined => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(password)) return "Include at least one uppercase letter";
    if (!/[0-9]/.test(password)) return "Include at least one number";
    return undefined;
  }, []);

  const validatePhone = useCallback((phone: string): string | undefined => {
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(phone)) return "Invalid Bangladesh phone format";
    return undefined;
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!passwordsMatch) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrors({ password: passwordError });
      return;
    }

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
          ...formData,
          email: formData.email.trim().toLowerCase(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      window.location.href = "/login";
    } catch (err: any) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  }, [formData, passwordsMatch, validatePassword, validatePhone]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setImageUploading(true);
      const url = await uploadToImgbb(file);
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err) {
      setErrors({ general: "Image upload failed" });
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <form onSubmit={handleSubmit} {...props}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Create account</h1>
            <p className="text-muted-foreground text-sm">Join us by filling the details below</p>
          </div>

          <Button type="button" variant="outline" size="sm" onClick={handleQuickFill} className="w-full text-xs">
            Quick Fill Test Data
          </Button>

          {errors.general && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-xs text-center">
              {errors.general}
            </div>
          )}

          <Field>
            <FieldLabel>Profile Image</FieldLabel>
            <Input type="file" accept="image/*" onChange={handleImageChange} disabled={imageUploading || loading} />
            <FieldDescription className="text-[10px]">
              {imageUploading ? "Uploading..." : formData.image ? "Uploaded ✓" : "Max 5MB"}
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input id="name" placeholder="John Doe" required value={formData.name} onChange={handleInputChange("name")} disabled={loading} />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" placeholder="m@example.com" required value={formData.email} onChange={handleInputChange("email")} disabled={loading} />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="pr-10"
                value={formData.password}
                onChange={handleInputChange("password")}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-destructive mt-1">{errors.password}</p>}
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input id="phone" type="tel" placeholder="017xxxxxxxx" required value={formData.phone} onChange={handleInputChange("phone")} disabled={loading} />
            {errors.phone && <p className="text-[10px] text-destructive mt-1">{errors.phone}</p>}
          </Field>

          <Button type="submit" disabled={loading || imageUploading || !isFormValid} className="w-full">
            {loading ? "Creating..." : "Sign Up"}
          </Button>

          <FieldSeparator>Or</FieldSeparator>

          <Button onClick={handleGoogleLogin} variant="outline" type="button" className="w-full">
            Google
          </Button>
        </FieldGroup>
      </form>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary underline">Sign in</Link>
      </div>
    </div>
  );
}