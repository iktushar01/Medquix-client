"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";

type Category = {
  id: number;
  name: string;
  description?: string;
};

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    manufacturer: "",
    expiryDate: "",
  });

  // 🔹 Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await fetch("http://localhost:5000/api/categories");
        const json = await res.json();
        
        if (json.success && json.data) {
          setCategories(json.data);
        } else {
          setError("Failed to load categories");
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 🔹 Handle input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error on input
  };

  // 🔹 Handle category select
  const handleCategoryChange = (value: string) => {
    setForm({ ...form, categoryId: value });
    setError("");
  };

  // 🔹 Handle multiple image select with preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setImages(files);

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // 🔹 Remove image
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  // 🔹 Upload one image to imgbb
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
    if (!form.stock || Number(form.stock) < 0) return "Valid stock quantity is required";
    if (!form.categoryId) return "Please select a category";
    if (!form.manufacturer.trim()) return "Manufacturer is required";
    if (!form.expiryDate) return "Expiry date is required";
    if (images.length === 0) return "At least one image is required";
    return null;
  };

  // 🔹 Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Upload all images
      const imageUrls: string[] = [];
      for (const img of images) {
        const url = await uploadToImgBB(img);
        imageUrls.push(url);
      }

      // 2️⃣ Convert date to ISO-8601 DateTime format
      const expiryDateTime = new Date(form.expiryDate).toISOString();

      // 3️⃣ Send to backend with auth header (using credentials for session cookie)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/medicines`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            price: Number(form.price),
            stock: Number(form.stock),
            categoryId: Number(form.categoryId), // Send as number
            manufacturer: form.manufacturer,
            expiryDate: expiryDateTime,
            images: imageUrls,
          }),
          credentials: "include", // Send session cookie
        }
      );

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to create medicine");
      }

      console.log("Created medicine:", json);
      setSuccess("Medicine created successfully!");

      // Reset form
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        manufacturer: "",
        expiryDate: "",
      });
      setImages([]);
      setImagePreviews([]);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/seller/medicines");
      }, 2000);

    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to create medicine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Medicine</h1>
        <p className="text-muted-foreground mt-1">
          Fill in the details to add a new medicine to your inventory
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-primary bg-primary/10">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">{success}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Medicine Information</CardTitle>
            <CardDescription>
              Enter the basic details of the medicine
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name & Manufacturer */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Medicine Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Paracetamol 500mg"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">
                  Manufacturer <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="manufacturer"
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
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter medicine description, usage, and dosage information..."
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="resize-none"
                required
              />
            </div>

            {/* Price, Stock, Category */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price (৳) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
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
                <Label htmlFor="stock">
                  Stock Quantity <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="stock"
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
                <Label htmlFor="categoryId">
                  Category <span className="text-destructive">*</span>
                </Label>
                {categoriesLoading ? (
                  <div className="flex items-center justify-center h-10 border border-input rounded-md bg-background">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <Select
                    value={form.categoryId}
                    onValueChange={handleCategoryChange}
                    required
                  >
                    <SelectTrigger id="categoryId">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                          No categories available
                        </div>
                      ) : (
                        categories.map((category) => (
                          <SelectItem 
                            key={category.id} 
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiryDate">
                Expiry Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="expiryDate"
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
              <p className="text-xs text-muted-foreground">
                Select the expiration date for this medicine
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="images">
                Product Images <span className="text-destructive">*</span>
              </Label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    id="images"
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
                    onClick={() => document.getElementById("images")?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg border border-border overflow-hidden group"
                      >
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Medicine"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}