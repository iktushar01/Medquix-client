"use client";

import React from "react";
import { 
  Gavel, 
  ShoppingBag, 
  Truck, 
  AlertTriangle, 
  FileCheck, 
  Ban, 
  CreditCard,
  History
} from "lucide-react";

export default function TermsAndConditions() {
  const sections = [
    {
      id: "eligibility",
      icon: <FileCheck className="h-5 w-5" />,
      title: "Eligibility & Registration",
      content: "Users must be at least 18 years old to create an account. Sellers must provide a valid Drug License and Trade License. MediStore reserves the right to reject any pharmacy registration that does not meet local health authority standards."
    },
    {
      id: "orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      title: "Orders & Pricing",
      content: "All prices are listed in BDT and include applicable taxes unless stated otherwise. While we strive for accuracy, MediStore is not responsible for pricing errors set by individual Sellers. Orders are confirmed only after Seller acceptance."
    },
    {
      id: "medicine",
      icon: <AlertTriangle className="h-5 w-5" />,
      title: "OTC Medicine Policy",
      content: "MediStore only facilitates the sale of Over-The-Counter (OTC) medicines. We strictly prohibit the sale of prescription-only narcotics or regulated substances. Users agree to consult a doctor before consuming any medication."
    },
    {
      id: "returns",
      icon: <History className="h-5 w-5" />,
      title: "Returns & Refunds",
      content: "Due to the sensitive nature of healthcare products, returns are only accepted if the medicine is expired, tampered with, or incorrect at the time of delivery. Claims must be made within 24 hours of receipt."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* 1. HERO HEADER */}
      <section className="relative py-20 bg-slate-50 dark:bg-slate-900/50 border-b overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
          <Gavel className="w-96 h-96 mx-auto mt-10 text-emerald-500" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <Badge text="Effective Date: February 10, 2026" />
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-6 mb-4">
            Terms & <span className="text-emerald-500">Conditions</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg">
            Please read these terms carefully before using the MediStore platform. By accessing our services, you agree to be bound by these legal guidelines.
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
            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    Welcome to MediStore. These Terms and Conditions govern your use of our website and mobile application. We operate as a marketplace connecting licensed pharmacies (Sellers) with individual buyers (Customers).
                </p>
            </div>

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
              </div>
            ))}

            {/* Prohibited Actions Card */}
            <div className="p-8 rounded-3xl bg-red-600 text-white shadow-xl shadow-red-500/20 relative overflow-hidden">
              <Ban className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10 rotate-12" />
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Ban className="h-6 w-6" /> Prohibited Use
              </h3>
              <ul className="space-y-3 opacity-90 list-disc list-inside">
                <li>Listing counterfeit or expired medical products.</li>
                <li>Creating multiple accounts to manipulate medicine reviews.</li>
                <li>Attempting to bypass our secure payment system.</li>
                <li>Using the platform for any illegal drug distribution.</li>
              </ul>
            </div>

            {/* Termination Clause */}
            <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <History className="h-5 w-5 text-emerald-500" /> Account Termination
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                MediStore reserves the right to suspend or terminate accounts that violate these terms, specifically targeting Sellers who provide low-quality items or Customers who engage in fraudulent Cash-on-Delivery cancellations.
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