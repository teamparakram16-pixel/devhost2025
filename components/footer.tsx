import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-xl border-t border-white/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-blue-50/30 via-purple-50/20 to-indigo-50/30"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-linear-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl -translate-y-48"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6 group">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">RA</span>
              </div>
              <span className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">RetailAI</span>
            </div>
            <p className="text-muted-foreground mb-8 max-w-md leading-relaxed text-lg">
              AI-Driven Retail Demand Forecasting & Dynamic Pricing solution for Nordic retailers.
              Optimize inventory, predict demand, and maximize margins with data-driven insights.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="group">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <span className="text-white font-bold text-sm">f</span>
                </div>
              </a>
              <a href="#" aria-label="Twitter" className="group">
                <div className="w-12 h-12 bg-linear-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <span className="text-white font-bold text-sm">t</span>
                </div>
              </a>
              <a href="#" aria-label="Instagram" className="group">
                <div className="w-12 h-12 bg-linear-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <span className="text-white font-bold text-sm">i</span>
                </div>
              </a>
              <a href="#" aria-label="LinkedIn" className="group">
                <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <span className="text-white font-bold text-sm">in</span>
                </div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group flex items-center">
                  <div className="w-2 h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Home
                  <div className="absolute -bottom-1 left-5 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 group-hover:w-16 transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group flex items-center">
                  <div className="w-2 h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Dashboard
                  <div className="absolute -bottom-1 left-5 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 group-hover:w-20 transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link href="/add-product" className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group flex items-center">
                  <div className="w-2 h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Add Product
                  <div className="absolute -bottom-1 left-5 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 group-hover:w-24 transition-all duration-300"></div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Support</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group flex items-center">
                  <div className="w-2 h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Help Center
                  <div className="absolute -bottom-1 left-5 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 group-hover:w-20 transition-all duration-300"></div>
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group flex items-center">
                  <div className="w-2 h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Contact Us
                  <div className="absolute -bottom-1 left-5 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 group-hover:w-18 transition-all duration-300"></div>
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group flex items-center">
                  <div className="w-2 h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Privacy Policy
                  <div className="absolute -bottom-1 left-5 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 group-hover:w-24 transition-all duration-300"></div>
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group flex items-center">
                  <div className="w-2 h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Terms of Service
                  <div className="absolute -bottom-1 left-5 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 group-hover:w-28 transition-all duration-300"></div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/30 mt-12 pt-8 text-center">
          <p className="text-muted-foreground text-lg font-medium">
            © 2025 RetailAI. All rights reserved. |
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold ml-2">
              Powered by AI for Nordic Retail Excellence
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}