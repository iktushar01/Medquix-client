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

export const useMedicines = (categoryId?: number | null) => {
    return useQuery<Medicine[]>({
        queryKey: ["medicines", categoryId],
        queryFn: async () => {
            const res = await api.get("/medicines", {
                params: { categoryId },
            });
            return res.data.data;
        },
    });
};
