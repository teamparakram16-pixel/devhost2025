"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Send,
  DollarSign,
  Star,
  CheckCircle,
  Sparkles,
  Image as ImageIcon,
  Tag
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  stockQuantity: number;
  tags: string[];
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  status: 'active' | 'draft' | 'archived';
  lastModified: string;
}

const products: Product[] = [
  {
    id: 'wireless-headphones',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    category: 'Electronics',
    price: 299.99,
    rating: 4.8,
    reviews: 1247,
    inStock: true,
    stockQuantity: 45,
    tags: ['wireless', 'noise-cancelling', 'premium'],
    features: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Premium sound quality',
      'Comfortable fit',
      'Quick charge (15 min = 3 hours)'
    ],
    specifications: {
      'Driver Size': '40mm',
      'Frequency Response': '20Hz - 20kHz',
      'Impedance': '32Ω',
      'Weight': '250g',
      'Connectivity': 'Bluetooth 5.0'
    },
    images: ['/api/placeholder/400/400'],
    status: 'active',
    lastModified: '2025-11-06'
  },
  {
    id: 'smart-watch',
    name: 'Executive Smart Watch Pro',
    description: 'Advanced smartwatch with health monitoring, GPS tracking, and professional features for business executives.',
    category: 'Wearables',
    price: 399.99,
    rating: 4.6,
    reviews: 892,
    inStock: true,
    stockQuantity: 23,
    tags: ['smartwatch', 'health', 'gps', 'executive', 'business'],
    features: [
      'Advanced Health & Fitness Tracking',
      'GPS + Cellular Connectivity',
      '7-Day Battery Life',
      'Titanium Build Quality',
      'Executive Email Integration'
    ],
    specifications: {
      'Display': '1.4" AMOLED Always-On',
      'Battery Life': '7 days (GPS), 21 days (Time-only)',
      'Water Resistance': '50m',
      'Sensors': 'Heart Rate, GPS, ECG, SpO2',
      'Compatibility': 'iOS 14+, Android 8+',
      'Materials': 'Titanium case, Ceramic bezel'
    },
    images: ['/api/placeholder/400/400'],
    status: 'active',
    lastModified: '2025-11-05'
  },
  {
    id: 'organic-coffee',
    name: 'Single-Origin Ethiopian Coffee',
    description: 'Premium single-origin coffee beans sourced directly from Ethiopian cooperatives, ethically traded and sustainably grown.',
    category: 'Food & Beverage',
    price: 24.99,
    rating: 4.9,
    reviews: 567,
    inStock: false,
    stockQuantity: 0,
    tags: ['organic', 'single-origin', 'ethiopian', 'fair-trade', 'premium'],
    features: [
      'Single-Origin Ethiopian Yirgacheffe',
      'Organic Certified',
      'Fair Trade Certified',
      'Medium Roast Profile',
      'Rich Floral and Citrus Notes'
    ],
    specifications: {
      'Origin': 'Yirgacheffe, Ethiopia',
      'Altitude': '2000m',
      'Process': 'Washed',
      'Roast Level': 'Medium',
      'Weight': '1kg (2.2lbs)',
      'Best By': '24 months from roast date'
    },
    images: ['/api/placeholder/400/400'],
    status: 'active',
    lastModified: '2025-11-04'
  },
  {
    id: 'yoga-mat',
    name: 'Eco-Friendly Yoga Mat',
    description: 'Sustainable yoga mat made from natural rubber with excellent grip and comfort.',
    category: 'Sports & Fitness',
    price: 79.99,
    rating: 4.7,
    reviews: 423,
    inStock: true,
    stockQuantity: 67,
    tags: ['eco-friendly', 'yoga', 'sustainable'],
    features: [
      'Natural rubber material',
      'Excellent grip',
      '6mm thickness',
      'Eco-friendly',
      'Non-slip surface'
    ],
    specifications: {
      'Material': 'Natural Rubber',
      'Thickness': '6mm',
      'Size': '183cm x 61cm',
      'Weight': '2.5kg',
      'Care': 'Wipe with damp cloth'
    },
    images: ['/api/placeholder/400/400'],
    status: 'active',
    lastModified: '2025-11-03'
  }
];

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product || null);
    setPrompt(''); // Reset prompt when changing products
  };

  const handleSubmit = async () => {
    if (!selectedProduct || !prompt.trim()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically send the prompt to your backend
      console.log('Submitting prompt for product:', selectedProduct.name);
      console.log('Prompt:', prompt);

      // Show success message
      alert(`Prompt submitted successfully for ${selectedProduct.name}!`);

      // Reset form
      setPrompt('');
    } catch (error) {
      console.error('Error submitting prompt:', error);
      alert('Error submitting prompt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3 lg:mb-4">Product Management</h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Manage your product catalog and request AI-powered updates using natural language prompts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Product Selection Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Package className="w-5 h-5 mr-2 text-primary" />
                  Product Catalog
                </CardTitle>
                <CardDescription className="text-sm">
                  Select a product to view and modify its details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">Choose Product</Label>
                  <Select onValueChange={handleProductSelect}>
                    <SelectTrigger className="w-full h-12 bg-white border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Select a product to manage..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id} className="py-3">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${
                                product.status === 'active' ? 'bg-green-500' :
                                product.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'
                              }`} />
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-xs text-muted-foreground">{product.category}</div>
                              </div>
                            </div>
                            {!product.inStock && (
                              <Badge variant="destructive" className="text-xs">Out</Badge>
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
                        {products.filter(p => p.status === 'active').length}
                      </div>
                      <div className="text-xs text-muted-foreground">Active</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">
                        {products.filter(p => p.inStock).length}
                      </div>
                      <div className="text-xs text-muted-foreground">In Stock</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details and Prompt Section */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6 lg:space-y-8">
            {/* Product Details */}
            {selectedProduct && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl text-foreground mb-2">{selectedProduct.name}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {selectedProduct.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <Badge variant={selectedProduct.status === 'active' ? 'default' : 'secondary'}>
                        {selectedProduct.status}
                      </Badge>
                      {!selectedProduct.inStock && (
                        <Badge variant="destructive">Out of Stock</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 lg:space-y-8">
                  {/* Price and Rating */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 lg:p-6 bg-linear-to-r from-primary/5 to-primary/10 rounded-lg gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
                      <div className="flex items-center">
                        <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 mr-2" />
                        <div>
                          <div className="text-2xl lg:text-3xl font-bold text-green-600">
                            ${selectedProduct.price}
                          </div>
                          <div className="text-xs lg:text-sm text-muted-foreground">Current Price</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500 mr-2" />
                        <div>
                          <div className="text-lg lg:text-xl font-semibold">{selectedProduct.rating}</div>
                          <div className="text-xs lg:text-sm text-muted-foreground">
                            {selectedProduct.reviews} reviews
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabs for detailed information */}
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1">
                      <TabsTrigger value="overview" className="text-xs lg:text-sm py-2">Overview</TabsTrigger>
                      <TabsTrigger value="specifications" className="text-xs lg:text-sm py-2">Specs</TabsTrigger>
                      <TabsTrigger value="images" className="text-xs lg:text-sm py-2">Images</TabsTrigger>
                      <TabsTrigger value="modify" className="text-xs lg:text-sm py-2">Modify</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4 lg:space-y-6 mt-4 lg:mt-6">
                      {/* Tags */}
                      <div>
                        <Label className="text-sm font-medium text-foreground mb-3 block">Tags</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="px-3 py-1">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <Label className="text-sm font-medium text-foreground mb-3 block">Key Features</Label>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          {selectedProduct.features.map((feature, index) => (
                            <div key={index} className="flex items-start p-3 bg-muted/30 rounded-lg">
                              <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 mr-2 lg:mr-3 mt-0.5 shrink-0" />
                              <span className="text-sm leading-relaxed">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="specifications" className="space-y-4 mt-4 lg:mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                        {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center p-3 lg:p-4 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium text-muted-foreground">{key}:</span>
                            <span className="text-sm font-semibold text-foreground">{value}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="images" className="mt-4 lg:mt-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
                        {selectedProduct.images.map((image, index) => (
                          <div key={index} className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 lg:w-8 lg:h-8 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-4 text-center">
                        Image gallery will be displayed here
                      </p>
                    </TabsContent>

                    <TabsContent value="modify" className="mt-4 lg:mt-6">
                      <div className="space-y-4">
                        <div className="p-4 lg:p-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                          <h3 className="text-base lg:text-lg font-semibold text-foreground mb-2">AI-Powered Modifications</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Use natural language prompts to request changes to this product's details, pricing, or specifications.
                          </p>
                          <div className="space-y-3">
                            <Label htmlFor="modify-prompt" className="text-sm font-medium">Modification Prompt</Label>
                            <Textarea
                              id="modify-prompt"
                              placeholder={`Example: "Increase the price by 10% and add 'eco-friendly' to the tags" or "Update the description to highlight the wireless feature"`}
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                              className="min-h-20 lg:min-h-24 resize-none"
                            />
                            <Button
                              onClick={handleSubmit}
                              disabled={!prompt.trim() || isSubmitting}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                              size="lg"
                            >
                              {isSubmitting ? (
                                <>
                                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2" />
                                  Apply Changes
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!selectedProduct && (
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-12 lg:py-16 px-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 lg:mb-6">
                    <Package className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-2">Select a Product</h3>
                  <p className="text-sm lg:text-base text-muted-foreground text-center max-w-md leading-relaxed">
                    Choose a product from the catalog on the left to view its details and make modifications using AI prompts.
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