"use client";

import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Send,
  LifeBuoy,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      {/* 1. HERO HEADER */}
      <section className="relative py-20 bg-slate-50 dark:bg-slate-900/50 border-b overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-widest border border-emerald-500/20 mb-6">
            <LifeBuoy className="h-4 w-4" /> Support Center
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            How can we <span className="text-emerald-500 text-glow">help you?</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg">
            Whether you are a customer tracking an order or a seller needing verification help, our team is ready to assist.
          </p>
        </div>
      </section>

      {/* 2. CONTACT OPTIONS GRID */}
      <section className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ContactCard
            icon={<Phone className="h-6 w-6" />}
            title="Call Support"
            detail="+880 1234-567890"
            sub="Available 9am - 9pm"
          />
          <ContactCard
            icon={<Mail className="h-6 w-6" />}
            title="Email Us"
            detail="support@MedQuix.com"
            sub="Response within 24h"
          />
          <ContactCard
            icon={<MapPin className="h-6 w-6" />}
            title="Office"
            detail="Dhaka, Bangladesh"
            sub="Pharmacy Hub, Sector 7"
          />
        </div>
      </section>

      {/* 3. MAIN FORM SECTION */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left: Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Send us a message</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Have a specific question about a medicine or your seller account?
                Fill out the form and our pharmacists or support staff will get back to you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <HelpCircle className="h-6 w-6 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-bold">Check FAQ first</h4>
                  <p className="text-sm text-slate-500">Most questions about delivery and refunds are answered in our help docs.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <Clock className="h-6 w-6 text-blue-500 shrink-0" />
                <div>
                  <h4 className="font-bold">Real-time Tracking</h4>
                  <p className="text-sm text-slate-500">Login to your dashboard to see live updates on your medicine delivery status.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border shadow-2xl shadow-emerald-500/5">
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Full Name</label>
                  <Input placeholder="John Doe" className="bg-slate-50 dark:bg-slate-800 border-none h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Email</label>
                  <Input placeholder="john@example.com" className="bg-slate-50 dark:bg-slate-800 border-none h-12 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Subject</label>
                <Input placeholder="Order Issues / Seller Verification" className="bg-slate-50 dark:bg-slate-800 border-none h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Message</label>
                <Textarea placeholder="How can we help?" className="bg-slate-50 dark:bg-slate-800 border-none min-h-[150px] rounded-xl pt-4" />
              </div>
              <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg gap-2 shadow-xl shadow-emerald-500/20">
                <Send className="h-5 w-5" /> Send Message
              </Button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}

/* --- Helper Component --- */
function ContactCard({ icon, title, detail, sub }: { icon: any, title: string, detail: string, sub: string }) {
  return (
    <div className="p-8 bg-white dark:bg-slate-900 border rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center text-center group hover:border-emerald-500/50 transition-all">
      <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-emerald-600 font-bold mb-1">{detail}</p>
      <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">{sub}</p>
    </div>
  );
}