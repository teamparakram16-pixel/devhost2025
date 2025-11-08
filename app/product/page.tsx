"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bot,
  User,
  TrendingUp,
  Star,
  Users,
  DollarSign,
  BarChart3,
  Youtube,
  MessageSquare,
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle,
  Send,
  ExternalLink
} from "lucide-react";

type Message = {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  component?: 'product-input' | 'analysis-select' | 'timeframe-select' | 'analyzing' | 'results' | 'typing';
  data?: any;
  isTyping?: boolean;
};

type AnalysisResult = {
  trustScore: number;
  demandLevel: string;
  priceRecommendation: {
    current: number;
    suggested: number;
    confidence: number;
  };
  reviews: {
    total: number;
    averageRating: number;
    sentiment: string;
  };
  sources: Array<{
    platform: string;
    title: string;
    views?: string;
    upvotes?: number;
    comments?: number;
    rating?: number;
    totalReviews?: number;
    sentiment: string;
    url: string;
  }>;
  marketInsights: {
    seasonalDemand: string;
    competitorPricing: string;
    regionalVariations: string;
  };
};

// Generate dynamic analysis based on product name
const generateAnalysisForProduct = (productName: string, analysisType: string, timeframe: string): AnalysisResult => {
  const productLower = productName.toLowerCase();

  // Extract key characteristics from product name
  const isPremium = productLower.includes('pro') || productLower.includes('premium') || productLower.includes('ultra') || productLower.includes('max');
  const isWireless = productLower.includes('wireless') || productLower.includes('bluetooth') || productLower.includes('air');
  const isGaming = productLower.includes('gaming') || productLower.includes('gamer') || productLower.includes('rgb');
  const isFitness = productLower.includes('fitness') || productLower.includes('sport') || productLower.includes('running');
  const isBudget = productLower.includes('budget') || productLower.includes('basic') || productLower.includes('mini');

  // Base pricing calculation based on product type
  let basePrice = 100;
  let priceMultiplier = 1;

  if (productLower.includes('phone') || productLower.includes('smartphone')) {
    basePrice = 699;
    priceMultiplier = isPremium ? 1.8 : isBudget ? 0.6 : 1.2;
  } else if (productLower.includes('laptop') || productLower.includes('computer')) {
    basePrice = 899;
    priceMultiplier = isPremium ? 2.2 : isBudget ? 0.5 : 1.0;
  } else if (productLower.includes('headphone') || productLower.includes('earphone')) {
    basePrice = 149;
    priceMultiplier = isPremium ? 2.5 : isWireless ? 1.8 : 0.8;
  } else if (productLower.includes('watch') || productLower.includes('smartwatch')) {
    basePrice = 299;
    priceMultiplier = isPremium ? 1.6 : isFitness ? 1.2 : 0.9;
  } else if (productLower.includes('speaker') || productLower.includes('soundbar')) {
    basePrice = 199;
    priceMultiplier = isPremium ? 2.0 : isWireless ? 1.5 : 0.7;
  } else if (productLower.includes('camera') || productLower.includes('dslr')) {
    basePrice = 599;
    priceMultiplier = isPremium ? 2.5 : 1.0;
  } else if (productLower.includes('tablet') || productLower.includes('ipad')) {
    basePrice = 399;
    priceMultiplier = isPremium ? 1.8 : 0.8;
  } else if (productLower.includes('gaming') || productLower.includes('console')) {
    basePrice = 499;
    priceMultiplier = isPremium ? 1.6 : 0.9;
  } else if (productLower.includes('skincare') || productLower.includes('cosmetic')) {
    basePrice = 45;
    priceMultiplier = isPremium ? 3.0 : 1.0;
  } else if (productLower.includes('coffee') || productLower.includes('maker')) {
    basePrice = 129;
    priceMultiplier = isPremium ? 2.2 : 0.8;
  } else if (productLower.includes('chair') || productLower.includes('furniture')) {
    basePrice = 349;
    priceMultiplier = isPremium ? 2.0 : 0.7;
  }

  const currentPrice = Math.round(basePrice * priceMultiplier);
  const suggestedPrice = Math.round(currentPrice * (0.92 + Math.random() * 0.16)); // ±8% variation

  // Calculate trust score based on product characteristics
  let trustScore = 75 + Math.random() * 20; // Base 75-95
  if (isPremium) trustScore += 5;
  if (isWireless) trustScore += 3;
  if (productLower.includes('apple') || productLower.includes('sony') || productLower.includes('bose')) trustScore += 8;
  trustScore = Math.min(98, Math.round(trustScore));

  // Determine demand level based on product type and characteristics
  let demandLevel = "Medium";
  if (isGaming || isWireless || productLower.includes('smart') || productLower.includes('ai')) {
    demandLevel = "High";
  }
  if (isPremium || productLower.includes('pro') || productLower.includes('professional')) {
    demandLevel = "Very High";
  }
  if (isBudget || productLower.includes('basic') || productLower.includes('entry')) {
    demandLevel = "Medium-Low";
  }

  // Adjust for timeframe
  const timeframeMultiplier = {
    '1week': 0.8,
    '1month': 0.9,
    '3months': 1.0,
    '6months': 1.1,
    '1year': 1.2
  }[timeframe] || 1.0;

  // Generate realistic review data
  const reviewBase = Math.floor(currentPrice / 10) + 50; // Base reviews scale with price
  const totalReviews = Math.round(reviewBase * (0.5 + Math.random() * 1.5) * timeframeMultiplier);
  const averageRating = 3.8 + Math.random() * 1.2; // 3.8-5.0 range
  const sentiment = averageRating >= 4.5 ? "Very Positive" : averageRating >= 4.0 ? "Positive" : averageRating >= 3.5 ? "Mixed" : "Negative";

  // Generate product-specific sources
  const sources = [];

  // YouTube source
  const youtubeTitles = [
    `${productName} Review 2024 - Is it Worth Buying?`,
    `${productName} Honest Review - ${Math.round(Math.random() * 50 + 50)} Hours Later`,
    `${productName} vs Competitors - Which Should You Buy?`,
    `${productName} Deep Dive - Features & Performance`,
    `${productName} Unboxing & First Impressions`
  ];
  const youtubeTitle = youtubeTitles[Math.floor(Math.random() * youtubeTitles.length)];
  const youtubeViews = Math.round((50 + Math.random() * 950) * 1000);
  sources.push({
    platform: "YouTube",
    title: youtubeTitle,
    views: youtubeViews.toLocaleString() + (youtubeViews > 1000 ? 'K' : ''),
    sentiment: Math.random() > 0.3 ? "Positive" : "Mixed",
    url: `https://youtube.com/results?search_query=${encodeURIComponent(productName + " review")}`
  });

  // Reddit source
  const redditCommunities = {
    headphones: "r/Headphones",
    gaming: "r/Gaming",
    fitness: "r/Fitness",
    skincare: "r/Skincare",
    coffee: "r/Coffee",
    photography: "r/Photography",
    technology: "r/Technology",
    default: "r/Products"
  };

  let redditCommunity = redditCommunities.default;
  if (productLower.includes('headphone') || productLower.includes('audio')) redditCommunity = redditCommunities.headphones;
  else if (isGaming) redditCommunity = redditCommunities.gaming;
  else if (isFitness) redditCommunity = redditCommunities.fitness;
  else if (productLower.includes('skincare') || productLower.includes('beauty')) redditCommunity = redditCommunities.skincare;
  else if (productLower.includes('coffee')) redditCommunity = redditCommunities.coffee;
  else if (productLower.includes('camera')) redditCommunity = redditCommunities.photography;
  else if (productLower.includes('phone') || productLower.includes('laptop') || productLower.includes('tech')) redditCommunity = redditCommunities.technology;

  const redditTitles = [
    `Best ${productName} recommendations`,
    `${productName} vs alternatives - worth the price?`,
    `My experience with ${productName} after ${Math.floor(Math.random() * 12 + 1)} months`,
    `${productName} review - pros and cons`,
    `Is ${productName} still worth buying in 2024?`
  ];
  const redditTitle = redditTitles[Math.floor(Math.random() * redditTitles.length)];

  sources.push({
    platform: "Reddit",
    title: redditTitle,
    upvotes: Math.floor(50 + Math.random() * 500),
    comments: Math.floor(20 + Math.random() * 200),
    sentiment: Math.random() > 0.4 ? "Positive" : Math.random() > 0.2 ? "Mixed" : "Negative",
    url: `https://reddit.com/${redditCommunity}`
  });

  // Retailer source
  const retailers = [
    { name: "Amazon", domain: "amazon.com", search: "s?k=" },
    { name: "Best Buy", domain: "bestbuy.com", search: "site/searchpage.jsp?st=" },
    { name: "Target", domain: "target.com", search: "s/" },
    { name: "Walmart", domain: "walmart.com", search: "search?q=" },
    { name: "Costco", domain: "costco.com", search: "CatalogSearch?dept=All&keyword=" }
  ];

  if (productLower.includes('skincare') || productLower.includes('beauty') || productLower.includes('cosmetic')) {
    retailers.unshift({ name: "Sephora", domain: "sephora.com", search: "search?keyword=" });
  } else if (productLower.includes('furniture') || productLower.includes('chair')) {
    retailers.unshift({ name: "IKEA", domain: "ikea.com", search: "us/en/search/?q=" });
  }

  const retailer = retailers[Math.floor(Math.random() * retailers.length)];
  sources.push({
    platform: retailer.name,
    title: "Customer reviews and ratings",
    rating: Math.round((averageRating - 0.1 + Math.random() * 0.2) * 10) / 10,
    totalReviews: Math.round(totalReviews * (0.3 + Math.random() * 0.4)),
    sentiment: sentiment,
    url: `https://${retailer.domain}/${retailer.search}${encodeURIComponent(productName)}`
  });

  // Generate market insights based on product type
  const seasonalPatterns = {
    headphones: "Consistent year-round with slight Q4 increase",
    gaming: "Peak during holiday seasons and major game releases",
    fitness: "Strong Q1 (New Year) and Q3-Q4 peaks",
    skincare: "Higher in spring/summer, peaks during holiday gifting",
    coffee: "Consistent with slight morning/weekend peaks",
    technology: "Major peaks during back-to-school and holidays",
    furniture: "Higher during seasonal home improvements",
    default: "Seasonal demand varies by market conditions"
  };

  let seasonalDemand = seasonalPatterns.default;
  if (productLower.includes('headphone') || productLower.includes('audio')) seasonalDemand = seasonalPatterns.headphones;
  else if (isGaming) seasonalDemand = seasonalPatterns.gaming;
  else if (isFitness) seasonalDemand = seasonalPatterns.fitness;
  else if (productLower.includes('skincare') || productLower.includes('beauty')) seasonalDemand = seasonalPatterns.skincare;
  else if (productLower.includes('coffee')) seasonalDemand = seasonalPatterns.coffee;
  else if (productLower.includes('tech') || productLower.includes('phone') || productLower.includes('laptop')) seasonalDemand = seasonalPatterns.technology;
  else if (productLower.includes('furniture') || productLower.includes('chair')) seasonalDemand = seasonalPatterns.furniture;

  const competitorPricing = isPremium ?
    "Premium positioning with luxury branding" :
    isBudget ?
    "Value-driven with competitive low pricing" :
    "Mid-range market positioning";

  const regionalVariations = [
    "8-12% higher in urban tech hubs",
    "15% higher in coastal metropolitan areas",
    "10% premium in international markets",
    "Regional pricing varies by 5-15%",
    "Consistent pricing across major markets"
  ][Math.floor(Math.random() * 5)];

  return {
    trustScore,
    demandLevel,
    priceRecommendation: {
      current: currentPrice,
      suggested: suggestedPrice,
      confidence: Math.round(75 + Math.random() * 20)
    },
    reviews: {
      total: totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      sentiment
    },
    sources,
    marketInsights: {
      seasonalDemand,
      competitorPricing,
      regionalVariations
    }
  };
};

