"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  MapPin,
  Calendar,
  Clock,
  ShoppingBag,
  Lock,
  AlertCircle,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Loading from "@/app/loading";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  medicine: {
    name: string;
    price: string;
  };
}

interface Order {
  id: number;
  totalAmount: string;
  status: string;
  shippingAddress: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function MyOrdersPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      let token = "";

      if (typeof window !== "undefined") {
        const possibleKeys = [
          "better-auth.session_data",
          "better-auth.session-data",
          "$__better_auth_session",
          "session"
        ];

        for (const key of possibleKeys) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const parsed = JSON.parse(data);
              token = parsed.session?.token || parsed.token || "";
              if (token) break;
            } catch (e) { /* silent fail */ }
          }
        }
      }

      const response = await fetch(`${BASE_URL}/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        credentials: "include",
      });

      if (response.status === 401) throw new Error("UNAUTHORIZED");
      if (!response.ok) throw new Error("FETCH_ERROR");

      const result = await response.json();
      return result.data;
    },
    retry: 1,
  });

  if (isLoading) return <Loading />;

  if (error?.message === "UNAUTHORIZED") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-destructive/20 blur-2xl rounded-full" />
          <div className="relative bg-background border shadow-xl p-6 rounded-3xl">
            <Lock className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Access Restricted</h2>
        <p className="text-muted-foreground mt-3 max-w-xs mx-auto">
          Please sign in to your secure health account to view your order history.
        </p>
        <Link href="/login" className="mt-8">
          <Button size="lg" className="rounded-full px-10 shadow-lg hover:shadow-primary/20 transition-all">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PLACED": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "SHIPPED": return "bg-violet-500/10 text-violet-500 border-violet-500/20";
      case "DELIVERED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "CANCELLED": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex p-6 rounded-full bg-muted mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h2 className="text-2xl font-bold">No orders yet</h2>
        <p className="text-muted-foreground mt-2">Your medical supply history will appear here once you place an order.</p>
        <Link href="/shop" className="mt-8 inline-block">
          <Button variant="outline" className="rounded-full">
            Browse Pharmacy
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
              <div className="h-1 w-8 bg-primary rounded-full" />
              User Dashboard
            </div>
            <h1 className="text-5xl font-black tracking-tight text-foreground">
              My <span className="text-primary italic">Orders</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 bg-background/50 backdrop-blur-md border p-2 rounded-2xl shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Package className="h-5 w-5" />
            </div>
            <div className="pr-4">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Total History</p>
              <p className="font-bold">{orders.length} Orders</p>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 bg-background/60 backdrop-blur-xl border border-white/20">
              
              {/* Main Order Info */}
              <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                    <Package className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-black text-2xl tracking-tight">#{order.id}</h3>
                      <Badge variant="outline" className={cn("rounded-full px-3 py-0.5 font-bold text-[10px] tracking-widest uppercase", getStatusStyles(order.status))}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(order.createdAt).toLocaleDateString("en-GB")}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 pt-6 md:pt-0">
                  <div className="md:text-right">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Amount Paid</p>
                    <p className="text-3xl font-black text-foreground tabular-nums tracking-tighter">৳{order.totalAmount}</p>
                  </div>
                 
                </div>
              </div>

              {/* Expansion Area */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="items" className="border-none">
                  <AccordionTrigger className="px-8 py-4 hover:no-underline text-[11px] font-bold text-primary uppercase tracking-[0.2em] bg-primary/5 hover:bg-primary/10 transition-colors">
                    Expand Details
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pb-10 pt-8 border-t border-dashed">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      
                      {/* Left: Items */}
                      <div className="space-y-6">
                        <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider">
                          <ShoppingBag className="h-4 w-4 text-primary" />
                          Order Items
                        </h4>
                        <div className="space-y-3">
                          {order.orderItems.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-muted/30 p-4 rounded-2xl border border-white/10 group/item hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="h-8 w-8 rounded-lg bg-background border flex items-center justify-center font-bold text-xs">
                                  {item.quantity}x
                                </div>
                                <p className="font-bold text-sm">{item.medicine.name}</p>
                              </div>
                              <span className="font-mono font-bold text-sm text-primary">৳{item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Shipping */}
                      <div className="space-y-6">
                        <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider">
                          <MapPin className="h-4 w-4 text-primary" />
                          Shipping To
                        </h4>
                        <div className="bg-gradient-to-br from-primary/[0.07] to-transparent rounded-3xl p-6 border border-primary/10">
                          <p className="text-sm font-semibold leading-relaxed text-foreground/80">
                            {order.shippingAddress}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Secure Delivery In Progress</span>
                        </div>
                      </div>

                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function TruckIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5h-4v5a1 1 0 0 0 1 1Z"/><path d="M16 8h3.3a2 2 0 0 1 1.8 1.1l2.4 4.9"/><circle cx="7.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
}