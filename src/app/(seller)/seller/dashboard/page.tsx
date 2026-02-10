"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import Loading from "@/app/loading";
import Swal from "sweetalert2";
import { 
  Package, Truck, CheckCircle2, Clock, MapPin, 
  AlertCircle, TrendingUp, DollarSign, Pill, 
  Edit, Trash2, Plus, Search, Filter 
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";

/* -------------------- Helper Components -------------------- */

interface StatCardProps {
  title: string;
  value: string | number | undefined;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card className="border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value ?? 0}</h3>
        </div>
        <div className={cn("p-3 rounded-xl bg-slate-50 dark:bg-slate-900", color)}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function AlertBox({ type, message }: { type: "warning" | "error"; message: string }) {
  const styles = type === "error" 
    ? "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400" 
    : "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400";
  return (
    <div className={cn("flex items-center gap-3 p-4 rounded-xl border", styles)}>
      <AlertCircle className="h-5 w-5 shrink-0" />
      <p className="text-sm font-bold">{message}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PLACED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    PROCESSING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    SHIPPED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    DELIVERED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  };
  return (
    <Badge className={cn(styles[status] || "bg-slate-100", "border-none shadow-none")}>
      {status}
    </Badge>
  );
}

/* -------------------- Main Dashboard Page -------------------- */
export default function SellerDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["seller-dashboard"],
    queryFn: async () => {
      const res = await api.get("/seller/dashboard-summary");
      return res.data.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-transparent p-4 lg:p-8 space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">Seller Dashboard</h1>
          <p className="text-muted-foreground italic">Review your sales and inventory at a glance.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
           <Plus className="h-4 w-4" /> Add New Medicine
        </Button>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value={`৳${dashboardData?.revenue}`} 
          icon={<DollarSign className="h-6 w-6" />} 
          color="text-emerald-600" 
        />
        <StatCard 
          title="Active Orders" 
          value={dashboardData?.activeOrders} 
          icon={<TrendingUp className="h-6 w-6" />} 
          color="text-blue-600" 
        />
        <StatCard 
          title="Medicines Listed" 
          value={dashboardData?.totalMedicines} 
          icon={<Pill className="h-6 w-6" />} 
          color="text-purple-600" 
        />
        <StatCard 
          title="Low Stock" 
          value={dashboardData?.lowStockCount} 
          icon={<AlertCircle className="h-6 w-6" />} 
          color="text-red-600" 
        />
      </div>

      {/* ALERTS */}
      {(dashboardData?.lowStockCount > 0 || dashboardData?.expiredCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardData?.lowStockCount > 0 && (
            <AlertBox 
              type="warning" 
              message={`${dashboardData.lowStockCount} medicines are running low on stock!`} 
            />
          )}
          {dashboardData?.expiredCount > 0 && (
            <AlertBox 
              type="error" 
              message={`${dashboardData.expiredCount} items have reached their expiry date.`} 
            />
          )}
        </div>
      )}

      {/* TABS FOR ORDERS & INVENTORY */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="bg-white dark:bg-slate-900 border p-1 rounded-xl">
          <TabsTrigger value="orders" className="rounded-lg">Orders Overview</TabsTrigger>
          <TabsTrigger value="inventory" className="rounded-lg">Inventory Management</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card className="border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search Order ID..." 
                    className="pl-9 w-64 h-9" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData?.recentOrders?.length > 0 ? (
                    dashboardData.recentOrders.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs font-bold">#{String(order.id).slice(-6).toUpperCase()}</TableCell>
                        <TableCell className="font-medium">{order.medicineName}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell><StatusBadge status={order.status} /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8">View</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No recent orders</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card className="border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Medicine Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData?.inventory?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-bold">{item.name}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-2 py-1 rounded-md text-xs font-bold",
                          item.stock < 10 ? "bg-red-100 text-red-700 dark:bg-red-900/30" : "bg-slate-100 text-slate-700 dark:bg-slate-800"
                        )}>
                          {item.stock} units
                        </span>
                      </TableCell>
                      <TableCell>৳{item.price}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{item.expiryDate}</TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600"><Edit className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}