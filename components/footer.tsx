import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl font-bold text-gray-900">RetailAI</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              AI-Driven Retail Demand Forecasting & Dynamic Pricing solution for Nordic retailers.
              Optimize inventory, predict demand, and maximize margins with data-driven insights.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-gray-600 font-bold text-sm">f</span>
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-gray-600 font-bold text-sm">t</span>
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-gray-600 font-bold text-sm">i</span>
              </a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-gray-600 font-bold text-sm">in</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/add-product" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Add Product
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-gray-600">
            © 2025 RetailAI. All rights reserved.
            {/* <span className="text-blue-600 font-medium ml-2">
              Powered by AI for Nordic Retail Excellence
            </span> */}
          </p>
        </div>
      </div>
    </footer>
  );
}