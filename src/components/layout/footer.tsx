"use client";

import React from "react";
import Link from "next/link";
import {
  Pill,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  Phone,
  Mail,
  ShieldCheck,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-900/50 border-t pt-20 pb-10">
      <div className="container mx-auto px-6">

        {/* 1. TOP SECTION: BRAND & NEWSLETTER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
                <Pill className="text-white h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                Med<span className="text-emerald-600">Quix</span>
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Your trusted partner in healthcare. Providing safe, reliable, and fast
              delivery of OTC medicines across Bangladesh since 2026.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Facebook />} />
              <SocialIcon icon={<Twitter />} />
              <SocialIcon icon={<Instagram />} />
              <SocialIcon icon={<Linkedin />} />
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold italic">Join our Newsletter</h3>
                <p className="text-sm text-slate-500">Get health tips and medicine stock alerts.</p>
              </div>
              <div className="flex w-full md:w-auto gap-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-slate-50 dark:bg-slate-800 border-none h-12 md:w-64 rounded-xl"
                />
                <Button className="bg-emerald-600 hover:bg-emerald-700 h-12 px-6 rounded-xl">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. LINK GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <FooterLinkGroup
            title="Shop"
            links={[
              { label: "All Medicines", href: "/shop" },
              { label: "Personal Care", href: "/shop?cat=personal" },
              { label: "Vitamins", href: "/shop?cat=vitamins" },
              { label: "First Aid", href: "/shop?cat=firstaid" },
            ]}
          />
          <FooterLinkGroup
            title="Sellers"
            links={[
              { label: "Become a Seller", href: "/register" },
              { label: "Seller Dashboard", href: "/dashboard" },
              { label: "Seller Guidelines", href: "/terms" },
              { label: "Drug License Info", href: "/support" },
            ]}
          />
          <FooterLinkGroup
            title="Company"
            links={[
              { label: "About Us", href: "/about" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Support Center", href: "/support" },
            ]}
          />
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 group">
                <Phone className="h-4 w-4 text-emerald-500" />
                <span className="group-hover:text-emerald-500 transition-colors">+880 1234-567890</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 group">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span className="group-hover:text-emerald-500 transition-colors">support@MedQuix.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. BOTTOM BAR */}
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500">
            © {currentYear} MedQuix. Built for a healthier tomorrow.
          </p>

          <div className="flex items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Verified Pharmacy</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* --- Sub-Components --- */

function FooterLinkGroup({ title, links }: { title: string, links: { label: string, href: string }[] }) {
  return (
    <div className="space-y-6">
      <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs">{title}</h4>
      <ul className="space-y-4">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              href={link.href}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon }: { icon: any }) {
  return (
    <Link
      href="#"
      className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 border flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all"
    >
      {React.cloneElement(icon, { size: 18 })}
    </Link>
  );
}