"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "../ui/modeToggle";

interface MenuItem {
  title: string;
  url: string;
}

interface NavbarProps {
  className?: string;
}

const menu: MenuItem[] = [
  { title: "Home", url: "/" },
  { title: "Shop", url: "/shop" },
  { title: "Blog", url: "/blog" },
  { title: "Contact", url: "/contact" },
];

const Navbar = ({ className }: NavbarProps) => {
  return (
    <section className={cn("py-4 border-b", className)}>
      <div className="container mx-auto">
        {/* ================= DESKTOP ================= */}
        <nav className="hidden items-center justify-between lg:flex">
          {/* Left */}
          <div className="flex items-center gap-6">
            <Link href="/">
              <Image
                src="https://i.postimg.cc/Bv1xhwD0/logo.png"
                alt="MediStore Logo"
                width={80}
                height={10}
                priority
              />
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.url}
                        className="group inline-flex h-10 items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      >
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </nav>

        {/* ================= MOBILE ================= */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between px-3">
            <Link href="/">
              <Image
                src="https://i.postimg.cc/Bv1xhwD0/logo.png"
                alt="MediStore Logo"
                width={60}
                height={150}
                priority
              />
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>

              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>MediStore 💊</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex flex-col gap-4"
                  >
                    {menu.map((item) => (
                      <Link
                        key={item.title}
                        href={item.url}
                        className="text-md font-semibold"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    <ModeToggle />
                    <Button asChild variant="outline">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/signup">Sign up</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Navbar };
