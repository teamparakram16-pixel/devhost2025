"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { axiosClient } from "@/lib/axiosClient";

// Product shape returned by your backend (adjusted to match provided object)
interface Product {
  id: string;
  company_id?: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  expiration_date?: string | null;
  created_at?: string;
  updated_at?: string;
  image?: { id: string; url: string; file_name?: string } | null;
  manufacturing_report?: { id: string; url: string; file_name?: string } | null;
  sales_report?: { id: string; url: string; file_name?: string } | null;
  status?: "active" | "draft" | "archived";
  inStock?: boolean;
  tags?: string[];
  features?: string[];
  specifications?: Record<string, string>;
  [key: string]: any;
}

// keep a small fallback
const initialProducts: Product[] = [
  {
    id: "wireless-headphones",
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones.",
    price: 299.99,
    status: "active",
    inStock: true,
    image: {
      id: "placeholder",
      url: "/api/placeholder/400/400",
      file_name: "placeholder.png",
    },
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // analysis / AI results from /api/analyze-product
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [sourcesOpen, setSourcesOpen] = useState<boolean>(true);

  // fetch products from backend and populate select
  useEffect(() => {
    let mounted = true;
    async function fetchProducts() {
      setLoadingProducts(true);
      try {
        const resp = await axiosClient.get("/company/getProducts");
        const data = resp?.data;
        // adapt depending on API shape: { products: [...] } or [...]
        const rawList: any[] =
          data && (data.products ?? data) ? data.products ?? data : [];
        // Map backend structure (the sample you pasted) directly to Product
        const fetched: Product[] =
          Array.isArray(rawList) && rawList.length > 0
            ? rawList.map((p: any) => ({
                id: p.id,
                company_id: p.company_id ?? p.company_id,
                name: p.name,
                description: p.description ?? p.description,
                category: p.category ?? p.category,
                price: p.price ?? p.price,
                expiration_date: p.expiration_date ?? p.expiration_date,
                created_at: p.created_at,
                updated_at: p.updated_at ?? p.updated_at,
                image: p.image ?? null,
                manufacturing_report: p.manufacturing_report ?? null,
                sales_report: p.sales_report ?? null,
                status: p.status ?? "active",
                inStock: p.inStock ?? true,
                tags: p.tags ?? [],
                features: p.features ?? [],
                specifications: p.specifications ?? {},
              }))
            : initialProducts;
        if (mounted) {
          setProducts(fetched);
          // auto-select first product if none selected
          if (!selectedProduct && fetched.length > 0)
            setSelectedProduct(fetched[0]);
        }
      } catch (err) {
        console.warn("Failed to load products from API, using fallback", err);
        // keep initialProducts as fallback
      } finally {
        if (mounted) setLoadingProducts(false);
      }
    }
    fetchProducts();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId) || null;
    setSelectedProduct(product);
    setPrompt("");
  };

  const handleSubmit = async () => {
    if (!selectedProduct || !prompt.trim()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        message: prompt,
        product_id: selectedProduct.id,
      };

      console.log("Analyzing product:", selectedProduct.name);
      
      // First call analyze-product to gather all the data
      const analysisResp = await axiosClient.post("/analyze-product", payload);
      
      if (!analysisResp?.data?.success) {
        throw new Error(analysisResp?.data?.error || "Failed to analyze product");
      }

      const analysisData = analysisResp.data.data;
      console.log("Product analysis data:", analysisData);
      // store for UI
      setAnalysisResult(analysisData.analysis ?? analysisData);
      setAiResult(analysisData.ai ?? null);

      // Then call Gemini with the enriched context
      const geminiResp = await axiosClient.post("/api/gemini-chat", {
        message: prompt,
        product_id: selectedProduct.id,
        context: {
          youtube_data: analysisData.youtube_data,
          reddit_data: analysisData.reddit_data,
          product: analysisData.product
        }
      });

      if (geminiResp?.data?.success) {
        console.log("Gemini response:", geminiResp.data.text);
        alert(
          `AI response received for ${selectedProduct.name}. Check console for details.`
        );
      } else {
        throw new Error(geminiResp?.data?.error || "Failed to get AI response");
      }
      
      setPrompt("");
    } catch (error: any) {
      console.error("Error analyzing product:", error);
      alert(
        error?.response?.data?.error ||
          error?.message ||
          "Error analyzing product. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3 lg:mb-4">
            Product Management
          </h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Manage your product catalog and request AI-powered updates using
            natural language prompts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Product Selection Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <div className="w-5 h-5 mr-2 bg-linear-to-br from-blue-500 to-purple-500 rounded-lg"></div>
                  Product Catalog
                </CardTitle>
                <CardDescription className="text-sm">
                  Select a product to view and modify its details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Choose Product
                  </Label>
                  <Select
                    onValueChange={handleProductSelect}
                    value={selectedProduct?.id ?? ""}
                  >
                    <SelectTrigger className="w-full h-12 bg-white border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-primary/20">
                      <SelectValue
                        placeholder={
                          loadingProducts
                            ? "Loading products..."
                            : "Select a product to manage..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      {products.map((product) => (
                        <SelectItem
                          key={product.id}
                          value={product.id}
                          className="py-3"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-3">
                              {/* small thumbnail if available */}
                              <div className="w-10 h-10 rounded-md overflow-hidden bg-muted">
                                {product.image?.url ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={product.image.url}
                                    alt={
                                      product.image.file_name ?? product.name
                                    }
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {product.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {product.category ?? product.company_id}
                                </div>
                              </div>
                            </div>
                            {product.status !== "active" && (
                              <Badge variant="secondary" className="text-xs">
                                {product.status}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Stats */}
                <div className="pt-6 border-t border-border/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-primary/5 rounded-lg">
                      <div className="text-xl font-bold text-primary">
                        {products.filter((p) => p.status === "active").length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Active
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">
                        {products.filter((p) => p.inStock).length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        In Stock
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details and Prompt Section */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6 lg:space-y-8">
            {/* Product Details */}
            {selectedProduct ? (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl text-foreground mb-2">
                        {selectedProduct.name}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {selectedProduct.description}
                      </CardDescription>
                      <div className="mt-3 text-sm text-muted-foreground">
                        Expires: {selectedProduct.expiration_date ?? "N/A"} •
                        Updated:{" "}
                        {selectedProduct.updated_at ??
                          selectedProduct.created_at ??
                          "N/A"}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <Badge
                        variant={
                          selectedProduct.status === "active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {selectedProduct.status}
                      </Badge>
                      {!selectedProduct.inStock && (
                        <Badge variant="destructive">Out of Stock</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 lg:space-y-8">
                  {/* Image + Reports */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <div className="w-full h-64 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                        {selectedProduct.image?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={selectedProduct.image.url}
                            alt={
                              selectedProduct.image.file_name ??
                              selectedProduct.name
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-span-2 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-sm font-medium mb-2">
                            Manufacturing Report
                          </div>
                          {selectedProduct.manufacturing_report?.url ? (
                            <a
                              href={selectedProduct.manufacturing_report.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-primary underline"
                            >
                              {selectedProduct.manufacturing_report.file_name ??
                                "Open report"}
                            </a>
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              Not available
                            </div>
                          )}
                        </div>

                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-sm font-medium mb-2">
                            Sales Report
                          </div>
                          {selectedProduct.sales_report?.url ? (
                            <a
                              href={selectedProduct.sales_report.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-primary underline"
                            >
                              {selectedProduct.sales_report.file_name ??
                                "Open report"}
                            </a>
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              Not available
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-4 bg-muted/20 rounded-lg">
                        <div className="text-sm font-medium mb-1">Metadata</div>
                        <div className="text-xs text-muted-foreground">
                          Company: {selectedProduct.company_id ?? "—"} • ID:{" "}
                          {selectedProduct.id}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabs for detailed information */}
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1">
                      <TabsTrigger
                        value="overview"
                        className="text-xs lg:text-sm py-2"
                      >
                        Overview
                      </TabsTrigger>
                      <TabsTrigger
                        value="specifications"
                        className="text-xs lg:text-sm py-2"
                      >
                        Specs
                      </TabsTrigger>
                      <TabsTrigger
                        value="files"
                        className="text-xs lg:text-sm py-2"
                      >
                        Files
                      </TabsTrigger>
                      <TabsTrigger
                        value="modify"
                        className="text-xs lg:text-sm py-2"
                      >
                        Modify
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="overview"
                      className="space-y-4 lg:space-y-6 mt-4 lg:mt-6"
                    >
                      {/* Tags & Features */}
                      <div>
                        <Label className="text-sm font-medium text-foreground mb-3 block">
                          Tags
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {(selectedProduct.tags ?? []).length > 0 ? (
                            (selectedProduct.tags ?? []).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="px-3 py-1"
                              >
                                <div className="w-2 h-2 mr-1 bg-primary rounded-full"></div>
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              No tags
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-foreground mb-3 block">
                          Key Features
                        </Label>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          {(selectedProduct.features ?? []).length > 0 ? (
                            (selectedProduct.features ?? []).map(
                              (feature: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-start p-3 bg-muted/30 rounded-lg"
                                >
                                  <div className="w-5 h-5 mr-3 mt-0.5 shrink-0 bg-linear-to-br from-green-500 to-emerald-500 rounded-full"></div>
                                  <span className="text-sm leading-relaxed">
                                    {feature}
                                  </span>
                                </div>
                              )
                            )
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              No features listed
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="specifications"
                      className="space-y-4 mt-4 lg:mt-6"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                        {Object.entries(selectedProduct.specifications ?? {})
                          .length > 0 ? (
                          Object.entries(
                            selectedProduct.specifications ?? {}
                          ).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between items-center p-3 lg:p-4 bg-muted/30 rounded-lg"
                            >
                              <span className="text-sm font-medium text-muted-foreground">
                                {key}:
                              </span>
                              <span className="text-sm font-semibold text-foreground">
                                {value}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            No specifications
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="files" className="mt-4 lg:mt-6">
                      <div className="space-y-3">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-sm font-medium mb-2">
                            Manufacturing Report
                          </div>
                          {selectedProduct.manufacturing_report?.url ? (
                            <a
                              href={selectedProduct.manufacturing_report.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-primary underline"
                            >
                              {selectedProduct.manufacturing_report.file_name}
                            </a>
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              Not available
                            </div>
                          )}
                        </div>

                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-sm font-medium mb-2">
                            Sales Report
                          </div>
                          {selectedProduct.sales_report?.url ? (
                            <a
                              href={selectedProduct.sales_report.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-primary underline"
                            >
                              {selectedProduct.sales_report.file_name}
                            </a>
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              Not available
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="modify" className="mt-4 lg:mt-6">
                      <div className="space-y-4">
                        <div className="p-4 lg:p-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                          <h3 className="text-base lg:text-lg font-semibold text-foreground mb-2">
                            AI-Powered Modifications
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Use natural language prompts to request changes to
                            this products details, pricing, or specifications.
                          </p>
                          <div className="space-y-3">
                            <Label
                              htmlFor="modify-prompt"
                              className="text-sm font-medium"
                            >
                              Modification Prompt
                            </Label>
                            <Textarea
                              id="modify-prompt"
                              placeholder={`Example: "Increase the price by 10% and add 'eco-friendly' to the tags"`}
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                              className="min-h-20 lg:min-h-24 resize-none"
                            />
                            <Button
                              onClick={handleSubmit}
                              disabled={!prompt.trim() || isSubmitting}
                              className="w-full bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
                              size="lg"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <div className="w-4 h-4 mr-2 bg-white/30 rounded"></div>
                                  Apply Changes
                                </>
                              )}
                            </Button>
                          </div>
                          {/* AI Result */}
                          {aiResult && (
                            <div className="mt-6 p-4 bg-muted/10 rounded-lg border border-border">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="text-sm font-medium">AI Analysis</div>
                                  <div className="mt-2 text-sm">
                                    <div>
                                      <span className="font-semibold">Demand:</span>{" "}
                                      <Badge className="mr-2">{aiResult.demand_level}</Badge>
                                    </div>
                                    <div className="mt-1">
                                      <span className="font-semibold">Predicted price:</span>{" "}
                                      <span className="text-sm text-foreground">${aiResult.predicted_price}</span>
                                    </div>
                                    <div className="mt-2 text-sm text-muted-foreground">
                                      {aiResult.reasoning}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <button
                                    onClick={() => setSourcesOpen((s) => !s)}
                                    className="text-xs text-primary underline"
                                    type="button"
                                  >
                                    {sourcesOpen ? "Hide sources" : "Show sources"}
                                  </button>
                                </div>
                              </div>
                              
                              {/* Sources section (YouTube videos) */}
                              {sourcesOpen && analysisResult?.youtube_data && (
                                <div className="mt-4">
                                  <div className="text-sm font-medium mb-2">Sources (YouTube)</div>
                                  <div className="space-y-3">
                                    {(analysisResult.youtube_data.videos || []).map((v: any) => {
                                      const transcriptObj =
                                        (analysisResult.youtube_data.transcripts || []).find(
                                          (t: any) => t.videoId === v.videoId
                                        ) ?? null;
                                      return (
                                        <div
                                          key={v.videoId}
                                          className="p-3 bg-white/80 border border-border rounded-lg"
                                        >
                                          <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium">
                                              <a
                                                href={`https://www.youtube.com/watch?v=${v.videoId}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-primary underline"
                                              >
                                                {v.title || v.videoId}
                                              </a>
                                              <div className="text-xs text-muted-foreground">
                                                {v.channelTitle} • {new Date(v.publishedAt).toLocaleDateString()}
                                              </div>
                                            </div>
                                          </div>
                                          {transcriptObj?.transcript && (
                                            <div className="mt-2 text-xs text-muted-foreground">
                                              {String(transcriptObj.transcript).slice(0, 400)}{String(transcriptObj.transcript).length > 400 ? "…" : ""}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-12 lg:py-16 px-4">
                  <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <div className="w-8 h-8 bg-white/30 rounded-lg"></div>
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-2">
                    Select a Product
                  </h3>
                  <p className="text-sm lg:text-base text-muted-foreground text-center max-w-md leading-relaxed">
                    Choose a product from the catalog on the left to view its
                    details and make modifications using AI prompts.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
