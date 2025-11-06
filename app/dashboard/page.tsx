"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  Users,
  ShoppingCart,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function DashboardPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to view your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
const metrics = [
  {
    title: "Total Revenue",
    value: "$124,563",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Products",
    value: "1,247",
    change: "+8.2%",
    trend: "up",
    icon: Package,
  },
  {
    title: "Total Orders",
    value: "3,456",
    change: "-2.1%",
    trend: "down",
    icon: ShoppingCart,
  },
  {
    title: "Active Customers",
    value: "892",
    change: "+15.3%",
    trend: "up",
    icon: Users,
  },
];

const recentProducts = [
  { name: "Wireless Headphones", category: "Electronics", status: "In Stock", sales: 245 },
  { name: "Organic Coffee Beans", category: "Food", status: "Low Stock", sales: 189 },
  { name: "Smart Watch", category: "Electronics", status: "Out of Stock", sales: 156 },
  { name: "Yoga Mat", category: "Sports", status: "In Stock", sales: 98 },
];

const alerts = [
  { type: "warning", message: "Low stock alert: Organic Coffee Beans", time: "2 hours ago" },
  { type: "info", message: "New product added: Premium Tea Set", time: "4 hours ago" },
  { type: "danger", message: "Price optimization needed: Wireless Headphones", time: "6 hours ago" },
];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's an overview of your retail operations.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="shadow-sm border-border bg-card hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>
                    {metric.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Charts Section */}
          <Card className="lg:col-span-2 shadow-sm border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Sales Performance
              </CardTitle>
              <CardDescription>
                Monthly sales trends and forecasting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-linear-to-br from-primary/5 to-blue-50 rounded-lg border border-primary/10">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-primary mx-auto mb-2" />
                  <p className="text-muted-foreground">Chart visualization would go here</p>
                  <p className="text-sm text-muted-foreground">Integration with charting library needed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-sm border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      alert.type === 'warning' ? 'bg-yellow-500' :
                      alert.type === 'danger' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>
                Manage your product inventory and performance
              </CardDescription>
            </div>
            <Button variant="gradient-primary" asChild>
              <Link href="/add-product">Add New Product</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-foreground">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Sales</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((product, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-foreground">{product.name}</div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            product.status === "In Stock" ? "success" :
                            product.status === "Low Stock" ? "warning" : "danger"
                          }
                        >
                          {product.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{product.sales}</td>
                      <td className="py-3 px-4">
                        <Button variant="dashboard-outline" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}