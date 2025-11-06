"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function ProfilePage() {
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
            <CardDescription>Please sign in to view your profile</CardDescription>
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

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Profile</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <div className="w-12 h-12 bg-white/30 rounded-xl"></div>
                </div>
                <CardTitle className="text-xl font-bold">{user.user_metadata?.name || user.email?.split('@')[0] || 'User'}</CardTitle>
                <CardDescription className="text-base">{user.email}</CardDescription>
                <Badge variant="secondary" className="mt-3 font-medium">
                  <div className="w-3 h-3 mr-1 bg-green-500 rounded-full"></div>
                  Verified Account
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground p-3 bg-slate-50 rounded-lg">
                  <div className="w-4 h-4 bg-linear-to-br from-indigo-500 to-purple-500 rounded"></div>
                  <span>Member since {new Date().toLocaleDateString()}</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start hover:bg-blue-50 transition-colors" asChild>
                      <Link href="/dashboard">
                        <div className="w-4 h-4 mr-2 bg-linear-to-br from-blue-500 to-cyan-500 rounded"></div>
                        View Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start hover:bg-blue-50 transition-colors" asChild>
                      <Link href="/add-product">
                        <div className="w-4 h-4 mr-2 bg-linear-to-br from-purple-500 to-pink-500 rounded"></div>
                        Add Product
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                    <div className="w-5 h-5 bg-white/30 rounded"></div>
                  </div>
                  <div>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Your account details and basic information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-semibold">Full Name</Label>
                    <Input
                      id="name"
                      value={user.user_metadata?.name || ''}
                      placeholder="Enter your full name"
                      readOnly
                      className="bg-slate-50 border-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-semibold">Email Address</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-3.5 w-4 h-4 bg-linear-to-br from-blue-500 to-purple-500 rounded-full"></div>
                      <Input
                        id="email"
                        value={user.email}
                        readOnly
                        className="pl-10 bg-slate-50 border-2"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userId" className="font-semibold">User ID</Label>
                  <Input
                    id="userId"
                    value={user.id}
                    readOnly
                    className="bg-gray-50 font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                    <div className="w-5 h-5 bg-white/30 rounded-lg"></div>
                  </div>
                  <div>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>
                      Your company details registered with RetailAI
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="font-semibold">Company Name</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-3.5 w-4 h-4 bg-linear-to-br from-indigo-500 to-purple-500 rounded-lg"></div>
                      <Input
                        id="company"
                        value={user.user_metadata?.name || 'Not specified'}
                        placeholder="Your company name"
                        readOnly
                        className="pl-10 bg-slate-50 border-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="font-semibold">Role</Label>
                    <Input
                      id="role"
                      value="Company Administrator"
                      readOnly
                      className="bg-slate-50 border-2"
                    />
                  </div>
                </div>
                <Separator />
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Account Status</h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                    <span className="text-sm text-blue-700">
                      Your account is active and ready to use all RetailAI features
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                    <div className="w-5 h-5 bg-white/30 rounded"></div>
                  </div>
                  <div>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security and authentication
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border-2 rounded-lg bg-slate-50">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-gray-600">Last updated recently</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}