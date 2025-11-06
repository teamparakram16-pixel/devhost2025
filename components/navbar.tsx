"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="absolute inset-0 bg-linear-to-r from-blue-50/50 via-purple-50/30 to-indigo-50/50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between h-16 md:h-18">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-sm">RA</span>
              </div>
              <span className="text-xl md:text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">RetailAI</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group">
              Home
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                  Dashboard
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
                </Link>
                <Link href="/add-product" className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                  Add Product
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
                </Link>
                <div className="flex items-center space-x-3 ml-4">
                  <Link href="/profile">
                    <Button variant="outline" className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="w-4 h-4 bg-linear-to-br from-blue-500 to-purple-500 rounded-full"></div>
                      <span className="font-medium">{user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}</span>
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="w-4 h-4 bg-linear-to-br from-red-500 to-pink-500 rounded-full"></div>
                    <span>Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Button variant="outline" asChild className="bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70 shadow-md hover:shadow-lg transition-all duration-300">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-primary p-2 rounded-lg hover:bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-md"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-white/20 bg-white/90 backdrop-blur-xl shadow-xl">
            <div className="px-4 pt-4 pb-6 space-y-3">
              <Link
                href="/"
                className="block px-4 py-3 text-muted-foreground hover:text-primary hover:bg-white/50 rounded-lg transition-all duration-300 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 text-muted-foreground hover:text-primary hover:bg-white/50 rounded-lg transition-all duration-300 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/add-product"
                    className="block px-4 py-3 text-muted-foreground hover:text-primary hover:bg-white/50 rounded-lg transition-all duration-300 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Add Product
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-muted-foreground hover:text-primary hover:bg-white/50 rounded-lg transition-all duration-300 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <div className="px-4 py-3">
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 bg-white/50 backdrop-blur-sm border-white/30"
                    >
                      <div className="w-4 h-4 bg-linear-to-br from-red-500 to-pink-500 rounded-full"></div>
                      <span>Logout</span>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-3 px-4 py-3">
                  <Button variant="outline" asChild className="w-full bg-white/50 backdrop-blur-sm border-white/30">
                    <Link href="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                  </Button>
                  <Button asChild className="w-full bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg">
                    <Link href="/signup" onClick={() => setIsOpen(false)}>Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}