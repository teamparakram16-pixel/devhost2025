/* eslint-disable react/style-prop-object */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Activity,
  TrendingUp,
  TrendingDown,
  PieChart,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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

  // Mock data for charts and metrics
  const salesData = [
    { month: 'Jan', sales: 45000, revenue: 52000, profit: 12000 },
    { month: 'Feb', sales: 52000, revenue: 61000, profit: 15000 },
    { month: 'Mar', sales: 48000, revenue: 56000, profit: 13000 },
    { month: 'Apr', sales: 61000, revenue: 72000, profit: 18000 },
    { month: 'May', sales: 55000, revenue: 65000, profit: 16000 },
    { month: 'Jun', sales: 67000, revenue: 79000, profit: 20000 },
    { month: 'Jul', sales: 69000, revenue: 82000, profit: 21000 },
    { month: 'Aug', sales: 73000, revenue: 87000, profit: 23000 },
    { month: 'Sep', sales: 71000, revenue: 84000, profit: 22000 },
    { month: 'Oct', sales: 78000, revenue: 92000, profit: 25000 },
    { month: 'Nov', sales: 82000, revenue: 97000, profit: 27000 },
    { month: 'Dec', sales: 89000, revenue: 105000, profit: 30000 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#3B82F6' },
    { name: 'Clothing', value: 25, color: '#10B981' },
    { name: 'Home & Garden', value: 20, color: '#F59E0B' },
    { name: 'Sports', value: 12, color: '#EF4444' },
    { name: 'Books', value: 8, color: '#8B5CF6' }
  ];

  const topProducts = [
    { name: 'Wireless Headphones', sales: 2450, revenue: 122500 },
    { name: 'Smart Watch', sales: 1890, revenue: 94500 },
    { name: 'Laptop Stand', sales: 1650, revenue: 41250 },
    { name: 'Coffee Maker', sales: 1420, revenue: 56800 },
    { name: 'Yoga Mat', sales: 1280, revenue: 19200 }
  ];

  const metrics = [
    {
      title: "Total Revenue",
      value: "$1,247,563",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Orders",
      value: "8,456",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Customers",
      value: "3,247",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Conversion Rate",
      value: "3.24%",
      change: "-2.1%",
      trend: "down",
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Avg Order Value",
      value: "$147.50",
      change: "+5.7%",
      trend: "up",
      icon: BarChart3,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Inventory Turnover",
      value: "4.2x",
      change: "+3.1%",
      trend: "up",
      icon: Package,
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    }
  ];

  // Financial breakdown data
  const costBreakdownData = [
    { name: 'Revenue', value: 1247563, color: '#10B981' },
    { name: 'COGS', value: 623781, color: '#EF4444' },
    { name: 'Manufacturing', value: 187134, color: '#F59E0B' },
    { name: 'Import/Export', value: 124756, color: '#8B5CF6' },
    { name: 'Marketing', value: 74853, color: '#06B6D4' },
    { name: 'Taxes', value: 62378, color: '#EC4899' },
    { name: 'Net Profit', value: 187134, color: '#84CC16' }
  ];

  const profitWaterfallData = [
    { name: 'Revenue', value: 1247563, type: 'revenue' },
    { name: 'COGS', value: -623781, type: 'cost' },
    { name: 'Gross Profit', value: 623782, type: 'profit' },
    { name: 'Operating Costs', value: -249513, type: 'cost' },
    { name: 'Operating Profit', value: 374269, type: 'profit' },
    { name: 'Taxes', value: -62378, type: 'cost' },
    { name: 'Net Profit', value: 311891, type: 'profit' }
  ];

  const monthlyCostsData = [
    { month: 'Jan', revenue: 52000, cogs: 26000, manufacturing: 7800, marketing: 5200, taxes: 2600 },
    { month: 'Feb', revenue: 61000, cogs: 30500, manufacturing: 9150, marketing: 6100, taxes: 3050 },
    { month: 'Mar', revenue: 56000, cogs: 28000, manufacturing: 8400, marketing: 5600, taxes: 2800 },
    { month: 'Apr', revenue: 72000, cogs: 36000, manufacturing: 10800, marketing: 7200, taxes: 3600 },
    { month: 'May', revenue: 65000, cogs: 32500, manufacturing: 9750, marketing: 6500, taxes: 3250 },
    { month: 'Jun', revenue: 79000, cogs: 39500, manufacturing: 11850, marketing: 7900, taxes: 3950 }
  ];

  const costCategoriesData = [
    { category: 'Cost of Goods Sold', amount: 623781, percentage: 50, color: '#EF4444' },
    { category: 'Manufacturing', amount: 187134, percentage: 15, color: '#F59E0B' },
    { category: 'Import/Export', amount: 124756, percentage: 10, color: '#8B5CF6' },
    { category: 'Marketing & Sales', amount: 74853, percentage: 6, color: '#06B6D4' },
    { category: 'Taxes & Duties', amount: 62378, percentage: 5, color: '#EC4899' },
    { category: 'Other Expenses', amount: 62378, percentage: 5, color: '#6B7280' },
    { category: 'Net Profit', amount: 311891, percentage: 25, color: '#10B981' }
  ];

  const recentActivity = [
    {
      type: "order",
      message: "New order #12345 received - $299.99",
      time: "2 minutes ago",
      status: "success"
    },
    {
      type: "inventory",
      message: "Low stock alert: Wireless Headphones (5 remaining)",
      time: "15 minutes ago",
      status: "warning"
    },
    {
      type: "customer",
      message: "Customer review: 5-star rating for Smart Watch",
      time: "1 hour ago",
      status: "success"
    },
    {
      type: "system",
      message: "Daily backup completed successfully",
      time: "3 hours ago",
      status: "info"
    },
    {
      type: "order",
      message: "Order #12340 shipped to customer",
      time: "4 hours ago",
      status: "success"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Retail Dashboard</h1>
              <p className="text-gray-600 mt-2 text-lg">
                Welcome back! Here&apos;s your business performance overview.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                <Clock className="w-4 h-4 mr-2" />
                Last updated: {new Date().toLocaleTimeString()}
              </Badge>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/add-product">
                  <Package className="w-4 h-4 mr-2" />
                  Add Product
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <div className="flex items-center mt-2">
                        {metric.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          metric.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}>
                          {metric.change}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Trend Chart */}
          <Card className="lg:col-span-2 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Sales Performance
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Monthly sales, revenue, and profit trends
                  </CardDescription>
                </div>
                <select className="px-3 py-1 border border-gray-300 rounded-md text-sm" aria-label="Time period selection">
                  <option>Last 12 months</option>
                  <option>Last 6 months</option>
                  <option>Last 3 months</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="url(#colorRevenue)"
                    name="Revenue ($)"
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stackId="2"
                    stroke="#10B981"
                    fill="url(#colorSales)"
                    name="Sales ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution Pie Chart */}
          <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-purple-600" />
                Category Distribution
              </CardTitle>
              <CardDescription className="text-gray-600">
                Sales breakdown by product category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Financial Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cost Breakdown Pie Chart */}
          <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-red-600" />
                Cost Breakdown
              </CardTitle>
              <CardDescription className="text-gray-600">
                Revenue vs cost distribution analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={costBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {costBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Profit Waterfall Chart */}
          <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                Profit Waterfall
              </CardTitle>
              <CardDescription className="text-gray-600">
                Journey from revenue to net profit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitWaterfallData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    formatter={(value) => {
                      const numValue = typeof value === 'number' ? value : parseFloat(value as string) || 0;
                      return [`$${Math.abs(numValue).toLocaleString()}`, numValue < 0 ? 'Cost' : 'Profit'];
                    }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                    {profitWaterfallData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.type === 'revenue' ? '#10B981' : entry.type === 'cost' ? '#EF4444' : '#84CC16'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional Financial Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Cost Trends */}
          <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Monthly Cost Analysis
              </CardTitle>
              <CardDescription className="text-gray-600">
                Cost breakdown trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyCostsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="cogs"
                    stackId="2"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.6}
                    name="COGS"
                  />
                  <Area
                    type="monotone"
                    dataKey="manufacturing"
                    stackId="2"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.6}
                    name="Manufacturing"
                  />
                  <Area
                    type="monotone"
                    dataKey="marketing"
                    stackId="2"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.6}
                    name="Marketing"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cost Categories Breakdown */}
          <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-600" />
                Cost Categories
              </CardTitle>
              <CardDescription className="text-gray-600">
                Detailed expense breakdown by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costCategoriesData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: category.color }} // eslint-disable-line react/style-prop-object
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{category.category}</p>
                        <p className="text-xs text-gray-500">{category.percentage}% of total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ${category.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Net Profit Margin</span>
                  <span className="text-lg font-bold text-green-600">25.0%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Products Bar Chart */}
          <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
                Top Performing Products
              </CardTitle>
              <CardDescription className="text-gray-600">
                Best-selling products by revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" />
                  <YAxis dataKey="name" type="category" width={100} stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-gray-600">
                Latest updates and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-100">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' :
                      activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                    {activity.status === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                    {activity.status === 'success' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Quick Actions */}
        <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
            <CardDescription className="text-gray-600">
              Common tasks and shortcuts for efficient management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center border-gray-300 hover:bg-gray-50">
                <Link href="/products">
                  <Package className="w-6 h-6 mb-2 text-blue-600" />
                  <span className="text-sm font-medium">Manage Products</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center border-gray-300 hover:bg-gray-50">
                <Link href="/product">
                  <BarChart3 className="w-6 h-6 mb-2 text-green-600" />
                  <span className="text-sm font-medium">Market Analysis</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center border-gray-300 hover:bg-gray-50">
                <Link href="/orders">
                  <ShoppingCart className="w-6 h-6 mb-2 text-purple-600" />
                  <span className="text-sm font-medium">View Orders</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center border-gray-300 hover:bg-gray-50">
                <Link href="/reports">
                  <TrendingUp className="w-6 h-6 mb-2 text-orange-600" />
                  <span className="text-sm font-medium">Generate Reports</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}