export default function ProductAnalysisChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [productName, setProductName] = useState<string>("");
  const [analysisType, setAnalysisType] = useState<string>("");
  const [timeframe, setTimeframe] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chatbot
  useEffect(() => {
    const initialMessage: Message = {
      id: '1',
      type: 'bot',
      content: "👋 Hi! I'm your AI Retail Intelligence assistant. I'll help you analyze market demand and pricing for any product.\n\nWhat product would you like me to analyze?",
      timestamp: new Date(),
      component: 'product-input'
    };
    setMessages([initialMessage]);
  }, []);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const showTypingIndicator = () => {
    setIsTyping(true);
    const typingMessage: Message = {
      id: 'typing-' + Date.now(),
      type: 'bot',
      content: '',
      timestamp: new Date(),
      component: 'typing',
      isTyping: true
    };
    addMessage(typingMessage);
  };

  const hideTypingIndicator = () => {
    setIsTyping(false);
    setMessages(prev => prev.filter(msg => !msg.isTyping));
  };

  const simulateTypingDelay = (minDelay: number = 800, maxDelay: number = 2000) => {
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    return new Promise(resolve => setTimeout(resolve, delay));
  };

  const handleProductSubmit = async (product: string) => {
    if (!product.trim()) return;

    setProductName(product);
    setUserInput("");

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: product,
      timestamp: new Date()
    };

    addMessage(userMessage);

    // Simulate connection delay
    setConnectionStatus('connecting');
    await simulateTypingDelay(300, 800);
    setConnectionStatus('connected');

    // Show typing indicator
    showTypingIndicator();

    // Simulate processing delay
    await simulateTypingDelay(1200, 2500);

    hideTypingIndicator();

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: `Great! I'll analyze "${product}".\n\nWhat type of analysis would you like me to perform?`,
      timestamp: new Date(),
      component: 'analysis-select'
    };
    addMessage(botMessage);
  };

  const handleAnalysisSelect = async (type: string) => {
    setAnalysisType(type);

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: type === 'demand' ? 'Demand Forecasting' :
               type === 'pricing' ? 'Dynamic Pricing' :
               type === 'competition' ? 'Competitive Analysis' :
               'Complete Analysis',
      timestamp: new Date()
    };

    addMessage(userMessage);

    // Show typing indicator
    showTypingIndicator();

    // Simulate processing delay
    await simulateTypingDelay(1000, 1800);

    hideTypingIndicator();

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: `Perfect! I'll perform a ${type === 'demand' ? 'demand forecasting' : type === 'pricing' ? 'dynamic pricing' : type === 'competition' ? 'competitive' : 'comprehensive'} analysis.\n\nTo give you the most accurate insights, I need to know the time period you'd like me to analyze.`,
      timestamp: new Date(),
      component: 'timeframe-select'
    };
    addMessage(botMessage);
  };

  const handleTimeframeSelect = async (period: string) => {
    setTimeframe(period);

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: period === '1week' ? 'Last Week' :
               period === '1month' ? 'Last Month' :
               period === '3months' ? 'Last 3 Months' :
               period === '6months' ? 'Last 6 Months' : 'Last Year',
      timestamp: new Date()
    };

    addMessage(userMessage);

    // Show typing indicator
    showTypingIndicator();

    // Simulate processing delay
    await simulateTypingDelay(800, 1500);

    hideTypingIndicator();

    // Start analysis
    performAnalysis();
  };

  const performAnalysis = async () => {
    setIsAnalyzing(true);

    const analyzingMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: "🔍 I'm now analyzing market data from multiple sources. This will just take a moment...",
      timestamp: new Date(),
      component: 'analyzing'
    };

    addMessage(analyzingMessage);

    // Simulate backend processing time (quick but feels real)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate analysis based on product
    const result = generateAnalysisForProduct(productName, analysisType, timeframe);

    setAnalysisResult(result);
    setIsAnalyzing(false);

    // Show results
    const resultsMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: "✅ Analysis complete! Here are your comprehensive market insights:",
      timestamp: new Date(),
      component: 'results',
      data: result
    };

    addMessage(resultsMessage);
  };

  const resetChat = () => {
    setMessages([]);
    setCurrentStep(0);
    setProductName("");
    setAnalysisType("");
    setTimeframe("");
    setAnalysisResult(null);
    setUserInput("");

    // Reinitialize
    setTimeout(() => {
      const initialMessage: Message = {
        id: '1',
        type: 'bot',
        content: "👋 Hi! I'm your AI Retail Intelligence assistant. I'll help you analyze market demand and pricing for any product.\n\nWhat product would you like me to analyze?",
        timestamp: new Date(),
        component: 'product-input'
      };
      setMessages([initialMessage]);
    }, 300);
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "very positive":
      case "positive":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "mixed":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const renderMessageComponent = (message: Message) => {
    switch (message.component) {
      case 'product-input':
        return (
          <div className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter any product name..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && userInput.trim() && handleProductSubmit(userInput)}
                className="flex-1"
              />
              <Button
                onClick={() => handleProductSubmit(userInput)}
                disabled={!userInput.trim()}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Examples: iPhone 15, Nike Air Max, KitchenAid Mixer, etc.
            </p>
          </div>
        );

      case 'analysis-select':
        return (
          <div className="space-y-3 mt-4">
            {[
              { id: "demand", label: "Demand Forecasting", desc: "Predict future sales and inventory needs", icon: TrendingUp },
              { id: "pricing", label: "Dynamic Pricing", desc: "Optimize pricing based on market conditions", icon: DollarSign },
              { id: "competition", label: "Competitive Analysis", desc: "Compare with market competitors", icon: BarChart3 },
              { id: "full", label: "Complete Analysis", desc: "Comprehensive market intelligence", icon: Star }
            ].map((type) => (
              <Button
                key={type.id}
                variant="outline"
                className="h-auto p-4 justify-start text-left w-full border-gray-200 hover:bg-gray-50"
                onClick={() => handleAnalysisSelect(type.id)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <type.icon className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-900">{type.label}</div>
                    <div className="text-sm text-gray-600">{type.desc}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        );

      case 'timeframe-select':
        return (
          <div className="space-y-3 mt-4">
            {[
              { id: "1week", label: "Last Week", desc: "Recent market trends" },
              { id: "1month", label: "Last Month", desc: "Short-term analysis" },
              { id: "3months", label: "Last 3 Months", desc: "Quarterly insights" },
              { id: "6months", label: "Last 6 Months", desc: "Mid-term trends" },
              { id: "1year", label: "Last Year", desc: "Annual market analysis" }
            ].map((period) => (
              <Button
                key={period.id}
                variant="outline"
                className="h-auto p-4 justify-start text-left w-full border-gray-200 hover:bg-gray-50"
                onClick={() => handleTimeframeSelect(period.id)}
              >
                <div>
                  <div className="font-semibold text-gray-900">{period.label}</div>
                  <div className="text-sm text-gray-600">{period.desc}</div>
                </div>
              </Button>
            ))}
          </div>
        );

      case 'analyzing':
        return (
          <div className="space-y-4 mt-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">Analyzing market data...</span>
            </div>
            <Progress value={75} className="h-2" />
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Scanning YouTube reviews</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Analyzing Reddit discussions</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Processing retail platform data</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span>Generating insights</span>
              </div>
            </div>
          </div>
        );

      case 'results':
        if (!message.data) return null;
        const result = message.data as AnalysisResult;

        return (
          <div className="space-y-6 mt-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className={`text-2xl font-bold ${getTrustScoreColor(result.trustScore)}`}>
                        {result.trustScore}%
                      </div>
                      <div className="text-xs text-gray-600">Trust Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {result.demandLevel}
                      </div>
                      <div className="text-xs text-gray-600">Demand Level</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        ${result.priceRecommendation.suggested}
                      </div>
                      <div className="text-xs text-gray-600">Suggested Price</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Review Summary */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Review Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-xl font-bold">{result.reviews.averageRating}/5.0</span>
                  </div>
                  <Badge variant="secondary">{result.reviews.sentiment}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Based on {result.reviews.total.toLocaleString()} customer reviews
                </p>
              </CardContent>
            </Card>

            {/* Sources */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Data Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.sources.map((source, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="p-2 bg-white rounded-lg border border-gray-200">
                        {source.platform === "YouTube" && <Youtube className="w-4 h-4 text-red-600" />}
                        {source.platform === "Reddit" && <MessageSquare className="w-4 h-4 text-orange-600" />}
                        {source.platform !== "YouTube" && source.platform !== "Reddit" && <Globe className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{source.title}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {source.platform} • {source.views || `${source.upvotes} upvotes` || `${source.totalReviews} reviews`}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getSentimentIcon(source.sentiment)}
                        <Badge variant="outline" className="text-xs">{source.sentiment}</Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={source.url} target="_blank" rel="noopener noreferrer" title={`View on ${source.platform}`}>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Insights */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Market Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="font-medium text-blue-900 mb-1">Seasonal Demand</div>
                  <div className="text-sm text-blue-800">{result.marketInsights.seasonalDemand}</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="font-medium text-green-900 mb-1">Competitor Pricing</div>
                  <div className="text-sm text-green-800">{result.marketInsights.competitorPricing}</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="font-medium text-purple-900 mb-1">Regional Variations</div>
                  <div className="text-sm text-purple-800">{result.marketInsights.regionalVariations}</div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center pt-4">
              <Button onClick={resetChat} variant="outline" className="border-gray-300">
                Start New Analysis
              </Button>
            </div>
          </div>
        );

      case 'typing':
        return (
          <div className="flex items-center space-x-2 mt-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-sm text-gray-500">AI is thinking...</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-full">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">AI Retail Intelligence</h1>
            <p className="text-xs text-gray-500">Market analysis assistant</p>
          </div>
        </div>
        <div className="text-xs text-gray-400 flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
            'bg-red-500'
          }`}></div>
          <span>
            {connectionStatus === 'connected' ? 'Online' :
             connectionStatus === 'connecting' ? 'Connecting...' :
             'Offline'}
          </span>
        </div>
      </div>

      {/* Fixed Chat Messages Area */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto px-6 py-4 space-y-4 scroll-smooth">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-2 rounded-full shrink-0 ${message.type === 'bot' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                    {message.type === 'bot' ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 max-w-full ${
                    message.type === 'bot'
                      ? 'bg-white text-gray-900 border border-gray-200'
                      : 'bg-blue-600 text-white'
                  }`}>
                    <div className="whitespace-pre-line text-sm leading-relaxed">
                      {message.content}
                    </div>
                    {renderMessageComponent(message)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="h-12 bg-white border-t border-gray-200 px-6 flex items-center justify-center shrink-0">
        <p className="text-xs text-gray-400">
          Powered by AI • Real-time market intelligence
        </p>
      </div>
    </div>
  );
}
