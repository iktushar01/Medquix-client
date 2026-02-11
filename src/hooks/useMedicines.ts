import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface MedicineImage {
    id: number;
    imageUrl: string;
    medicineId: number;
}

export interface Medicine {
    id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    manufacturer: string;
    expiryDate: string;
    categoryId: number;
    category: {
        id: number;
        name: string;
    };
    images: MedicineImage[];
}

export interface MedicineFilters {
    categoryId?: number | null;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    manufacturer?: string;
}

export const useMedicines = (filters?: MedicineFilters) => {
    return useQuery<Medicine[]>({
        queryKey: ["medicines", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.categoryId) params.append("categoryId", filters.categoryId.toString());
            if (filters?.search) params.append("searchTerm", filters.search);
            if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString());
            if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
            if (filters?.manufacturer) params.append("manufacturer", filters.manufacturer);

            const res = await api.get("/medicines", { params });
            return res.data.data;
        },
    });
};
