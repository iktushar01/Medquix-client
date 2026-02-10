"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios"; // Your axios instance
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
  status: "ACTIVE" | "BLOCKED";
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

  // 2. Toggle Status Mutation (Ban/Unban)
  const { mutate: toggleStatus } = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      // Endpoint usually looks like: PATCH /api/admin/users/:id
      const res = await api.patch(`/admin/users/${userId}`, { status });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({ title: "Updated!", icon: "success", toast: true, position: "top-end", timer: 2000, showConfirmButton: false });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      Swal.fire("Error", "Failed to update user status", "error");
    }
  });

  const handleStatusChange = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    Swal.fire({
      title: `${newStatus === "BLOCKED" ? "Block" : "Activate"} User?`,
      text: `Are you sure you want to change this user's status to ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: newStatus === "BLOCKED" ? "#ef4444" : "#10b981",
      confirmButtonText: "Yes, Update",
    }).then((result) => {
      if (result.isConfirmed) {
        toggleStatus({ userId, status: newStatus });
      }
    });
  };

  if (isLoading) return <Loading />;

  // Filter Logic
  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-transparent p-4 lg:p-8 space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" /> User Management
          </h1>
          <p className="text-muted-foreground mt-1">Oversee all customers, sellers, and administrators.</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by name, email or role..." 
            className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead className="w-[250px]">User Info</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-slate-100 leading-none">{user.name}</span>
                        <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  
                  <TableCell className="text-slate-500 text-sm">
                    {new Date(user.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                          <UserCog className="h-4 w-4" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className={user.status === "ACTIVE" ? "text-red-600 gap-2" : "text-emerald-600 gap-2"}
                          onClick={() => handleStatusChange(user.id, user.status)}
                        >
                          {user.status === "ACTIVE" ? (
                            <><Ban className="h-4 w-4" /> Block User</>
                          ) : (
                            <><CheckCircle className="h-4 w-4" /> Activate User</>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                  No users found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* -------------------- Sub-Components -------------------- */

function RoleBadge({ role }: { role: User["role"] }) {
  const configs = {
    admin: { class: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: <ShieldCheck className="h-3 w-3" /> },
    seller: { class: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: <UserCircle className="h-3 w-3" /> },
    user: { class: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400", icon: <UserCircle className="h-3 w-3" /> },
  };

  const config = configs[role] || configs.user;

  return (
    <Badge className={`${config.class} border-none px-2.5 py-0.5 capitalize gap-1.5 font-bold shadow-none`}>
      {config.icon}
      {role}
    </Badge>
  );
}

function StatusBadge({ status }: { status: User["status"] }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${status === "ACTIVE" ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
      <span className={`text-xs font-bold ${status === "ACTIVE" ? "text-emerald-600" : "text-red-600"}`}>
        {status}
      </span>
    </div>
  );
}