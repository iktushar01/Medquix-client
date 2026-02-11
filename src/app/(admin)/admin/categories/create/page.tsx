"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  PlusCircle,
  ArrowLeft,
  Layers,
  CheckCircle2,
  Sparkles,
  Info
} from "lucide-react";

// Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CreateCategoryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");

  // --- DARK MODE SWEETALERT HELPER ---
  const themeSwal = () => {
    const isDark = document.documentElement.classList.contains("dark");
    return Swal.mixin({
      customClass: {
        popup: "rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl",
        title: "text-2xl font-black text-slate-900 dark:text-white",
        htmlContainer: "text-slate-600 dark:text-slate-400",
        confirmButton: "bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-all mx-2",
        cancelButton: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3 px-8 rounded-xl transition-all mx-2"
      },
      buttonsStyling: false,
      background: isDark ? "#0f172a" : "#ffffff", // slate-900 or white
      color: isDark ? "#f8fafc" : "#0f172a",      // slate-50 or slate-900
    });
  };

  // POST Mutation
  const { mutate: createCategory, isPending } = useMutation({
    mutationFn: async (newData: { name: string }) => {
      const res = await api.post("/categories", newData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      themeSwal().fire({
        title: "Category Created!",
        text: `"${name}" has been successfully added to MedQuix.`,
        icon: "success",
        iconColor: "#10b981",
      }).then(() => {
        router.push("/admin/categories");
      });
    },
    onError: (err: any) => {
      themeSwal().fire({
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
        icon: "error",
        iconColor: "#ef4444",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createCategory({ name });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-6 lg:p-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8 hover:bg-white dark:hover:bg-slate-900 gap-2 text-slate-500 font-bold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Categories
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left: Form */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
                <PlusCircle className="h-10 w-10 text-emerald-500" /> New Category
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                Create a new classification for your medical products and devices.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-wider">
                  Category Name
                </label>
                <Input
                  placeholder="e.g., Surgical Devices..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 px-6 rounded-2xl bg-white dark:bg-slate-900 border-none shadow-sm focus-visible:ring-emerald-500 text-lg dark:text-white"
                  required
                />
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 flex gap-3">
                <Info className="h-5 w-5 text-blue-500 shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed italic">
                  By default, new categories are set to <strong>Active</strong>. You can disable them later from the management dashboard.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isPending || !name}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg gap-2 shadow-xl shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isPending ? "Creating..." : <><CheckCircle2 className="h-5 w-5" /> Confirm & Create</>}
              </Button>
            </form>
          </div>

          {/* Right: Live Preview Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-12">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 ml-2">Live Preview</h3>
              <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="h-32 bg-emerald-600 flex items-center justify-center relative">
                  <Sparkles className="absolute top-4 right-4 text-emerald-400 opacity-50" />
                  <Layers className="h-12 w-12 text-white/20 absolute -bottom-4 -left-4 scale-150" />
                  <div className="h-20 w-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20">
                    <Layers className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardContent className="p-8 text-center">
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 mb-4 border-none px-4 py-1 font-bold">
                    PREVIEW
                  </Badge>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white truncate px-4 capitalize">
                    {name || "Category Name"}
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    {name ? `Facilitating ${name} distribution` : "Enter a name to see the preview"}
                  </p>

                  <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Status</p>
                      <p className="text-sm font-bold text-emerald-500">Active</p>
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Items</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}