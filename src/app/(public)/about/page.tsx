"use client";

import React from "react";
import { 
  HeartPulse, 
  ShieldCheck, 
  Users, 
  Truck, 
  Target, 
  Award, 
  Activity,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">
      
      {/* 1. HERO SECTION: The Mission */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50 dark:bg-emerald-950/20 -skew-x-12 translate-x-1/4 pointer-events-none -z-10" />
        
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
              <Activity className="h-4 w-4" />
              <span>Redefining Healthcare Access</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Your Health, <br />
              <span className="text-emerald-500 italic">Our Priority.</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              MedQuix is more than just a marketplace; it’s a dedicated ecosystem connecting you to licensed pharmacies. We ensure that genuine medicine is only a click away, delivered with speed and integrity.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl px-8 h-14 text-lg font-bold shadow-lg shadow-emerald-500/20">
                Explore Shop
              </Button>
              <Button variant="outline" className="rounded-2xl px-8 h-14 text-lg font-bold border-slate-200">
                Our Partners
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden border-8 border-white dark:border-slate-900 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=1000&auto=format&fit=crop" 
                alt="Pharmacist working"
                className="w-full aspect-square object-cover"
              />
            </div>
            {/* Floating Stat Card */}
            <div className="absolute -bottom-6 -left-6 z-20 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-2xl text-white">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">100%</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Genuine Meds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE VALUES: Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Built on Trust</h2>
            <p className="text-slate-600 dark:text-slate-400">
              We operate under strict regulatory guidelines to ensure every tablet and tonic delivered via MedQuix meets national safety standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<Target className="h-8 w-8" />}
              title="Verified Sellers"
              description="Every pharmacy on our platform undergoes a rigorous 5-point verification check including Drug License audits."
            />
            <ValueCard 
              icon={<Truck className="h-8 w-8" />}
              title="Express Delivery"
              description="Temperature-controlled logistics to ensure your medicine reaches you in optimal condition, fast."
              active
            />
            <ValueCard 
              icon={<HeartPulse className="h-8 w-8" />}
              title="Patient-First"
              description="We prioritize Over-The-Counter safety and provide clear guidance on medicine usage and expiry."
            />
          </div>
        </div>
      </section>

      {/* 3. IMPACT SECTION */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden text-white">
             {/* Decorative Circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <h2 className="text-4xl font-bold mb-6">Empowering Local Pharmacies</h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  MedQuix provides small and medium-sized licensed pharmacies with the digital tools they need to reach patients across the country, bridging the gap between local expertise and modern convenience.
                </p>
                <div className="space-y-4">
                  <ImpactItem text="Digital Inventory Management" />
                  <ImpactItem text="Secure Payment Settlements" />
                  <ImpactItem text="Verified Patient Outreach" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <StatBox number="500+" label="Partner Pharmacies" />
                <StatBox number="50k+" label="Satisfied Buyers" />
                <StatBox number="100k+" label="Deliveries Made" />
                <StatBox number="24/7" label="Support Hours" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-6">
          <Award className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black mb-8 max-w-2xl mx-auto tracking-tight">
            Ready to experience the future of healthcare?
          </h2>
          <Button className="group bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl px-10 h-16 text-xl font-bold transition-all hover:scale-105">
            Join MedQuix Today
            <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

    </div>
  );
}

/* --- Sub-Components --- */

function ValueCard({ icon, title, description, active = false }: any) {
  return (
    <div className={`p-10 rounded-[2.5rem] transition-all duration-300 ${
      active 
        ? "bg-white dark:bg-slate-800 shadow-xl shadow-slate-200 dark:shadow-none border border-emerald-500/20 translate-y-[-8px]" 
        : "bg-transparent border border-slate-200 dark:border-slate-800"
    }`}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${
        active ? "bg-emerald-500 text-white" : "bg-emerald-500/10 text-emerald-500"
      }`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function ImpactItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-2 rounded-full bg-emerald-500" />
      <span className="font-medium text-slate-300">{text}</span>
    </div>
  );
}

function StatBox({ number, label }: { number: string, label: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl text-center">
      <p className="text-3xl font-black mb-1">{number}</p>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}