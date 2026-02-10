"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import Loading from "@/app/loading";
import Swal from "sweetalert2";
import { Pencil, Trash2, Plus, Calendar, Layers, Save, X } from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export default function CategoryManagement() {
  const queryClient = useQueryClient();
  
  // Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");

  // 1. GET ALL CATEGORIES
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data.data;
    },
  });

  // 2. PATCH MUTATION (Update)
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await api.patch(`/categories/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsEditOpen(false);
      Swal.fire({ 
        title: "Success", 
        text: "Category updated successfully", 
        icon: "success", 
        toast: true, 
        position: "top-end", 
        timer: 2000, 
        showConfirmButton: false 
      });
    },
    onError: (err: any) => {
      Swal.fire("Error", err.response?.data?.message || "Failed to update", "error");
    }
  });

  // 3. DELETE MUTATION
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      Swal.fire("Deleted!", "Category removed.", "success");
    }
  });

  /* --- Handlers --- */
  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setEditName(category.name);
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    updateMutation.mutate({ 
      id: selectedCategory.id, 
      data: { name: editName } 
    });
  };

  const toggleStatus = (category: Category) => {
    updateMutation.mutate({ 
      id: category.id, 
      data: { isActive: !category.isActive } 
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 lg:p-10 bg-slate-50/50 dark:bg-transparent min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Layers className="h-8 w-8 text-emerald-500" /> Category Lab
          </h1>
          <p className="text-slate-500 mt-1">Refine and organize your MediStore inventory classification.</p>
        </div>
        <Link href="/admin/categories/create">
          <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl h-12 px-6 gap-2 shadow-lg shadow-emerald-500/20 font-bold">
            <Plus className="h-5 w-5" /> Add New Category
          </Button>
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead className="py-5 px-6">Category Info</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead className="text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => (
              <TableRow key={category.id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-all border-b">
                <TableCell className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                      {category.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold">{category.name}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">ID: #{category.id}</span>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Calendar className="h-4 w-4" />
                    {new Date(category.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
                
                <TableCell>
                  <button onClick={() => toggleStatus(category)}>
                    <Badge className={`rounded-full px-3 py-1 cursor-pointer transition-all ${
                      category.isActive 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40" 
                      : "bg-slate-100 text-slate-500"
                    }`}>
                      {category.isActive ? "Active" : "Hidden"}
                    </Badge>
                  </button>
                </TableCell>
                
                <TableCell className="text-right px-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEditModal(category)}
                      className="h-9 w-9 p-0 rounded-lg hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        Swal.fire({
                          title: "Delete Category?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes, delete"
                        }).then(r => r.isConfirmed && deleteMutation.mutate(category.id))
                      }}
                      className="h-9 w-9 p-0 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- EDIT MODAL --- */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl p-0 overflow-hidden border-none">
          <DialogHeader className="p-6 bg-emerald-600 text-white">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Pencil className="h-5 w-5" /> Edit Category
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleUpdate} className="p-6 space-y-6 bg-white dark:bg-slate-900">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">
                Category Name
              </label>
              <Input 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter category name..."
                className="h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus-visible:ring-emerald-500"
                required
              />
            </div>

            <DialogFooter className="flex flex-row gap-3 pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsEditOpen(false)}
                className="flex-1 h-12 rounded-xl gap-2 font-bold"
              >
                <X className="h-4 w-4" /> Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateMutation.isPending}
                className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 gap-2 font-bold shadow-lg shadow-emerald-500/20"
              >
                {updateMutation.isPending ? "Updating..." : <><Save className="h-4 w-4" /> Save Changes</>}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}