"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios"; 
import Loading from "@/app/loading";
import Swal from "sweetalert2";
import { 
  Users, 
  Mail, 
  ShieldCheck, 
  UserCircle, 
  Search, 
  MoreHorizontal,
  Ban,
  CheckCircle,
  UserCog
} from "lucide-react";

// Shadcn Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

/* -------------------- Types -------------------- */
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "seller" | "user";
  status: "ACTIVE" | "BANNED"; // Updated to match your API
  createdAt: string;
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch Users
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api.get("/admin/users");
      return res.data.data;
    },
  });

  // 2. Toggle Status Mutation (BANNED/ACTIVE)
  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      // Endpoint: PATCH http://localhost:5000/api/admin/users/:id
      const res = await api.patch(`/admin/users/${userId}`, { status });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({ 
        title: "Status Updated", 
        icon: "success", 
        toast: true, 
        position: "top-end", 
        timer: 2000, 
        showConfirmButton: false 
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: any) => {
      Swal.fire("Action Failed", err.response?.data?.message || "Something went wrong", "error");
    }
  });

  const handleStatusChange = (userId: string, currentStatus: string) => {
    const isBanning = currentStatus === "ACTIVE";
    const nextStatus = isBanning ? "BANNED" : "ACTIVE";

    Swal.fire({
      title: isBanning ? "Ban User?" : "Unban User?",
      text: isBanning 
        ? "This user will no longer be able to log in or use the platform." 
        : "This user will regain access to their account.",
      icon: isBanning ? "warning" : "question",
      showCancelButton: true,
      confirmButtonColor: isBanning ? "#ef4444" : "#10b981",
      confirmButtonText: isBanning ? "Yes, Ban User" : "Yes, Activate",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus({ userId, status: nextStatus });
      }
    });
  };

  if (isLoading) return <Loading />;

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-transparent p-4 lg:p-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" /> User Directory
          </h1>
          <p className="text-muted-foreground mt-1">Manage platform access for all registered accounts.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search name or email..." 
            className="pl-10 h-11 ring-offset-transparent focus-visible:ring-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead>Account Holder</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead className="text-right">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className={`${user.status === "BANNED" ? "bg-red-50/30 dark:bg-red-900/5" : ""}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                        user.status === "BANNED" ? "bg-slate-200 text-slate-500" : "bg-primary/10 text-primary"
                      }`}>
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  
                  <TableCell>
                    <StatusIndicator status={user.status} />
                  </TableCell>
                  
                  <TableCell className="text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <UserCog className="h-4 w-4" /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className={`gap-2 cursor-pointer font-medium ${
                            user.status === "ACTIVE" ? "text-red-600 focus:text-red-600" : "text-emerald-600 focus:text-emerald-600"
                          }`}
                          onClick={() => handleStatusChange(user.id, user.status)}
                        >
                          {user.status === "ACTIVE" ? (
                            <><Ban className="h-4 w-4" /> Block Account</>
                          ) : (
                            <><CheckCircle className="h-4 w-4" /> Restore Access</>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* -------------------- Helper Components -------------------- */

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    seller: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    user: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  };

  return (
    <Badge className={`${styles[role] || styles.user} border-none shadow-none uppercase text-[10px] font-bold`}>
      {role}
    </Badge>
  );
}

function StatusIndicator({ status }: { status: string }) {
  const isActive = status === "ACTIVE";
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`} />
      <span className={`text-xs font-bold ${isActive ? "text-emerald-600" : "text-red-600"}`}>
        {status}
      </span>
    </div>
  );
}