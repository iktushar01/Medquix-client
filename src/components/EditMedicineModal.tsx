"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle2, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

type Medicine = {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  isActive: boolean;
  manufacturer: string;
  expiryDate: string;
  categoryId: number;
  images: {
    id: number;
    imageUrl: string;
  }[];
};

type Category = {
  id: number;
  name: string;
  description?: string;
};

type EditMedicineModalProps = {
  medicine: Medicine | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditMedicineModal({
  medicine,
  open,
  onClose,
  onSuccess,
}: EditMedicineModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    manufacturer: "",
    expiryDate: "",
  });

  // 🔹 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        const json = await res.json();

        if (json.success && json.data) {
          setCategories(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  // 🔹 Populate form when medicine changes
  useEffect(() => {
    if (medicine && open) {
      // Convert ISO date to YYYY-MM-DD format for date input
      const formattedDate = medicine.expiryDate
        ? new Date(medicine.expiryDate).toISOString().split("T")[0]
        : "";

      setForm({
        name: medicine.name || "",
        description: medicine.description || "",
        price: medicine.price || "",
        stock: medicine.stock?.toString() || "",
        categoryId: medicine.categoryId?.toString() || "",
        manufacturer: medicine.manufacturer || "",
        expiryDate: formattedDate,
      });

      setExistingImages(medicine.images?.map((img) => img.imageUrl) || []);
      setNewImages([]);
      setNewImagePreviews([]);
      setError("");
      setSuccess("");
    }
  }, [medicine, open]);

  // 🔹 Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // 🔹 Handle category change
  const handleCategoryChange = (value: string) => {
    setForm({ ...form, categoryId: value });
    setError("");
  };

  // 🔹 Handle new image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setNewImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(previews);
  };

  // 🔹 Remove existing image
  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔹 Remove new image
  const removeNewImage = (index: number) => {
    const newImgs = newImages.filter((_, i) => i !== index);
    const newPrevs = newImagePreviews.filter((_, i) => i !== index);

    URL.revokeObjectURL(newImagePreviews[index]);

    setNewImages(newImgs);
    setNewImagePreviews(newPrevs);
  };

  // 🔹 Upload image to imgbb
  const uploadToImgBB = async (file: File) => {
    const body = new FormData();
    body.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      {
        method: "POST",
        body,
      }
    );

    if (!res.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await res.json();
    return data.data.url as string;
  };

  // 🔹 Validate form
  const validateForm = () => {
    if (!form.name.trim()) return "Medicine name is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.price || Number(form.price) <= 0) return "Valid price is required";
    if (!form.stock || Number(form.stock) < 0)
      return "Valid stock quantity is required";
    if (!form.categoryId) return "Please select a category";
    if (!form.manufacturer.trim()) return "Manufacturer is required";
    if (!form.expiryDate) return "Expiry date is required";
    if (existingImages.length === 0 && newImages.length === 0)
      return "At least one image is required";
    return null;
  };

  // 🔹 Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!medicine) return;

    try {
      setLoading(true);

      // Upload new images
      const uploadedUrls: string[] = [];
      for (const img of newImages) {
        const url = await uploadToImgBB(img);
        uploadedUrls.push(url);
      }

      // Combine existing and new images
      const allImageUrls = [...existingImages, ...uploadedUrls];

      // Convert date to ISO format
      const expiryDateTime = new Date(form.expiryDate).toISOString();

      // Update medicine
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/medicines/${medicine.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            price: Number(form.price),
            stock: Number(form.stock),
            categoryId: Number(form.categoryId),
            manufacturer: form.manufacturer,
            expiryDate: expiryDateTime,
            images: allImageUrls,
          }),
          credentials: "include",
        }
      );

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update medicine");
      }

      setSuccess("Medicine updated successfully!");

      // Close modal and refresh after 1 second
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to update medicine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Medicine</DialogTitle>
          <DialogDescription>
            Update the details of the medicine
          </DialogDescription>
        </DialogHeader>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-primary bg-primary/10">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Manufacturer */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                Medicine Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="e.g., Paracetamol 500mg"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-manufacturer">
                Manufacturer <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-manufacturer"
                name="manufacturer"
                placeholder="e.g., Square Pharmaceuticals"
                value={form.manufacturer}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="edit-description"
              name="description"
              placeholder="Enter medicine description..."
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="resize-none"
              required
            />
          </div>

          {/* Price, Stock, Category */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="edit-price">
                Price (৳) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-stock">
                Stock <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-stock"
                name="stock"
                type="number"
                min="0"
                placeholder="0"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-categoryId">
                Category <span className="text-destructive">*</span>
              </Label>
              {categoriesLoading ? (
                <div className="flex items-center justify-center h-10 border border-input rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Select
                  value={form.categoryId}
                  onValueChange={handleCategoryChange}
                  required
                >
                  <SelectTrigger id="edit-categoryId">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label htmlFor="edit-expiryDate">
              Expiry Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-expiryDate"
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>
              Product Images <span className="text-destructive">*</span>
            </Label>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Current Images
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg border border-border overflow-hidden group"
                    >
                      <Image
                        src={url}
                        alt={`Existing ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  id="edit-images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    document.getElementById("edit-images")?.click()
                  }
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>

              {newImagePreviews.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    New Images
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {newImagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg border border-border overflow-hidden group"
                      >
                        <Image
                          src={preview}
                          alt={`New ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Medicine"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}