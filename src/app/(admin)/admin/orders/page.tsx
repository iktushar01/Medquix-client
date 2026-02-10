"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import Loading from "@/app/loading";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Search, 
  Eye, 
  MapPin, 
  Receipt,
  User,
  ShoppingBag,
  ExternalLink,
  Store,
  Calendar,
  ChevronRight
} from "lucide-react";

// Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

// --- Types ---
interface Medicine {
  name: string;
  manufacturer: string;
  price: string;
  sellerId: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  medicine: Medicine;
}

interface Order {
  id: number;
  customerId: string;
  totalAmount: string;
  status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export default function OrderMonitoringPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await api.get("/admin/orders");
      return res.data.data;
    },
  });

  if (isLoading) return <Loading />;

  const filteredOrders = orders?.filter(order => 
    order.id.toString().includes(searchTerm) || 
    order.shippingAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "DELIVERED": return { color: "emerald", icon: <CheckCircle2 className="h-4 w-4" /> };
      case "PLACED": return { color: "blue", icon: <Clock className="h-4 w-4" /> };
      case "SHIPPED": return { color: "purple", icon: <Truck className="h-4 w-4" /> };
      case "PROCESSING": return { color: "amber", icon: <ShoppingBag className="h-4 w-4" /> };
      default: return { color: "slate", icon: <Package className="h-4 w-4" /> };
    }
  };

  return (
    <div className="p-6 lg:p-10 bg-slate-50/50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      
      {/* 1. Header & Quick Analytics */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="h-12 w-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Package className="h-6 w-6 text-white" />
            </div>
            Order Lab
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Monitoring {orders?.length} transactions across MediStore.</p>
        </div>
        
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border dark:border-slate-800 shadow-sm">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                    placeholder="Search orders..." 
                    className="pl-11 h-11 w-64 border-none bg-transparent focus-visible:ring-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      </div>

      {/* 2. Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
            <TableRow className="hover:bg-transparent border-b dark:border-slate-800">
              <TableHead className="py-6 px-8 font-bold text-slate-400 uppercase text-[11px] tracking-widest">Tracking ID</TableHead>
              <TableHead className="font-bold text-slate-400 uppercase text-[11px] tracking-widest">Customer & Path</TableHead>
              <TableHead className="font-bold text-slate-400 uppercase text-[11px] tracking-widest">Status</TableHead>
              <TableHead className="font-bold text-slate-400 uppercase text-[11px] tracking-widest">Revenue</TableHead>
              <TableHead className="text-right px-8 font-bold text-slate-400 uppercase text-[11px] tracking-widest">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders?.map((order) => {
              const config = getStatusConfig(order.status);
              return (
                <TableRow key={order.id} className="group border-b dark:border-slate-800 hover:bg-slate-50/30 dark:hover:bg-slate-800/30">
                  <TableCell className="py-6 px-8">
                    <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full bg-${config.color}-500 animate-pulse`} />
                        <span className="font-mono font-bold text-slate-900 dark:text-white">MS-{order.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 dark:text-slate-200 uppercase text-xs">{order.customerId.slice(0, 10)}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="h-3 w-3" /> {order.shippingAddress}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`rounded-lg px-2.5 py-1 flex items-center gap-1.5 w-fit border-none font-bold bg-${config.color}-500/10 text-${config.color}-600 dark:text-${config.color}-400`}>
                      {config.icon} {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-black text-slate-900 dark:text-white">${parseFloat(order.totalAmount).toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <Button 
                      onClick={() => setSelectedOrder(order)}
                      className="rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-600 hover:text-white transition-all font-bold gap-2"
                    >
                      Audit <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* 3. PRO VIEW MODAL */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl p-0 border-none bg-white dark:bg-slate-950 overflow-hidden rounded-[2.5rem] shadow-2xl">
          <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
            
            {/* Left Column: Tracking & Status */}
            <div className="md:w-5/12 bg-slate-50 dark:bg-slate-900 p-8 border-r dark:border-slate-800">
                <div className="mb-8">
                    <Badge className="bg-emerald-500 text-white border-none mb-4">Official Receipt</Badge>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">Order #MS-{selectedOrder?.id}</h2>
                    <p className="text-slate-400 text-sm mt-1">Placed on {new Date(selectedOrder?.createdAt || "").toLocaleString()}</p>
                </div>

                <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
                    <TimelineStep icon={<Clock />} title="Order Placed" date={selectedOrder?.createdAt} active />
                    <TimelineStep icon={<Package />} title="Verified" date={selectedOrder?.createdAt} active />
                    <TimelineStep icon={<Truck />} title="Logistics" date={selectedOrder?.status === 'DELIVERED' ? selectedOrder.updatedAt : 'Pending'} active={selectedOrder?.status === 'DELIVERED'} />
                </div>

                <div className="mt-12 p-5 bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold mb-3">
                        <User className="h-4 w-4 text-emerald-500" /> Customer Info
                    </div>
                    <p className="text-xs text-slate-400 break-all font-mono">{selectedOrder?.customerId}</p>
                    <hr className="my-3 dark:border-slate-700" />
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <MapPin className="h-4 w-4" /> {selectedOrder?.shippingAddress}
                    </div>
                </div>
            </div>

            {/* Right Column: Items & Total */}
            <div className="md:w-7/12 p-8 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-xl flex items-center gap-2 text-slate-900 dark:text-white">
                        <ShoppingBag className="h-5 w-5 text-emerald-500" /> Order Items
                    </h3>
                    <span className="text-slate-400 text-sm font-bold">{selectedOrder?.orderItems.length} items</span>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-[300px]">
                    {selectedOrder?.orderItems.map((item) => (
                        <div key={item.id} className="group p-4 rounded-2xl border dark:border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-emerald-600">
                                    {item.medicine.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white capitalize">{item.medicine.name}</p>
                                    <p className="text-[10px] text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                                        <Store className="h-3 w-3" /> Seller: {item.medicine.sellerId.slice(0,8)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-slate-900 dark:text-white">${item.price}</p>
                                <p className="text-xs text-slate-400 font-bold">Qty: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 space-y-3 p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem]">
                    <div className="flex justify-between text-sm text-slate-500">
                        <span>Subtotal</span>
                        <span className="font-bold">${selectedOrder?.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-500">
                        <span>Shipping Fee</span>
                        <span className="font-bold text-emerald-500">FREE</span>
                    </div>
                    <div className="h-[1px] bg-slate-200 dark:border-slate-800 my-2" />
                    <div className="flex justify-between items-center">
                        <span className="font-black text-slate-900 dark:text-white text-lg">Total Paid</span>
                        <span className="text-3xl font-black text-emerald-600 tracking-tighter">${selectedOrder?.totalAmount}</span>
                    </div>
                </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Helper Components ---
function TimelineStep({ icon, title, date, active }: { icon: any, title: string, date?: string, active: boolean }) {
    return (
        <div className={`relative flex items-start gap-4 ${active ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`z-10 h-6 w-6 rounded-full flex items-center justify-center text-[10px] ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                {icon}
            </div>
            <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white leading-none">{title}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase">{date && date !== 'Pending' ? new Date(date).toLocaleDateString() : 'Pending'}</p>
            </div>
        </div>
    );
}