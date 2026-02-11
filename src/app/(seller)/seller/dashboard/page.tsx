"use client";
import React, { useEffect, useState } from "react";
import { 
  Package, AlertCircle, DollarSign, Activity, 
  TrendingUp, ArrowUpRight, ClipboardList, Layers 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, AreaChart, Area 
} from "recharts";

// Interfaces for Type Safety
interface Medicine {
  id: number;
  name: string;
  price: string;
  stock: number;
  manufacturer: string | null;
  category: { name: string };
  isActive: boolean;
}

export default function ModernSellerDashboard() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/medicines`);
        const result = await res.json();
        if (result.success) setMedicines(result.data);
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalStock = medicines.reduce((acc, curr) => acc + curr.stock, 0);
  const totalValue = medicines.reduce((acc, curr) => acc + (parseFloat(curr.price) * curr.stock), 0);
  const lowStock = medicines.filter(m => m.stock < 100);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-6 lg:p-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* --- Header --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              PharmaPulse AI
            </h1>
            <p className="text-muted-foreground font-medium">Inventory Intelligence & Analytics</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:opacity-80 transition-all border border-border">
              Export PDF
            </button>
            
          </div>
        </header>

        {/* --- Top Stats --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Revenue Potential" value={`$${totalValue.toLocaleString()}`} trend="+12.5%" icon={<DollarSign className="text-primary" />} />
          <StatCard title="Active SKUs" value={medicines.length} trend="Live" icon={<Layers className="text-blue-500" />} />
          <StatCard title="Total Inventory" value={totalStock} trend="Units" icon={<Package className="text-orange-500" />} />
          <StatCard title="Stock Alerts" value={lowStock.length} trend="Critical" icon={<AlertCircle className="text-destructive" />} isAlert={lowStock.length > 0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- Main Analysis Chart --- */}
          <section className="lg:col-span-8 bg-card border border-border rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Activity size={20} className="text-primary" /> Stock Variance Analysis
              </h3>
              <select className="bg-muted text-xs font-bold p-2 rounded-lg border-none focus:ring-1 focus:ring-primary">
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
              </select>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={medicines}>
                  <defs>
                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" hide />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}
                    itemStyle={{ color: 'var(--primary)' }}
                  />
                  <Area type="monotone" dataKey="stock" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorStock)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* --- Critical Stock List --- */}
          <section className="lg:col-span-4 bg-card border border-border rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Action Required</h3>
            <div className="space-y-4">
              {lowStock.length > 0 ? (
                lowStock.map(med => (
                  <div key={med.id} className="group flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive font-bold text-xs">
                        {med.stock}
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-tight">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.manufacturer}</p>
                      </div>
                    </div>
                    <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm italic">All stock levels are healthy.</p>
              )}
            </div>
          </section>

        </div>

        {/* --- Modern Table Section --- */}
        <section className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="p-8 border-b border-border flex justify-between items-center">
            <h3 className="text-xl font-bold">Inventory Catalog</h3>
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Live Updates</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-muted-foreground text-xs uppercase tracking-widest bg-muted/30">
                  <th className="px-8 py-5 font-semibold">Medicine</th>
                  <th className="px-8 py-5 font-semibold">Category</th>
                  <th className="px-8 py-5 font-semibold text-right">Price</th>
                  <th className="px-8 py-5 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {medicines.map((med) => (
                  <tr key={med.id} className="group hover:bg-accent/50 transition-colors cursor-pointer">
                    <td className="px-8 py-6">
                      <div className="font-bold text-foreground group-hover:text-primary transition-colors">{med.name}</div>
                      <div className="text-xs text-muted-foreground">{med.manufacturer || "N/A"}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-medium px-3 py-1 bg-secondary rounded-full border border-border">
                        {med.category.name}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-mono font-bold text-primary">
                      ${parseFloat(med.price).toFixed(2)}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`h-2 w-2 rounded-full ${med.isActive ? 'bg-primary shadow-[0_0_8px_var(--primary)]' : 'bg-muted'}`}></span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

// --- Internal Modern Components ---
function StatCard({ title, value, trend, icon, isAlert = false }: any) {
  return (
    <div className={`p-6 rounded-3xl bg-card border ${isAlert ? 'border-destructive/30 shadow-[0_0_20px_-10px_var(--destructive)]' : 'border-border'} transition-all hover:translate-y-[-4px]`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-muted rounded-2xl">
          {icon}
        </div>
        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${isAlert ? 'bg-destructive text-white' : 'bg-primary/10 text-primary'}`}>
          {trend}
        </span>
      </div>
      <p className="text-muted-foreground text-sm font-semibold">{title}</p>
      <h2 className="text-3xl font-black mt-1 tracking-tighter">{value}</h2>
    </div>
  );
}