"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { DollarSign, Package, ShoppingCart, Users, BarChart3, Activity } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Card className="w-full max-w-md border border-gray-200 shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-gray-900">Access Denied</CardTitle>
            <CardDescription className="text-gray-600">Please sign in to view your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Welcome back! Here&apos;s an overview of your retail operations.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {metric.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                    
                      <Icon className="w-6 h-6 text-blue-600" />
                 
                  </div>
                  <div className="flex items-center text-sm mt-3">
                    <div className={`flex items-center ${metric.trend === "up" ? "text-green-600" : "text-red-600"} font-semibold`}>
                      {metric.trend === "up" ? (
                        <span className="mr-1">↑</span>
                      ) : (
                        <span className="mr-1">↓</span>
                      )}
                      <span>{metric.change}</span>
                    </div>
                    <span className="ml-2 text-gray-500">from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Charts Section */}
          <Card className="lg:col-span-2 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Sales Performance</CardTitle>
                  <CardDescription className="text-gray-600">
                    Monthly sales trends and forecasting
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-blue-600 justify-center" />
                  </div>
                  <p className="text-gray-600 font-medium">Chart visualization would go here</p>
                  <p className="text-sm text-gray-500 mt-1">Integration with charting library needed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Recent Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors border">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      alert.type === 'warning' ? 'bg-yellow-500' :
                      alert.type === 'danger' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Recent Products</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Manage your product inventory and performance
              </CardDescription>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/add-product">Add New Product</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Product</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Category</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Sales</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((product, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">{product.name}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{product.category}</td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={
                            product.status === "In Stock" ? "default" :
                            product.status === "Low Stock" ? "secondary" : "destructive"
                          }
                          className="font-medium"
                        >
                          {product.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-600 font-semibold">{product.sales}</td>
                      <td className="py-4 px-4">
                        <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
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