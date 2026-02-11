"use client";
import React, { useEffect, useState } from "react";
import { 
  Package, AlertCircle, DollarSign, Activity, 
  ArrowUpRight, Layers 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from "recharts";

// Correct PDF Imports to avoid "not a function" errors
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  // --- PDF Export Logic with MedQuix Branding ---
  const exportToPDF = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    // 1. Top Emerald Accent Bar
    doc.setFillColor(16, 185, 129); 
    doc.rect(0, 0, 210, 15, "F"); 

    // 2. MedQuix Branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(30, 30, 30);
    doc.text("MedQuix", 14, 32);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("PHARMAPULSE INVENTORY INTELLIGENCE", 14, 39);

    // 3. Metadata (Right Aligned)
    doc.setFontSize(9);
    doc.text(`Report Date: ${timestamp}`, 196, 32, { align: "right" });
    doc.text(`System Status: Active`, 196, 37, { align: "right" });

    // 4. Horizontal Separator
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 45, 196, 45);

    // 5. Prepare Table Data
    const tableColumn = ["ID", "Medicine Name", "Category", "Manufacturer", "Stock", "Unit Price"];
    const tableRows = medicines.map((med) => [
      med.id,
      med.name,
      med.category.name,
      med.manufacturer || "N/A",
      med.stock,
      `$${parseFloat(med.price).toFixed(2)}`
    ]);

    // 6. Generate Table (Using autoTable function directly)
    autoTable(doc, {
      startY: 52,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { 
        fillColor: [16, 185, 129], 
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        fontSize: 9,
        cellPadding: 4
      },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        // Footer branding on every page
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          "MedQuix - Confidential Inventory Report | Page " + data.pageCount,
          14,
          doc.internal.pageSize.height - 10
        );
      }
    });

    // 7. Save file
    doc.save(`MedQuix_Inventory_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const totalStock = medicines.reduce((acc, curr) => acc + curr.stock, 0);
  const totalValue = medicines.reduce((acc, curr) => acc + (parseFloat(curr.price) * curr.stock), 0);
  const lowStock = medicines.filter(m => m.stock < 100);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* --- Header --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-emerald-600 to-teal-400 bg-clip-text text-transparent">
              PharmaPulse AI
            </h1>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs mt-1">
              Powered by MedQuix Intelligence
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={exportToPDF}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 active:scale-95"
            >
              Export PDF
            </button>
          </div>
        </header>

        {/* --- Stats --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Revenue Potential" value={`$${totalValue.toLocaleString()}`} trend="+12.5%" icon={<DollarSign className="text-emerald-500" />} />
          <StatCard title="Active SKUs" value={medicines.length} trend="Live" icon={<Layers className="text-blue-500" />} />
          <StatCard title="Total Inventory" value={totalStock} trend="Units" icon={<Package className="text-orange-500" />} />
          <StatCard title="Stock Alerts" value={lowStock.length} trend="Critical" icon={<AlertCircle className="text-red-500" />} isAlert={lowStock.length > 0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- Analysis Chart --- */}
          <section className="lg:col-span-8 bg-card border border-border rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Activity size={20} className="text-emerald-500" /> Stock Variance
              </h3>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={medicines}>
                  <defs>
                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" hide />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="stock" stroke="#10b981" strokeWidth={3} fill="url(#colorStock)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* --- Critical List --- */}
          <section className="lg:col-span-4 bg-card border border-border rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Action Required</h3>
            <div className="space-y-4">
              {lowStock.length > 0 ? (
                lowStock.map(med => (
                  <div key={med.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-emerald-500/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 font-bold text-xs">
                        {med.stock}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.manufacturer}</p>
                      </div>
                    </div>
                    <ArrowUpRight size={16} className="text-muted-foreground" />
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm italic">All stock levels healthy.</p>
              )}
            </div>
          </section>
        </div>

        {/* --- Catalog Table --- */}
        <section className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="p-8 border-b border-border flex justify-between items-center">
            <h3 className="text-xl font-bold">Inventory Catalog</h3>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Sync</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
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
                  <tr key={med.id} className="group hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-bold">{med.name}</div>
                      <div className="text-xs text-muted-foreground">{med.manufacturer || "N/A"}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold px-3 py-1 bg-secondary rounded-full border border-border">
                        {med.category.name}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-mono font-bold text-emerald-600">
                      ${parseFloat(med.price).toFixed(2)}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`h-2 w-2 rounded-full ${med.isActive ? 'bg-emerald-500' : 'bg-muted'}`}></span>
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

function StatCard({ title, value, trend, icon, isAlert = false }: any) {
  return (
    <div className={`p-6 rounded-3xl bg-card border ${isAlert ? 'border-red-500/50 bg-red-50/10' : 'border-border'} transition-all hover:-translate-y-1`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-muted rounded-2xl">{icon}</div>
        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${isAlert ? 'bg-red-500 text-white' : 'bg-emerald-500/10 text-emerald-600'}`}>
          {trend}
        </span>
      </div>
      <p className="text-muted-foreground text-sm font-semibold">{title}</p>
      <h2 className="text-3xl font-black mt-1 tracking-tighter">{value}</h2>
    </div>
  );
}