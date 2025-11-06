"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Image as ImageIcon, Calendar, Package } from "lucide-react";
import Link from "next/link";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  expiration_date: z.string().min(1, "Expiration date is required"),
});

type ProductForm = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    image: null as File | null,
    manufacturing_report: null as File | null,
    sales_report: null as File | null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  const handleFileChange = (field: keyof typeof uploadedFiles) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadedFiles(prev => ({ ...prev, [field]: file }));
  };

  const onSubmit = async (data: ProductForm) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Product data:", { ...data, ...uploadedFiles });
    setIsLoading(false);
    // Redirect to dashboard on success
  };

  const FileUploadField = ({
    id,
    label,
    accept,
    icon: Icon,
    file
  }: {
    id: string;
    label: string;
    accept: string;
    icon: React.ComponentType<any>;
    file: File | null;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer group">
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={handleFileChange(id as keyof typeof uploadedFiles)}
          className="hidden"
        />
        <label htmlFor={id} className="cursor-pointer">
          <Icon className="mx-auto h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
          <p className="text-sm text-muted-foreground mb-2 group-hover:text-foreground transition-colors">
            {file ? file.name : `Click to upload ${label.toLowerCase()}`}
          </p>
          <p className="text-xs text-muted-foreground">
            {accept === "image/*" ? "PNG, JPG, GIF up to 10MB" : "PDF up to 10MB"}
          </p>
        </label>
      </div>
      {file && (
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <Upload size={16} />
          <span>{file.name}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
              <p className="text-muted-foreground mt-2">
                Add a new product to your inventory with all necessary details and documents.
              </p>
            </div>
            <Button variant="dashboard-outline" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="bg-linear-to-r from-primary/5 to-blue-50 border-b border-border">
            <CardTitle className="flex items-center text-primary">
              <Package className="h-5 w-5 mr-2" />
              Product Information
            </CardTitle>
            <CardDescription>
              Fill in the details below to add your product to the system.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter product name"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiration_date">Expiration Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="expiration_date"
                      type="date"
                      className="pl-10"
                      {...register("expiration_date")}
                    />
                  </div>
                  {errors.expiration_date && (
                    <p className="text-sm text-destructive">{errors.expiration_date.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product in detail..."
                  rows={4}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* File Uploads */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Product Documents</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FileUploadField
                    id="image"
                    label="Product Image"
                    accept="image/*"
                    icon={ImageIcon}
                    file={uploadedFiles.image}
                  />

                  <FileUploadField
                    id="manufacturing_report"
                    label="Manufacturing Report"
                    accept=".pdf"
                    icon={FileText}
                    file={uploadedFiles.manufacturing_report}
                  />

                  <FileUploadField
                    id="sales_report"
                    label="Sales Report"
                    accept=".pdf"
                    icon={FileText}
                    file={uploadedFiles.sales_report}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-border">
                <Button variant="dashboard-outline" type="button" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
                <Button variant="gradient-primary" type="submit" disabled={isLoading} className="min-w-[140px]">
                  {isLoading ? "Adding Product..." : "Add Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}