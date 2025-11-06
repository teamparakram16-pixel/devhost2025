
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Shield,
  BarChart3,
  Zap,
  Users,
  Package,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: BarChart3,
      title: "Demand Forecasting",
      description: "AI-powered predictions to optimize inventory and reduce waste",
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50"
    },
    {
      icon: TrendingUp,
      title: "Dynamic Pricing",
      description: "Real-time price optimization based on market conditions",
      gradient: "from-emerald-500 to-teal-500",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50"
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Minimize losses with intelligent supply chain insights",
      gradient: "from-violet-500 to-purple-500",
      bgColor: "bg-gradient-to-br from-violet-50 to-purple-50"
    },
    {
      icon: Zap,
      title: "Real-time Analytics",
      description: "Live dashboards and instant business intelligence",
      gradient: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50"
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-linear-to-r from-violet-500/10 to-purple-500/10 text-violet-700 border-violet-200">
              AI-Powered Retail Solutions
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Transform Your Retail
              <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block">
                Operations
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Leverage AI-driven demand forecasting and dynamic pricing to optimize inventory,
              maximize margins, and stay ahead of market trends in the competitive Nordic retail sector.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="gradient-primary" asChild>
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="hero-outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-tr from-pink-400/20 to-violet-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-cyan-400/10 to-emerald-400/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Features for Modern Retail
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI platform provides everything you need to optimize your retail operations
              and stay competitive in today's fast-paced market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`text-center hover:shadow-xl transition-all duration-300 border-border shadow-lg hover:shadow-primary/10 ${feature.bgColor} hover:scale-105`}>
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 bg-linear-to-br ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-linear-to-r from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">RetailAI</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join leading Nordic retailers who trust our AI solutions to drive growth
                and efficiency in their operations.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 shrink-0 ${
                      index === 0 ? 'bg-linear-to-r from-emerald-500 to-teal-500' :
                      index === 1 ? 'bg-linear-to-r from-blue-500 to-cyan-500' :
                      index === 2 ? 'bg-linear-to-r from-purple-500 to-violet-500' :
                      index === 3 ? 'bg-linear-to-r from-amber-500 to-orange-500' :
                      index === 4 ? 'bg-linear-to-r from-rose-500 to-pink-500' :
                      'bg-linear-to-r from-indigo-500 to-blue-500'
                    }`}>
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-foreground font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-linear-to-br from-white via-blue-50/50 to-purple-50/50 rounded-xl shadow-xl p-8 border border-border/50 backdrop-blur-sm">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Ready to Get Started?</h3>
                <p className="text-muted-foreground mt-2">
                  Join thousands of retailers optimizing their operations with AI
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-primary mr-3" />
                    <span className="font-medium text-foreground">Free Trial</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">30 Days</span>
                </div>
                <Button variant="default" className="w-full" size="lg" asChild>
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transform Your Retail Business Today
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Don't let outdated systems hold you back. Embrace the future of retail with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="gradient-primary" asChild>
              <Link href="/signup">Get Started Now</Link>
            </Button>
            <Button size="lg" variant="cta-outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
        {/* Background decoration for CTA */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        </div>
      </section>
    </div>
  );
}
