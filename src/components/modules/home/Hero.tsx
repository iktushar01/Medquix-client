"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function SimpleHero() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium">
            ✨ Digital pharmacy, reimagined
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto">
              Medicine shopping made <span className="text-primary">simple.</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Verified medicines, transparent pricing, and fast delivery. 
              Everything you need for your health, all in one place.
            </p>
          </div>

          {/* Clean CTA Group */}
          <div className="flex flex-col gap-3 sm:flex-row justify-center">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/shop">
                Explore Medicines <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link href="/how-it-works">Learn More</Link>
            </Button>
          </div>

          {/* Visual Element: Simple Mockup or Image */}
          <div className="relative w-full max-w-5xl mt-8 pt-8">
             <div className="aspect-video relative overflow-hidden rounded-xl border bg-muted/50 shadow-2xl">
                <Image
                  src="https://i.postimg.cc/MZ33FL7T/Pharmacist-Handing-Medication-to-Senior-Customer-jpg.webp"
                  alt="Pharmacy App Preview"
                  fill
                  className="object-cover opacity-90"
                  priority
                />
                {/* Subtle overlay for text readability if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}