"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Pill,
  ShoppingCart,
  Users,
  FolderTree,
  LogOut,
  Settings,
  User as UserIcon,
} from "lucide-react";

import { useSession } from "@/lib/useSession";
import { authClient } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/* -------------------- Types -------------------- */
interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface User {
  role?: string;
  name?: string;
  email?: string;
  image?: string;
  [key: string]: unknown;
}

/* -------------------- Role-Based Navigation Data -------------------- */
const roleMenus: Record<string, MenuItem[]> = {
  seller: [
    {
      title: "Dashboard",
      url: "/seller/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Medicines",
      url: "/seller/medicines",
      icon: Pill,
    },
    {
      title: "Orders",
      url: "/seller/orders",
      icon: ShoppingCart,
    },
  ],
  admin: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: FolderTree,
    },
  ],
};

/* -------------------- Helper Functions -------------------- */
const getInitials = (name?: string, email?: string): string => {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "U";
};

const getRoleBadgeColor = (role?: string): string => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
    case "seller":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
  }
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data, isPending } = useSession();
  const user = data?.user as User | undefined;
  const role = user?.role?.toLowerCase();

  // Get menu items based on role
  const menuItems = role ? roleMenus[role] ?? [] : [];

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Sidebar {...props}>
      {/* Header with Logo */}
      <SidebarHeader className="border-b px-6 py-4 bg-gradient-to-r from-primary/5 to-primary/10">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Image
            src="https://i.postimg.cc/Bv1xhwD0/logo.png"
            alt="MediStore Logo"
            width={60}
            height={30}
            priority
            className="object-contain"
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg">MediStore</span>
            {role && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full w-fit ${getRoleBadgeColor(
                  role
                )}`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            )}
          </div>
        </Link>
      </SidebarHeader>

      {/* Main Navigation Content */}
      <SidebarContent className="px-3 py-4">
        {isPending ? (
          <SidebarGroup>
            <SidebarGroupContent className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ) : menuItems.length > 0 ? (
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.url ||
                    pathname.startsWith(item.url + "/");

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link
                          href={item.url}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm font-medium"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <SidebarGroup>
            <SidebarGroupContent className="px-4 py-6">
              <div className="text-center space-y-2">
                <UserIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No menu items available
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Please contact support if you think this is an error
                </p>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* User Profile Footer */}
      <SidebarFooter className="border-t p-4">
        {isPending ? (
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-2 py-6 h-auto hover:bg-accent"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.image} alt={user.name || "User"} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <span className="text-sm font-medium truncate w-full">
                    {user.name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate w-full">
                    {user.email}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 cursor-pointer focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="text-center py-4">
            <Link href="/login">
              <Button variant="default" className="w-full">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}