"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import Loading from "@/app/loading";
import { 
  Users, ShoppingBag, Pill, Activity, TrendingUp, 
  UsersRound, Store, ArrowUpRight, Zap, BarChart3, 
  CalendarDays, ShieldCheck
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "radix-ui";
// import { Progress } from "../../../../../components/ui/progress"; // Ensure you have this shadcn component

export default function AdminDashboard() {
  // 1. Concurrent Data Fetching
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => api.get("/admin/users").then(res => res.data.data),
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => api.get("/admin/orders").then(res => res.data.data),
  });

  const { data: medicines, isLoading: medsLoading } = useQuery({
    queryKey: ["admin-medicines"],
    queryFn: () => api.get("/admin/medicines").then(res => res.data.data),
  });

  if (usersLoading || ordersLoading || medsLoading) return <Loading />;

  // 2. FIXED ANALYTICS LOGIC (Matching your JSON)
  const stats = {
    totalUsers: users?.length || 0,
    // Matching "user" and "seller" from your provided JSON
    customers: users?.filter((u: any) => u.role === "user").length || 0,
    sellers: users?.filter((u: any) => u.role === "seller").length || 0,
    admins: users?.filter((u: any) => u.role === "admin").length || 0,
    
    totalMeds: medicines?.length || 0,
    totalOrders: orders?.length || 0,
    revenue: orders?.reduce((acc: number, curr: any) => acc + parseFloat(curr.totalAmount), 0) || 0,
    pendingOrders: orders?.filter((o: any) => o.status === "PLACED").length || 0,
  };

  // Calculate Ratio Percentage for Progress Bar
  const customerPercentage = stats.totalUsers > 0 
    ? (stats.customers / (stats.customers + stats.sellers)) * 100 
    : 0;

  return (
    <div className="p-6 lg:p-10 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
            <Activity className="h-10 w-10 text-emerald-500" /> Executive Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">System health report as of {new Date().toLocaleDateString()}</p>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 py-2 px-4 rounded-xl font-bold">
          <ShieldCheck className="w-4 h-4 mr-2" /> All Systems Operational
        </Badge>
      </div>

      {/* PRIMARY KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <KPICard title="Platform Users" value={stats.totalUsers} icon={<Users />} color="blue" />
        <KPICard title="Active Meds" value={stats.totalMeds} icon={<Pill />} color="rose" />
        <KPICard title="Total Orders" value={stats.totalOrders} icon={<ShoppingBag />} color="emerald" />
        <KPICard title="Gross Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={<TrendingUp />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FIXED USER BASE CARD */}
        <Card className="lg:col-span-1 rounded-[2.5rem] border-none shadow-sm bg-white dark:bg-slate-900">
            <CardHeader>
                <CardTitle className="text-xl font-black tracking-tight">User Base Distribution</CardTitle>
                <CardDescription>Ratio of Customers to Sellers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Visual Ratio Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                        <span>Customers ({stats.customers})</span>
                        <span>Sellers ({stats.sellers})</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <UserStatRow 
                        label="Registered Customers" 
                        count={stats.customers} 
                        icon={<UsersRound className="text-blue-600" />} 
                        bg="bg-blue-500/10" 
                    />
                    <UserStatRow 
                        label="Verified Sellers" 
                        count={stats.sellers} 
                        icon={<Store className="text-purple-600" />} 
                        bg="bg-purple-500/10" 
                    />
                    <UserStatRow 
                        label="Platform Admins" 
                        count={stats.admins} 
                        icon={<Activity className="text-amber-600" />} 
                        bg="bg-amber-500/10" 
                    />
                </div>
            </CardContent>
        </Card>

        {/* SYSTEM PERFORMANCE */}
        <Card className="lg:col-span-2 rounded-[2.5rem] border-none shadow-sm bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-black tracking-tight">Marketplace Activity</CardTitle>
                    <CardDescription>Critical fulfillment and listing metrics</CardDescription>
                </div>
                <BarChart3 className="h-6 w-6 text-slate-300" />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 border dark:border-slate-800 rounded-[2rem] bg-slate-50/50 dark:bg-slate-800/30">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Orders to Process</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-slate-900 dark:text-white">{stats.pendingOrders}</span>
                            <span className="text-amber-500 font-bold text-sm">Action Required</span>
                        </div>
                    </div>

                    <div className="p-8 border dark:border-slate-800 rounded-[2rem] bg-emerald-500/[0.03] border-emerald-500/10">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Average Order Value</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-emerald-600">
                                ${stats.totalOrders > 0 ? (stats.revenue / stats.totalOrders).toFixed(0) : 0}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-slate-400" />
                    <p className="text-xs font-bold text-slate-500">
                        Data synchronized with production server. Last poll: {new Date().toLocaleTimeString()}
                    </p>
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}

// --- Helper Components ---

function KPICard({ title, value, icon, color }: { title: string, value: any, icon: any, color: string }) {
    const colors: any = {
        blue: "bg-blue-500/10 text-blue-600",
        rose: "bg-rose-500/10 text-rose-600",
        emerald: "bg-emerald-500/10 text-emerald-600",
        amber: "bg-amber-500/10 text-amber-600",
    };
    return (
        <Card className="rounded-[2rem] border-none shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-7">
                <div className={`${colors[color]} h-12 w-12 rounded-2xl flex items-center justify-center mb-4`}>
                    {React.cloneElement(icon, { className: "h-6 w-6" })}
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</p>
            </CardContent>
        </Card>
    );
}

function UserStatRow({ label, count, icon, bg }: { label: string, count: number, icon: any, bg: string }) {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/40 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
            <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center`}>{icon}</div>
                <span className="font-bold text-sm text-slate-600 dark:text-slate-300">{label}</span>
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white">{count}</span>
        </div>
    );
}