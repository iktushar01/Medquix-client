"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Package,
  MapPin,
  Calendar,
  ShoppingBag,
  Lock,
  Star,
  MessageSquare,
  AlertCircle,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Loading from "@/app/loading";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MySwal = withReactContent(Swal);

// --- SweetAlert Dark Mode & Toast Helper ---
const getSwalConfig = () => {
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  return {
    background: isDark ? "#121212" : "#fff",
    color: isDark ? "#fff" : "#000",
    confirmButtonColor: "#10b981",
    customClass: {
      popup: isDark ? "border border-white/10 shadow-2xl" : "",
    },
  };
};

// Auto-disappearing Toast Helper
const autoCloseAlert = (title: string, icon: "error" | "success" | "warning") => {
  MySwal.fire({
    ...getSwalConfig(),
    title: title,
    icon: icon,
    timer: 2000, // 2 seconds
    showConfirmButton: false,
    timerProgressBar: true,
    toast: true,
    position: 'top-end',
  });
};

// --- Types ---
interface Review {
  id: number;
  rating: number;
  comment: string;
}

interface OrderItem {
  id: number;
  medicineId: number;
  quantity: number;
  price: string;
  medicine: {
    name: string;
    price: string;
  };
  review?: Review;
}

interface Order {
  id: number;
  totalAmount: string;
  status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shippingAddress: string;
  createdAt: string;
  orderItems: OrderItem[];
}

// --- Auth Helper ---
const getAuthToken = () => {
  if (typeof window === "undefined") return "";
  const possibleKeys = ["better-auth.session_data", "better-auth.session-token", "session", "auth_token"];
  for (const key of possibleKeys) {
    const data = localStorage.getItem(key);
    if (!data) continue;
    try {
      const parsed = JSON.parse(data);
      const token = parsed.session?.token || parsed.token || parsed.sessionToken || (typeof parsed === 'string' ? parsed : "");
      if (token) return token;
    } catch (e) {
      if (data.length > 20) return data;
    }
  }
  return "";
};

