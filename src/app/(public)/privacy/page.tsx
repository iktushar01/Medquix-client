"use client";

import React from "react";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileText, 
  UserCheck, 
  Database, 
  Bell,
  Scale
} from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      id: "collection",
      icon: <Database className="h-5 w-5" />,
      title: "Data We Collect",
      content: "We collect personal information such as your name, email address, and shipping details when you register as a Customer or Seller. For Sellers, we also collect pharmacy license numbers to ensure platform safety."
    },
    {
      id: "usage",
      icon: <Eye className="h-5 w-5" />,
      title: "How We Use Data",
      content: "Your data is used to process orders, verify pharmacy credentials, and provide real-time order tracking. We do not sell your personal health interests to third-party advertisers."
    },
    {
      id: "security",
      icon: <Lock className="h-5 w-5" />,
      title: "Security Measures",
      content: "MedQuix uses industry-standard 256-bit encryption for all data transmissions. Your payment information is handled via secure, PCI-compliant gateways and is never stored on our local servers."
    },
    {
      id: "rights",
      icon: <UserCheck className="h-5 w-5" />,
      title: "Your Rights",
      content: "You have the right to request a copy of your data, update your pharmacy listings, or delete your account at any time. Customers can also opt-out of promotional newsletters via their profile settings."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* 1. HERO HEADER */}
      <section className="relative py-20 bg-slate-50 dark:bg-slate-900/50 border-b overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
          <ShieldCheck className="w-96 h-96 mx-auto mt-10 text-emerald-500" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <Badge text="Last Updated: February 10, 2026" />
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-6 mb-4">
            Privacy <span className="text-emerald-500">Policy</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg">
            At MedQuix, we take your healthcare data seriously. This policy explains how we protect your information across our pharmacy network.
          </p>
        </div>
      </section>

      {/* 2. CONTENT GRID */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar Nav (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 h-fit">
            <nav className="space-y-2">
              {sections.map((s) => (
                <a 
                  key={s.id} 
                  href={`#${s.id}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-all font-medium group"
                >
                  <span className="text-slate-400 group-hover:text-emerald-500">{s.icon}</span>
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-16">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg italic">
                  {section.content}
                </p>
                <div className="mt-8 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-500">
                    <strong>Note for Sellers:</strong> Verification data (Drug License, Trade License) is shared only with our internal compliance team and is never made public.
                  </p>
                </div>
              </div>
            ))}

            {/* Cookie Policy Card */}
            <div className="p-8 rounded-3xl bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
              <Bell className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10 rotate-12" />
              <h3 className="text-2xl font-bold mb-4">Cookies & Tracking</h3>
              <p className="opacity-90 leading-relaxed mb-6">
                We use functional cookies to remember your cart items and login session. Analytics cookies help us understand which medicines are most needed in different regions.
              </p>
              <button className="px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-slate-100 transition-colors">
                Manage Cookie Preferences
              </button>
            </div>

            {/* Final Legal Clause */}
            <div className="pt-10 border-t flex items-start gap-4 text-slate-500 italic">
              <Scale className="h-6 w-6 shrink-0" />
              <p className="text-sm">
                MedQuix complies with the Digital Security Act of 2018. Any legal disputes regarding data privacy fall under the jurisdiction of the courts of Bangladesh.
              </p>
            </div>
          </main>

        </div>
      </section>
    </div>
  );
}

/* --- Helper Badge --- */
function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
      {text}
    </span>
  );
}