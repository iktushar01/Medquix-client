"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

type Medicine = {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  isActive: boolean;
  manufacturer: string;
  expiryDate: string;
  images: {
    id: number;
    imageUrl: string;
  }[];
};

export default function Page() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 Fetch medicines
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/medicines`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );

        const json = await res.json();
        setMedicines(json.data || []);
      } catch (error) {
        console.error("Failed to fetch medicines", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

 const handleDelete = async (id: number) => {
  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const swal = Swal.mixin({
    background: isDark ? "#020817" : "#ffffff", // slate-950 vibe
    color: isDark ? "#e5e7eb" : "#020817",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
  });

  const result = await swal.fire({
    title: "Delete medicine?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/seller/medicines/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error("Delete failed");
    }

    // 🧠 optimistic update (classic & correct)
    setMedicines((prev) => prev.filter((m) => m.id !== id));

    await swal.fire({
      title: "Deleted!",
      text: "Medicine has been removed.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Delete failed", error);

    await swal.fire({
      title: "Error",
      text: "Something went wrong while deleting.",
      icon: "error",
    });
  }
};




  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading medicines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            💊 Medicines
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your medicine inventory
          </p>
        </div>
        <button
          onClick={() => router.push("/seller/medicines/add")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Medicine
        </button>
      </div>

      {/* Table Card */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Image
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Price
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Stock
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {medicines.map((medicine) => (
                <tr
                  key={medicine.id}
                  className="border-b border-border transition-colors hover:bg-muted/50"
                >
                  <td className="p-4 align-middle">
                    {medicine.images?.[0]?.imageUrl ? (
                      <Image
                        src={medicine.images[0].imageUrl}
                        alt={medicine.name}
                        width={56}
                        height={56}
                        className="rounded-md object-cover border border-border"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center border border-border">
                        <span className="text-2xl">💊</span>
                      </div>
                    )}
                  </td>

                  <td className="p-4 align-middle">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-foreground">
                        {medicine.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {medicine.manufacturer}
                      </p>
                    </div>
                  </td>

                  <td className="p-4 align-middle">
                    <span className="font-medium text-foreground">
                      ৳ {medicine.price}
                    </span>
                  </td>

                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${medicine.stock > 10
                          ? "bg-primary/10 text-primary"
                          : medicine.stock > 0
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-500"
                            : "bg-destructive/10 text-destructive"
                        }`}
                    >
                      {medicine.stock} units
                    </span>
                  </td>

                  <td className="p-4 align-middle">
                    {medicine.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-4 align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => router.push(`/seller/medicines/${medicine.id}`)}
                        className="inline-flex items-center justify-center rounded-md h-8 w-8 border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => router.push(`/seller/medicines/edit/${medicine.id}`)}
                        className="inline-flex items-center justify-center rounded-md h-8 w-8 border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(medicine.id)}
                        className="inline-flex items-center justify-center rounded-md h-8 w-8 border border-destructive/50 bg-background text-destructive hover:bg-destructive hover:text-white transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {medicines.length === 0 && (
                <tr>
                  <td colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-muted-foreground">No medicines found</p>
                      <button
                        onClick={() => router.push("/medicines/add")}
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Add your first medicine
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Stats */}
      {medicines.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing <span className="font-medium text-foreground">{medicines.length}</span>{" "}
            medicine{medicines.length !== 1 ? "s" : ""}
          </p>
          <p>
            Active:{" "}
            <span className="font-medium text-primary">
              {medicines.filter((m) => m.isActive).length}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}