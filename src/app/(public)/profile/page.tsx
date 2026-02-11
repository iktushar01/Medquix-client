"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  MapPin,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  LogOut,
  Camera,
  User,
  CreditCard,
  Bell,
  ChevronRight,
  Package,
  Heart,
  Star,
  Clock,
  MapPinned,
  Lock,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "seller" | "admin";
  avatarUrl?: string;
  location?: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Profile fetch failed", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <LoadingState />;
  if (!profile) return <ErrorState />;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "seller":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-accent/10 text-accent-foreground border-accent/20";
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              {/* Avatar Section */}
              <div className="relative w-28 h-28 mx-auto mb-5">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
                <img
                  src={
                    profile.avatarUrl ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`
                  }
                  alt="avatar"
                  className="relative rounded-full border-4 border-background shadow-lg"
                />
                <button className="absolute bottom-0 right-0 p-2.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-105 transition-transform">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="text-center space-y-3">
                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-foreground">
                      {profile.name}
                    </h2>
                    {profile.role === "admin" && (
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>

                <Badge
                  className={`${getRoleBadgeColor(profile.role)} uppercase text-xs font-semibold px-3 py-1`}
                >
                  {profile.role}
                </Badge>
              </div>

              {/* Quick Stats
              <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-border">
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">
                    {profile.role === "customer" ? "12" : "48"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {profile.role === "customer" ? "Orders" : "Products"}
                  </p>
                </div>
                <div className="text-center border-x border-border">
                  <p className="text-xl font-bold text-primary">
                    {profile.role === "customer" ? "5" : "156"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {profile.role === "customer" ? "Saved" : "Sales"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">4.8</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div> */}
            </div>

            {/* Role-Specific Quick Links
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="p-4 bg-muted/50 border-b border-border">
                <h3 className="font-semibold text-sm text-foreground">Quick Links</h3>
              </div>
              <div className="divide-y divide-border">
                {profile.role === "customer" && (
                  <>
                    <QuickLink
                      icon={<Package className="h-4 w-4" />}
                      label="My Orders"
                      href="/orders"
                    />
                    <QuickLink
                      icon={<Heart className="h-4 w-4" />}
                      label="Saved Items"
                      href="/saved"
                    />
                  </>
                )}
                {profile.role === "seller" && (
                  <>
                    <QuickLink
                      icon={<Package className="h-4 w-4" />}
                      label="Inventory"
                      href="/seller/medicines"
                    />
                    <QuickLink
                      icon={<FileText className="h-4 w-4" />}
                      label="Orders"
                      href="/seller/orders"
                    />
                  </>
                )}
                {profile.role === "admin" && (
                  <>
                    <QuickLink
                      icon={<User className="h-4 w-4" />}
                      label="Manage Users"
                      href="/admin/users"
                    />
                    <QuickLink
                      icon={<Package className="h-4 w-4" />}
                      label="All Orders"
                      href="/admin/orders"
                    />
                  </>
                )}
              </div>
            </div> */}

            {/* Logout */}
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/30"
              onClick={async () => {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
                  method: "POST",
                  credentials: "include",
                });
                window.location.href = "/login";
              }}
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Section */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-5 bg-muted/50 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">
                    Personal Information
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your contact details and account info
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  Edit
                </Button>
              </div>

              <div className="p-6 grid sm:grid-cols-2 gap-4">
                <InfoField
                  icon={<Mail className="h-4 w-4 text-primary" />}
                  label="Email Address"
                  value={profile.email}
                />
                <InfoField
                  icon={<Phone className="h-4 w-4 text-primary" />}
                  label="Phone Number"
                  value={profile.phone || "Not provided"}
                />
                <InfoField
                  icon={<MapPinned className="h-4 w-4 text-primary" />}
                  label="Location"
                  value={profile.location || "Bangladesh"}
                />
                <InfoField
                  icon={<Calendar className="h-4 w-4 text-primary" />}
                  label="Member Since"
                  value={
                    profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })
                      : "—"
                  }
                />
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-5 bg-muted/50 border-b border-border">
                <h3 className="font-semibold text-foreground">Account Settings</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage your preferences and security
                </p>
              </div>

              <div className="divide-y divide-border">
                <SettingItem
                  icon={<User className="h-5 w-5 text-primary" />}
                  title="Profile Details"
                  subtitle="Update your name, photo and bio"
                  iconBg="bg-primary/10"
                />
                <SettingItem
                  icon={<Lock className="h-5 w-5 text-accent" />}
                  title="Security"
                  subtitle="Password and two-factor authentication"
                  iconBg="bg-accent/10"
                />
                <SettingItem
                  icon={<Bell className="h-5 w-5 text-primary" />}
                  title="Notifications"
                  subtitle="Email and push notification preferences"
                  iconBg="bg-primary/10"
                />
                {profile.role === "customer" && (
                  <SettingItem
                    icon={<MapPin className="h-5 w-5 text-accent" />}
                    title="Addresses"
                    subtitle="Manage your delivery addresses"
                    iconBg="bg-accent/10"
                  />
                )}
                {profile.role === "customer" && (
                  <SettingItem
                    icon={<CreditCard className="h-5 w-5 text-primary" />}
                    title="Payment Methods"
                    subtitle="Saved payment options (COD available)"
                    iconBg="bg-primary/10"
                  />
                )}
              </div>
            </div>

            {/* Trust & Safety Banner */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    Your Health, Our Priority
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    All medicines are verified and sourced from licensed pharmacies.
                    Your data is encrypted and secure.
                  </p>
                  {/* <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="bg-background text-xs border-primary/30"
                    >
                      ✓ SSL Encrypted
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-background text-xs border-primary/30"
                    >
                      ✓ Licensed Sellers
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-background text-xs border-primary/30"
                    >
                      ✓ Quality Assured
                    </Badge>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== COMPONENTS ========== */

function InfoField({ icon, label, value }: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-sm font-medium text-foreground pl-6">{value}</p>
    </div>
  );
}

function SettingItem({ icon, title, subtitle, iconBg }: any) {
  return (
    <button className="w-full flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors group">
      <div className={`p-2.5 ${iconBg} rounded-xl`}>{icon}</div>
      <div className="flex-1 text-left">
        <p className="font-medium text-foreground mb-0.5">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </button>
  );
}

function QuickLink({ icon, label, href }: any) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors group"
    >
      <div className="text-primary">{icon}</div>
      <span className="text-sm font-medium text-foreground flex-1">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
    </a>
  );
}

function LoadingState() {
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-muted-foreground font-medium">Loading your profile...</p>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 bg-destructive/10 rounded-full flex items-center justify-center">
          <LogOut className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Session Expired</h2>
        <p className="text-muted-foreground mb-6">
          Your session has expired. Please log in again to continue.
        </p>
        <Button
          onClick={() => (window.location.href = "/login")}
          className="h-11 px-8 rounded-xl font-medium"
        >
          Go to Login
        </Button>
      </div>
    </div>
  );
}