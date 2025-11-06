
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const features = [
    {
      title: "Demand Forecasting",
      description: "AI-powered predictions to optimize inventory and reduce waste",
      icon: "📊"
    },
    {
      title: "Dynamic Pricing",
      description: "Real-time price optimization based on market conditions",
      icon: "💰"
    },
    {
      title: "Risk Management",
      description: "Minimize losses with intelligent supply chain insights",
      icon: "🛡️"
    },
    {
      title: "Real-time Analytics",
      description: "Live dashboards and instant business intelligence",
      icon: "📈"
    }
  ];

  const benefits = [
    "Reduce inventory costs by up to 30%",
    "Increase profit margins with dynamic pricing",
    "Predict demand with 95% accuracy",
    "Real-time market insights",
    "Seamless ERP integration",
    "24/7 AI-powered support"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Retail
              <span className="block text-blue-600 mt-2">Operations with AI</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Leverage AI-driven demand forecasting and dynamic pricing to optimize inventory,
              maximize margins, and stay ahead of market trends in the competitive Nordic retail sector.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg" asChild>
                <Link href="/signup">
                  Get Started Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Advanced Retail Intelligence
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI platform provides everything you need to optimize your retail operations
              and stay competitive in today's fast-paced market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Benefits</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Why Choose RetailAI?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join leading Nordic retailers who trust our AI solutions to drive growth
                and efficiency in their operations.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-blue-600 mr-3 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Ready to Get Started?</h3>
                <p className="text-gray-600">
                  Join thousands of retailers optimizing their operations with AI
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-5 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="font-semibold text-gray-900">Free Trial</span>
                  <span className="text-2xl font-bold text-blue-600">30 Days</span>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg" size="lg" asChild>
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transform Your Retail Business Today
          </h2>
          <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
            Don't let outdated systems hold you back. Embrace the future of retail with AI-powered insights
            and take your business to the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg" asChild>
              <Link href="/signup">Get Started Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700 px-8 py-3 text-lg" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
