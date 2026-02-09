"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useSession } from "@/lib/useSession";

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

/* -------------------- Types -------------------- */
interface MenuItem {
  title: string;
  url: string;
}

interface NavbarProps {
  className?: string;
}

interface User {
  role?: string;
  [key: string]: unknown;
}

/* -------------------- Public Menu -------------------- */
const publicMenu: MenuItem[] = [
  { title: "Home", url: "/" },
  { title: "Shop", url: "/shop" },
  { title: "Blog", url: "/blog" },
  { title: "Contact", url: "/contact" },
];

/* -------------------- Role Based Menu -------------------- */
const roleMenus: Record<string, MenuItem[]> = {
  user: [
    { title: "Cart", url: "/cart" },
    { title: "My Orders", url: "/orders" },
  ],
  seller: [
    { title: "Dashboard", url: "/seller/dashboard" },
    { title: "Medicines", url: "/seller/medicines" },
    { title: "Orders", url: "/seller/orders" },
  ],
  admin: [
    { title: "Dashboard", url: "/admin" },
    { title: "Users", url: "/admin/users" },
    { title: "Orders", url: "/admin/orders" },
    { title: "Categories", url: "/admin/categories" },
  ],
};

const Navbar = ({ className }: NavbarProps) => {
  const { data, isPending } = useSession();
  const user = data?.user;
  const role = (user as User)?.role;

  const dashboardMenu = role ? roleMenus[role] ?? [] : [];

  const handleLogout = async () => {
    await authClient.signOut();
  };

  return (
    <section className={cn("border-b py-4", className)}>
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
                height={20}
                priority
              />
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                {publicMenu.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.url}
                        className="inline-flex h-10 items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-muted"
                      >
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}

                {!isPending &&
                  user &&
                  dashboardMenu.map((item) => (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.url}
                          className="inline-flex h-10 items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-muted"
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

            {!isPending && !user && (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}

            {!isPending && user && (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/profile">Profile</Link>
                </Button>
                <Button size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
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
                height={20}
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
                  <Accordion type="single" collapsible>
                    {publicMenu.map((item) => (
                      <Link
                        key={item.title}
                        href={item.url}
                        className="text-md font-semibold"
                      >
                        {item.title}
                      </Link>
                    ))}

                    {!isPending &&
                      user &&
                      dashboardMenu.map((item) => (
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

                    {!isPending && !user && (
                      <>
                        <Button asChild variant="outline">
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild>
                          <Link href="/signup">Sign up</Link>
                        </Button>
                      </>
                    )}

                    {!isPending && user && (
                      <>
                        <Button asChild variant="outline">
                          <Link href="/profile">Profile</Link>
                        </Button>
                        <Button onClick={handleLogout}>Logout</Button>
                      </>
                    )}
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
