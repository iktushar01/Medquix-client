"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = authClient.useSession();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const callbackUrl = searchParams.get("callbackUrl");

  const handleQuickFill = (role: 'admin' | 'seller' | 'user') => {
    const credentials = {
      admin: { email: "admin@example.com", pass: "Admin123" },
      seller: { email: "seller@example.com", pass: "Seller123" },
      user: { email: "customer@example.com", pass: "Customer123" },
    };
    setEmail(credentials[role].email);
    setPassword(credentials[role].pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || "Login failed");
      }

      let redirectUrl = "/";
      if (callbackUrl) {
        redirectUrl = callbackUrl;
      } else if (data?.user && (data.user as any).role) {
        const role = (data.user as any).role.toLowerCase();
        if (role === "seller") redirectUrl = "/seller/dashboard";
        else if (role === "admin") redirectUrl = "/admin/dashboard";
      }

      router.push(redirectUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <form onSubmit={handleSubmit} {...props}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground text-sm">
              Use demo accounts or enter your details
            </p>
          </div>

          {/* Quick Fill Roles */}
          <div className="grid grid-cols-3 gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => handleQuickFill('user')} className="text-xs">Customer</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => handleQuickFill('seller')} className="text-xs">Seller</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => handleQuickFill('admin')} className="text-xs">Admin</Button>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="pr-10"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>

          {error && <p className="text-xs font-medium text-destructive text-center">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Login"}
          </Button>
        </FieldGroup>
      </form>

      {/* Register Section */}
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  );
}