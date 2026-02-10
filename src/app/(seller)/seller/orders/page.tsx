"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import Loading from "@/app/loading";
import Swal from "sweetalert2";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar,
  Filter,
  ExternalLink,
  ChevronRight
} from "lucide-react";

// Shadcn & Utils
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/* -------------------- Types -------------------- */
type OrderStatus = "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  medicine: {
    name: string;
  };
}

interface Order {
  id: string | number; // Handling both string and number IDs
  status: OrderStatus;
  createdAt: string;
  shippingAddress: string;
  orderItems: OrderItem[];
}

/* -------------------- Main Page Component -------------------- */
export default function SellerOrdersPage() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // 1. Fetch Seller Orders
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["seller-orders"],
    queryFn: async () => {
      const res = await api.get("/seller/orders");
      return res.data.data;
    },
  });

  // 2. Update Status Mutation
  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string | number; status: string }) => {
      const res = await api.patch(`/seller/orders/${orderId}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Status Updated",
        icon: "success",
        toast: true,
        position: "top-end",
        timer: 2500,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
    },
    onError: (error: any) => {
      Swal.fire("Update Failed", error.response?.data?.message || "Something went wrong", "error");
    },
  });

  const handleStatusChange = (orderId: string | number, newStatus: string) => {
    Swal.fire({
      title: "Confirm Update",
      text: `Change order status to ${newStatus}?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#0f172a",
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus({ orderId, status: newStatus });
      }
    });
  };

  if (isLoading) return <Loading />;

  const filteredOrders = orders?.filter(order => 
    filterStatus === "ALL" ? true : order.status === filterStatus
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-transparent pb-10">
      <div className="container mx-auto p-4 lg:p-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Order Management</h1>
            <p className="text-muted-foreground mt-1">Review and process your medicine orders.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
              <Filter className="h-3 w-3" /> Filter Status
            </label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px] bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700">
                <SelectValue placeholder="All Orders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PLACED">Placed</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders List */}
        <div className="grid gap-6">
          {filteredOrders && filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusUpdate={handleStatusChange} 
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 rounded-3xl border-2 border-dashed bg-white/50 dark:bg-slate-900/50">
              <Package className="h-16 w-16 text-slate-200 dark:text-slate-800 mb-4" />
              <p className="text-xl font-semibold text-slate-400">No matching orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Sub-Component: Order Card -------------------- */
function OrderCard({ order, onStatusUpdate }: { order: Order; onStatusUpdate: (id: string | number, s: string) => void }) {
  
  const sellerSubtotal = order.orderItems.reduce((acc, item) => {
    return acc + (Number(item.price) * item.quantity);
  }, 0);

  // Fix for the .slice() error by ensuring ID is a string
  const displayId = String(order.id).slice(-8).toUpperCase();

  return (
    <Card className="overflow-hidden border-none shadow-md ring-1 ring-slate-200 dark:ring-slate-800">
      <CardHeader className="bg-white dark:bg-slate-900 border-b px-6 py-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Order #{displayId}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Earnings</p>
              <p className="text-xl font-black text-primary">৳{sellerSubtotal.toFixed(2)}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 bg-white dark:bg-slate-950">
        <div className="grid lg:grid-cols-5">
          {/* Order Items Section */}
          <div className="lg:col-span-3 p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-tighter">Ordered Medicines</h4>
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 ring-1 ring-slate-100 dark:ring-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                      {item.quantity}x
                    </div>
                    <p className="font-bold text-sm">{item.medicine.name}</p>
                  </div>
                  <p className="font-bold text-sm text-slate-600 dark:text-slate-300">৳{(Number(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics & Actions Section */}
          <div className="lg:col-span-2 p-6 border-t lg:border-t-0 lg:border-l bg-slate-50/30 dark:bg-slate-900/20 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 text-primary" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Ship To</p>
                  <p className="text-sm font-medium leading-tight">{order.shippingAddress}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Separator className="mb-4 opacity-50" />
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-3">Workflow Action</p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" variant="outline" className="flex-1 h-9 rounded-lg"
                  disabled={order.status !== "PLACED"}
                  onClick={() => onStatusUpdate(order.id, "PROCESSING")}
                >
                  Confirm Order
                </Button>
                <Button 
                  size="sm" variant="outline" className="flex-1 h-9 rounded-lg"
                  disabled={order.status !== "PROCESSING"}
                  onClick={() => onStatusUpdate(order.id, "SHIPPED")}
                >
                  Mark Shipped
                </Button>
                <Button 
                  size="sm" className="flex-1 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700"
                  disabled={order.status === "DELIVERED" || order.status === "CANCELLED" || order.status === "PLACED"}
                  onClick={() => onStatusUpdate(order.id, "DELIVERED")}
                >
                  Deliver
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------- Helper: Status Badge -------------------- */
function StatusBadge({ status }: { status: OrderStatus }) {
  const configs = {
    PLACED: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: <Clock className="h-3 w-3" /> },
    PROCESSING: { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: <Package className="h-3 w-3" /> },
    SHIPPED: { color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: <Truck className="h-3 w-3" /> },
    DELIVERED: { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: <CheckCircle2 className="h-3 w-3" /> },
    CANCELLED: { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: <ExternalLink className="h-3 w-3" /> },
  };

  const config = configs[status] || configs.PLACED;

  return (
    <Badge className={cn(config.color, "gap-1.5 px-3 py-1 border-none shadow-none font-bold uppercase text-[10px] tracking-wider")}>
      {config.icon}
      {status}
    </Badge>
  );
}