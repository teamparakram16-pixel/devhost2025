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

interface CompanyData {
  id: string;
  company_name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export default function CompanyProfilePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session and company data
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);

      if (session?.user) {
        // Fetch company data
        const { data: companyData, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (companyData && !error) {
          setCompany(companyData);
        }
      }

      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);

        if (session?.user) {
          // Fetch company data
          const { data: companyData, error } = await supabase
            .from('companies')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (companyData && !error) {
            setCompany(companyData);
          }
        } else {
          setCompany(null);
        }

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
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md shadow-lg border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to view your company profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-600 mt-2">Manage your company settings and account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Overview */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {company?.company_name?.charAt(0)?.toUpperCase() || 'C'}
                  </span>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">{company?.company_name || 'Company Name'}</CardTitle>
                <CardDescription className="text-gray-600">{user?.email}</CardDescription>
                <Badge variant="secondary" className="mt-3 bg-green-100 text-green-800 hover:bg-green-100">
                  Active Company
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                  Member since {company?.created_at ? new Date(company.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                </div>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-900">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start border-gray-300 hover:bg-blue-50 hover:border-blue-300" asChild>
                      <Link href="/dashboard">
                        View Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start border-gray-300 hover:bg-blue-50 hover:border-blue-300" asChild>
                      <Link href="/add-product">
                        Add Product
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Account Information</CardTitle>
                <CardDescription className="text-gray-600">
                  Your account details and authentication information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-semibold text-gray-900">Email Address</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      readOnly
                      className="bg-gray-50 border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userId" className="font-semibold text-gray-900">User ID</Label>
                    <Input
                      id="userId"
                      value={user?.id || ''}
                      readOnly
                      className="bg-gray-50 font-mono text-sm border-gray-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType" className="font-semibold text-gray-900">Account Type</Label>
                  <Input
                    id="accountType"
                    value="Company Administrator"
                    readOnly
                    className="bg-gray-50 border-gray-300"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Company Information</CardTitle>
                <CardDescription className="text-gray-600">
                  Your company details registered with RetailAI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="font-semibold text-gray-900">Company Name</Label>
                    <Input
                      id="company"
                      value={company?.company_name || 'Not specified'}
                      placeholder="Your company name"
                      readOnly
                      className="bg-gray-50 border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail" className="font-semibold text-gray-900">Company Email</Label>
                    <Input
                      id="companyEmail"
                      value={company?.email || user?.email || ''}
                      readOnly
                      className="bg-gray-50 border-gray-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationDate" className="font-semibold text-gray-900">Registration Date</Label>
                  <Input
                    id="registrationDate"
                    value={company?.created_at ? new Date(company.created_at).toLocaleDateString() : 'Not available'}
                    readOnly
                    className="bg-gray-50 border-gray-300"
                  />
                </div>
                <Separator />
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Company Status</h4>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Active
                    </Badge>
                    <span className="text-sm text-blue-700">
                      Your company account is active and ready to use all RetailAI features
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Security Settings</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage your company account security and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <div>
                    <h4 className="font-medium text-gray-900">Account Password</h4>
                    <p className="text-sm text-gray-600">Last updated recently</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-300 hover:bg-blue-50 hover:border-blue-300">
                    Change Password
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your company account</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-300 hover:bg-blue-50 hover:border-blue-300">
                    Enable 2FA
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Team Members</h4>
                    <p className="text-sm text-gray-600">Manage access for your team members</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-300 hover:bg-blue-50 hover:border-blue-300">
                    Manage Team
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