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
  Sparkles,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
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
          `${process.env.NEXT_PUBLIC_API_URL || ""}/profile`,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20 py-20 px-4 sm:px-6 lg:px-8">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header Banner */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Profile Overview</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Your Account
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Card */}
            <div className="group relative bg-card/80 backdrop-blur-xl rounded-3xl p-8 border border-border shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />

              <div className="relative">
                {/* Avatar */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-3xl opacity-20 blur-md" />
                  <img
                    src={
                      profile.avatarUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`
                    }
                    alt="avatar"
                    className="relative rounded-3xl border-4 border-background shadow-xl"
                  />
                  <button className="absolute -bottom-2 -right-2 p-3 bg-primary text-primary-foreground rounded-2xl shadow-lg hover:scale-110 transition-transform duration-200">
                    <Camera className="h-4 w-4" />
                  </button>
                  {/* Status Indicator */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full border-4 border-background">
                    <div className="w-full h-full bg-primary rounded-full animate-ping opacity-75" />
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center space-y-3">
                  <div className="flex justify-center items-center gap-2">
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">{profile.email}</p>

                  <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase text-xs font-semibold px-3 py-1">
                      <Award className="h-3 w-3 mr-1" />
                      {profile.role}
                    </Badge>
                  </div>
                </div>

              </div>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-14 rounded-2xl text-destructive hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20 transition-all duration-200"
              onClick={async () => {
                await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-out`,
                  { method: "POST", credentials: "include" }
                );
                window.location.href = "/login";
              }}
            >
              <LogOut className="h-5 w-5" />
              <span className="font-semibold">Logout</span>
            </Button>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-8 space-y-6">
            {/* Info Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoTile
                icon={<Mail className="h-5 w-5 text-primary" />}
                label="Email"
                value={profile.email}
                gradient="from-primary/20 to-primary/5"
              />
              <InfoTile
                icon={<Phone className="h-5 w-5 text-accent" />}
                label="Phone"
                value={profile.phone || "Not set"}
                gradient="from-accent/20 to-accent/5"
              />
              <InfoTile
                icon={<MapPin className="h-5 w-5 text-primary" />}
                label="Location"
                value={profile.location || "Bangladesh"}
                gradient="from-primary/20 to-primary/5"
              />
              <InfoTile
                icon={<Calendar className="h-5 w-5 text-accent" />}
                label="Member Since"
                value={
                  profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                    : "—"
                }
                gradient="from-accent/20 to-accent/5"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== UI COMPONENTS ========== */

function InfoTile({ icon, label, value, gradient }: any) {
  return (
    <div className="group relative bg-card/80 backdrop-blur-xl p-6 rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative">
        <div className="mb-3 p-2 bg-background/50 rounded-xl w-fit">
          {icon}
        </div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="font-bold text-foreground text-lg">{value}</p>
      </div>
    </div>
  );
}

function ActionItem({ icon, title, subtitle, iconBg }: any) {
  return (
    <button className="w-full flex items-center gap-4 p-5 hover:bg-muted/50 transition-all duration-200 group">
      <div className={`p-3 ${iconBg} rounded-xl group-hover:scale-110 transition-transform duration-200`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="font-semibold text-foreground mb-0.5">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
    </button>
  );
}

function LoadingState() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-accent/20">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-muted-foreground font-medium">Loading your profile...</p>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-accent/20 px-4">
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
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-xl font-semibold"
        >
          Go to Login
        </Button>
      </div>
    </div>
  );
}