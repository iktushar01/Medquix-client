"use client";

import React from "react";
import Link from "next/link";
import {
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
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-900/50 border-t pt-12 md:pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">

        {/* 1. TOP SECTION: BRAND & NEWSLETTER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
          <div className="lg:col-span-4 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <Link href="/">
              <Image
                src="https://i.postimg.cc/Bv1xhwD0/logo.png"
                alt="MedQuix Logo"
                width={120}
                height={30}
                className="brightness-90 dark:brightness-110"
                priority
              />
            </Link>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm text-sm md:text-base">
              Your trusted partner in healthcare. Providing safe, reliable, and fast
              delivery of OTC medicines across Bangladesh since 2026.
            </p>
            <div className="flex gap-3 md:gap-4">
              <SocialIcon icon={<Facebook />} />
              <SocialIcon icon={<Twitter />} />
              <SocialIcon icon={<Instagram />} />
              <SocialIcon icon={<Linkedin />} />
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border shadow-sm flex flex-col xl:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center xl:text-left">
                <h3 className="text-lg md:text-xl font-bold italic">Join our Newsletter</h3>
                <p className="text-sm text-slate-500">Get health tips and medicine stock alerts.</p>
              </div>
              <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-3">
                <Input
                  placeholder="Enter your email"
                  className="bg-slate-50 dark:bg-slate-800 border-none h-12 w-full sm:w-64 rounded-xl"
                />
                <Button className="bg-emerald-600 hover:bg-emerald-700 h-12 px-6 rounded-xl w-full sm:w-auto transition-transform active:scale-95">
                  <span className="mr-2 sm:hidden text-sm">Subscribe</span>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. LINK GRID - Adjusted to 1 col on tiny mobile, 2 on mobile, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-16 border-b pb-12 lg:border-none lg:pb-0">
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
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-[10px] md:text-xs">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 group cursor-pointer">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                    <Phone className="h-4 w-4 text-emerald-500" />
                </div>
                <span className="group-hover:text-emerald-500 transition-colors">+880 1234-567890</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 group cursor-pointer">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                    <Mail className="h-4 w-4 text-emerald-500" />
                </div>
                <span className="group-hover:text-emerald-500 transition-colors">support@MedQuix.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. BOTTOM BAR */}
        <div className="pt-8 flex flex-col lg:flex-row justify-between items-center gap-8">
          <p className="text-xs md:text-sm text-slate-500 text-center lg:text-left order-2 lg:order-1">
            © {currentYear} <span className="font-semibold text-emerald-600">MedQuix</span>. Built for a healthier tomorrow.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 opacity-60 order-1 lg:order-2">
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Verified Pharmacy</span>
            </div>
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Secure Payment</span>
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
    <div className="space-y-4 md:space-y-6 text-center sm:text-left">
      <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-[10px] md:text-xs">{title}</h4>
      <ul className="space-y-3 md:space-y-4">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              href={link.href}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors block py-1 lg:py-0"
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
      className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 border flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all transform hover:-translate-y-1"
    >
      {React.cloneElement(icon, { size: 18 })}
    </Link>
  );
}