export default function MyOrdersPage() {
  const queryClient = useQueryClient();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ orderId: number; medicineId: number } | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // --- Data Fetching ---
  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        credentials: "include",
      });

      if (response.status === 401) throw new Error("UNAUTHORIZED");
      if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || "FETCH_FAILED");
      }

      const result = await response.json();
      return result.data || result;
    },
    retry: 1,
  });

  // --- Review Mutation ---
  const submitReview = useMutation({
    mutationFn: async (payload: { medicineId: number; orderId: number; rating: number; comment: string }) => {
      const token = getAuthToken();
      const res = await fetch(`${BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify({
            ...payload,
            rating: Number(payload.rating),
            comment: payload.comment.trim()
        }),
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to submit review");
      return result;
    },
    onSuccess: () => {
      setIsReviewOpen(false);
      autoCloseAlert("Review Submitted!", "success");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setComment("");
      setRating(5);
    },
    onError: (err: any) => {
      // Auto-disappearing error if user already reviewed
      if (err.message.includes("already reviewed")) {
        setIsReviewOpen(false);
        autoCloseAlert("Already Reviewed!", "error");
      } else {
        autoCloseAlert(err.message, "error");
      }
    },
  });

  const handleOpenReview = (orderId: number, medicineId: number) => {
    setSelectedItem({ orderId, medicineId });
    setIsReviewOpen(true);
  };

  if (isLoading) return <Loading />;
  if (error?.message === "UNAUTHORIZED") return <UnauthorizedUI />;
  if (error) return <ErrorUI message={error.message} />;
  if (!orders || orders.length === 0) return <EmptyOrdersUI />;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pb-20">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        
        <header className="mb-12">
          <p className="text-primary font-bold text-sm tracking-widest uppercase mb-2">User Dashboard</p>
          <h1 className="text-5xl font-black tracking-tight text-foreground">
            My <span className="text-primary italic">Orders</span>
          </h1>
        </header>

        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden border-none shadow-sm bg-card/60 backdrop-blur-xl border border-border/50">
              <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-6">
                  <div className="h-16 w-16 bg-primary rounded-3xl flex items-center justify-center shadow-lg">
                    <Package className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-black text-2xl tracking-tight">#{order.id}</h3>
                      <Badge variant="outline" className={cn("rounded-full px-3 py-0.5 font-bold text-[10px] uppercase", getStatusStyles(order.status))}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="md:text-right">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Amount Paid</p>
                  <p className="text-3xl font-black text-foreground">৳{order.totalAmount}</p>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="items" className="border-none">
                  <AccordionTrigger className="px-8 py-4 text-[11px] font-bold text-primary uppercase tracking-widest bg-primary/5 hover:no-underline">
                    View Details
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pb-10 pt-8 border-t border-dashed border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <h4 className="flex items-center gap-2 text-sm font-black uppercase"><ShoppingBag className="h-4 w-4 text-primary" /> Order Items</h4>
                        <div className="space-y-3">
                          {order.orderItems.map((item) => (
                            <div key={item.id} className="bg-muted/30 p-4 rounded-2xl border border-border/40">
                              <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                  <span className="h-7 w-7 rounded bg-background border flex items-center justify-center font-bold text-xs">{item.quantity}x</span>
                                  <p className="font-bold text-sm">{item.medicine.name}</p>
                                </div>
                                <span className="font-bold text-primary">৳{item.price}</span>
                              </div>
                              {order.status === "DELIVERED" && (
                                <div className="mt-2 pt-4 border-t border-primary/10">
                                  {item.review ? (
                                    <div className="bg-primary/5 p-3 rounded-xl">
                                      <div className="flex gap-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                          <Star key={i} className={cn("h-3 w-3", i < item.review!.rating ? "fill-yellow-400 text-yellow-400" : "text-muted")} />
                                        ))}
                                      </div>
                                      <p className="text-xs italic text-muted-foreground">"{item.review.comment}"</p>
                                    </div>
                                  ) : (
                                    <Button 
                                      variant="outline" size="sm" className="w-full rounded-xl text-xs font-bold gap-2"
                                      onClick={() => handleOpenReview(order.id, item.medicineId)}
                                    >
                                      <MessageSquare className="h-3 w-3" /> Leave a Review
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-6">
                        <h4 className="flex items-center gap-2 text-sm font-black uppercase"><MapPin className="h-4 w-4 text-primary" /> Delivery Address</h4>
                        <div className="bg-primary/[0.03] rounded-3xl p-6 border border-primary/10 text-sm">
                          {order.shippingAddress}
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

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic text-center">Review Medicine</DialogTitle>
            <DialogDescription className="text-center text-xs">
              Tell us about your experience with this medication.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="transition-transform active:scale-90">
                    <Star className={cn("h-10 w-10", rating >= star ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20")} />
                  </button>
                ))}
              </div>
            </div>
            <Textarea 
              placeholder="How was the product?"
              className="rounded-2xl min-h-[120px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button 
              className="w-full rounded-2xl h-14 font-bold"
              disabled={submitReview.isPending || !comment.trim()}
              onClick={() => {
                if (!selectedItem) return;
                
                // Front-end check to prevent double-submit UI glitches
                const isAlreadyDone = orders?.find(o => o.id === selectedItem.orderId)
                  ?.orderItems.find(i => i.medicineId === selectedItem.medicineId)?.review;

                if (isAlreadyDone) {
                  setIsReviewOpen(false);
                  autoCloseAlert("You have already reviewed this.", "warning");
                  return;
                }

                submitReview.mutate({ 
                    medicineId: selectedItem.medicineId, 
                    orderId: selectedItem.orderId, 
                    rating, 
                    comment 
                });
              }}
            >
              {submitReview.isPending ? "Sending..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Helper Components & Styles ---
const getStatusStyles = (status: string) => {
  switch (status) {
    case "PLACED": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "PROCESSING": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "SHIPPED": return "bg-violet-500/10 text-violet-500 border-violet-500/20";
    case "DELIVERED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "CANCELLED": return "bg-destructive/10 text-destructive border-destructive/20";
    default: return "bg-muted text-muted-foreground";
  }
};

function ErrorUI({ message }: { message: string }) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <div className="bg-destructive/10 p-6 rounded-full mb-6">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-8 max-w-md">{message}</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full px-8">
          Try Again
        </Button>
      </div>
    );
}

function UnauthorizedUI() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="bg-background border shadow-xl p-8 rounded-[3rem] mb-6">
        <Lock className="h-16 w-16 text-destructive" />
      </div>
      <h2 className="text-4xl font-black">Login Required</h2>
      <p className="text-muted-foreground mt-2">Please sign in to view your order history.</p>
      <Link href="/login" className="mt-8">
        <Button size="lg" className="rounded-full px-12 h-14 font-bold shadow-lg shadow-primary/25">Sign In</Button>
      </Link>
    </div>
  );
}

function EmptyOrdersUI() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="relative mb-6">
         <ShoppingBag className="h-24 w-24 text-muted/20" />
         <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-8 w-8 text-muted-foreground/40" />
         </div>
      </div>
      <h2 className="text-3xl font-bold tracking-tight">No orders yet</h2>
      <p className="text-muted-foreground mt-2 max-w-sm">When you place an order, it will appear here for you to track and review.</p>
      <Link href="/shop" className="mt-8">
        <Button variant="default" className="rounded-full px-8 h-12 font-bold">Start Shopping</Button>
      </Link>
    </div>
  );
}