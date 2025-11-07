"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Send, MessageCircle, CheckCircle, Clock, Save } from "lucide-react";
import { axiosClient } from "@/lib/axiosClient";

// --- Simple product type for dropdown ---
type ProdOption = { id: string; name: string };

// --- Types ---
type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
};

type ConversationStep = {
  step: number;
  question: string;
  replies: string[];
};

// --- Conversation Data ---
// This flow focuses on finance / ERP / POS product listings (watches, shoes, etc.)
const conversationFlow: ConversationStep[] = [
  {
    step: 0,
    question:
      "Hi — I'm Leeco. I can help analyze demand for your POS/ERP product listings. Which product category should we analyze?",
    replies: [
      "Watches",
      "Shoes",
      "Apparel",
      "Electronics",
      "Accessories",
      "Home & Kitchen",
      "Grocery",
      "Sports & Outdoors",
      "Other",
    ],
  },
  {
    step: 1,
    question: "Which sales channels are most important for this product?",
    replies: [
      "In‑store POS",
      "Online store",
      "Marketplaces (Amazon / eBay)",
      "Wholesale / Distributors",
      "Omnichannel",
    ],
  },
  {
    step: 2,
    question: "What's the typical price range or current SKU price?",
    replies: ["<$50", "$50‑$150", "$150‑$300", "$300+", "Variable / Multiple SKUs"],
  },
  {
    step: 3,
    question: "What is your primary business objective for this product?",
    replies: [
      "Increase price / margin",
      "Clear inventory",
      "Grow market share",
      "Introduce promotions",
      "Bundle / cross‑sell",
    ],
  },
  {
    step: 4,
    question: "Which timeframe should the demand roadmap focus on?",
    replies: [
      "Next 1 month",
      "Quarter (3 months)",
      "6 months",
      "Seasonal (e.g. Holidays)",
      "Year‑round",
    ],
  },
];

// --- Main Page Component ---
export default function Home() {
  // --- State Hooks ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isThinking, setIsThinking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Demand analysis states
  const [productIdInput, setProductIdInput] = useState<string>("");
  const [products, setProducts] = useState<ProdOption[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [demandQuestion, setDemandQuestion] = useState<string | null>(null);
  const [demandAnswers, setDemandAnswers] = useState<string[]>([]);
  const [demandLoading, setDemandLoading] = useState(false);
  const [demandPath, setDemandPath] = useState<string | null>(null);
  const [demandSources, setDemandSources] = useState<any[] | null>(null);
  const [threadInfo, setThreadInfo] = useState<any | null>(null);

  // --- Effects ---
  // Start the conversation with the first AI message
  useEffect(() => {
    setMessages([
      {
        id: "start",
        sender: "ai",
        text: conversationFlow[0].question,
      },
    ]);

    // Fetch products for dropdown (initial load)
    (async function fetchProducts() {
      try {
        console.log("Fetching products for demand analysis...");
        const resp = await axiosClient.get("/company/getProducts");
        const data = resp?.data;
        const list: any[] = data?.products ?? data?.products ?? data?.products ?? [];

        // normalize to id/name
        const opts: ProdOption[] =
          Array.isArray(list) && list.length > 0
            ? list.map((p: any) => ({ id: p.id, name: p.name ?? p.id }))
            : [];

        setProducts(opts);
        if (opts.length > 0) {
          setSelectedProductId(opts[0].id);
          setProductIdInput(opts[0].id);
        }
      } catch (err) {
        console.warn("Failed to fetch products for dropdown", err);
      }
    })();
  }, []);

  // Smooth scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0 && chatEndRef.current) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        chatEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest"
        });
      });
    }
  }, [messages.length]); // Only depend on message count, not the entire messages array

  // Auto-scroll when thinking state changes (but only if we're at the bottom)
  useEffect(() => {
    if (isThinking && chatEndRef.current) {
      const container = chatEndRef.current.parentElement;
      if (container) {
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
        if (isAtBottom) {
          requestAnimationFrame(() => {
            chatEndRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "end"
            });
          });
        }
      }
    }
  }, [isThinking]);

  // Progress animation effect
  useEffect(() => {
    if (showModal) {
      setProgress(0);
      setCurrentStepIndex(0);

      const steps = [
        { progress: 25, delay: 1000 },
        { progress: 50, delay: 2000 },
        { progress: 75, delay: 3000 },
        { progress: 100, delay: 4000 }
      ];

      steps.forEach((step, index) => {
        setTimeout(() => {
          setProgress(step.progress);
          setCurrentStepIndex(index + 1);
        }, step.delay);
      });
    }
  }, [showModal]);

  // --- Core Logic ---
  const handleReplyClick = (replyText: string) => {
    // 1. Add user's message to chat
    const userMessage: Message = {
      id: `user-${messages.length}`,
      sender: "user",
      text: replyText,
    };
    setMessages((prev) => [...prev, userMessage]);

    // 2. Set "Thinking..." state
    setIsThinking(true);

    // 3. Find the next step in the conversation
    const nextStepIndex = currentStep + 1;

    // 4. Simulate AI reply delay
    setTimeout(() => {
      setIsThinking(false);

      if (nextStepIndex < conversationFlow.length) {
        // --- If there's a next question ---
        const aiMessage: Message = {
          id: `ai-${messages.length}`,
          sender: "ai",
          text: conversationFlow[nextStepIndex].question,
        };
        setMessages((prev) => [...prev, aiMessage]);
        setCurrentStep(nextStepIndex);
      } else {
        // --- If this is the final answer ---
        const finalMessage: Message = {
          id: `ai-${messages.length}`,
          sender: "ai",
          text: "Thanks! Hang tight, Leeco is crafting your personalized learning roadmap... 🚀",
        };
        setMessages((prev) => [...prev, finalMessage]);
        
        // Show the progress modal
        setTimeout(() => setShowModal(true), 1000);
      }
    }, 1500); // 1.5 second delay to simulate thinking
  };

  // --- Demand analysis API helpers ---
  async function startDemandAnalysis() {
    if (!productIdInput.trim()) return alert("Enter product id");
    setDemandLoading(true);
    setDemandQuestion(null);
    setDemandPath(null);
    setDemandSources(null);
    setDemandAnswers([]);
    try {
      console.log("Starting demand analysis for:", productIdInput);
      const resp = await axiosClient.post("/api/analyze-demand", {
        product_id: productIdInput,
      });
      console.log("analyze-demand response:", resp?.data);
      const data = resp?.data;
      setThreadInfo(data.thread ?? null);
      if (data?.next_question) {
        setDemandQuestion(data.next_question);
      } else if (data?.demand_path) {
        setDemandPath(data.demand_path);
        setDemandSources(data.sources ?? null);
      } else if (data?.thread && data.thread.next_question) {
        setDemandQuestion(data.thread.next_question);
      }
    } catch (err: any) {
      console.error("startDemandAnalysis error:", err?.response ?? err);
      alert(err?.response?.data?.error || err?.message || "Failed to start analysis");
    } finally {
      setDemandLoading(false);
    }
  }

  async function submitDemandAnswer(answer: string) {
    if (!productIdInput.trim()) return;
    setDemandLoading(true);
    try {
      console.log("Submitting answer:", answer);
      const resp = await axiosClient.post("/api/analyze-demand", {
        product_id: productIdInput,
        user_answer: answer,
      });
      console.log("answer response:", resp?.data);
      const data = resp?.data;
      // If more questions remain
      if (data?.next_question) {
        setDemandAnswers((s) => [...s, answer]);
        setDemandQuestion(data.next_question);
      } else if (data?.demand_path) {
        setDemandAnswers((s) => [...s, answer]);
        setDemandPath(data.demand_path);
        setDemandSources(data.sources ?? null);
        setDemandQuestion(null);
      } else {
        // fallback: check thread
        if (data?.thread && data.thread.status === "completed") {
          setDemandPath(data.thread.ai_generated_path ?? null);
          setDemandSources(data.thread.sources ?? null);
          setDemandQuestion(null);
        }
      }
    } catch (err: any) {
      console.error("submitDemandAnswer error:", err?.response ?? err);
      alert(err?.response?.data?.error || err?.message || "Failed to submit answer");
    } finally {
      setDemandLoading(false);
    }
  }

  // Simple UI handler for submitting text answer
  const [answerInput, setAnswerInput] = useState("");
  const handleAnswerSubmit = async () => {
    const a = answerInput.trim();
    if (!a) return;
    await submitDemandAnswer(a);
    setAnswerInput("");
  };

  // --- Render Function ---
  const currentReplies = conversationFlow[currentStep]?.replies || [];

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Main Chat Area */}
      <main className="flex flex-col bg-white h-full">
        {/* Chat Header */}
        <div className="h-16 border-b border-gray-200 bg-white px-4 md:px-6 flex items-center shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Learning Path Assistant</h1>
              <p className="text-sm text-gray-500">Leeco - Your personal learning companion</p>
            </div>
          </div>
         <div className="ml-auto flex items-center gap-3">
           {/* product dropdown */}
           <select
             value={selectedProductId}
             onChange={(e) => {
               setSelectedProductId(e.target.value);
               setProductIdInput(e.target.value); // keep existing logic happy
             }}
             className="text-sm border rounded px-3 py-1 bg-white"
           >
             {products.length === 0 && <option value="">Select product...</option>}
             {products.map((p) => (
               <option key={p.id} value={p.id}>
                 {p.name}
               </option>
             ))}
           </select>
           <Button onClick={startDemandAnalysis} size="sm" disabled={demandLoading || !productIdInput}>
             {demandLoading ? "Starting..." : "Analyze Demand"}
           </Button>
         </div>
        </div>

        {/* Chat Messages Container - Fixed height with proper scrolling */}
        <div className="flex-1 min-h-0 relative">
          <div
            className="absolute inset-0 overflow-y-auto p-4 md:p-6 bg-gray-50 scroll-smooth supports-[scroll-behavior:smooth]:scroll-behavior-smooth"
          >
            <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 pb-6">
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className="flex items-start gap-3 max-w-[85%] md:max-w-[80%]">
                    {msg.sender === "ai" && (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <MessageCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white ml-12 hover:bg-blue-700"
                          : "bg-white text-gray-900 border border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    {msg.sender === "user" && (
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <span className="text-xs font-semibold text-white">U</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Thinking Indicator - Always rendered but with opacity control */}
              <div
                className={`flex justify-start transition-all duration-300 ${
                  isThinking ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="flex items-start gap-3 max-w-[85%] md:max-w-[80%]">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      </div>
                      <span className="text-sm text-gray-600">Leeco is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll anchor - positioned at the very bottom */}
            <div ref={chatEndRef} className="h-1" />
          </div>
        </div>

        {/* Demand Analysis Panel (fixed bottom area) */}
        <div className="border-t border-gray-200 bg-white shrink-0 p-4">
          <div className="max-w-4xl mx-auto space-y-3">
            {demandQuestion && (
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="text-sm font-medium">Demand Analysis Question</div>
                <div className="mt-2 text-sm">{demandQuestion}</div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    placeholder="Type your answer..."
                    className="flex-1 border rounded px-3 py-2 text-sm"
                  />
                  <Button onClick={handleAnswerSubmit} disabled={demandLoading || !answerInput.trim()}>
                    {demandLoading ? "Sending..." : "Send"}
                  </Button>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Answers so far: {demandAnswers.length}
                </div>
              </div>
            )}

            {demandPath && (
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <div className="text-sm font-medium">Business Roadmap (Demand Path)</div>
                <pre className="mt-2 text-sm whitespace-pre-wrap">{String(demandPath)}</pre>
                <div className="mt-3 text-sm font-medium">Sources</div>
                <div className="mt-2 space-y-2">
                  {Array.isArray(demandSources) && demandSources.length > 0 ? (
                    demandSources.map((s: any, idx: number) => (
                      <div key={idx} className="text-sm">
                        <a href={s.url || "#"} target="_blank" rel="noreferrer" className="text-primary underline">
                          {s.source || s.title || s.url}
                        </a>
                        {s.url && <div className="text-xs text-muted-foreground">{s.url}</div>}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No sources provided.</div>
                  )}
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  (Console logs include full API responses.)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reply Buttons & Input Area - Fixed height to prevent layout shifts */}
        <div className="border-t border-gray-200 bg-white shrink-0">
          <div className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              {/* Suggested Replies - Smooth height transitions */}
              <div
                className={`mb-4 md:mb-6 transition-all duration-300 ease-in-out ${
                  currentReplies.length > 0 && !isThinking
                    ? 'opacity-100 max-h-32 translate-y-0'
                    : 'opacity-0 max-h-0 -translate-y-2 overflow-hidden'
                }`}
              >
                <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
                  {currentReplies.map((reply, index) => (
                    <Button
                      key={reply}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 rounded-full px-3 md:px-4 py-2 h-auto font-medium text-xs md:text-sm hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-bottom-1"
                      onClick={() => handleReplyClick(reply)}
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Text Input - Always visible with stable height */}
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-xl p-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200 hover:border-gray-400">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 text-sm focus:placeholder-gray-400"
                  disabled // We only use buttons in this flow
                />
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 md:px-4 h-8 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Progress Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-xl">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center justify-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              Creating your personalized learning roadmap
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="space-y-4">
              <div className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-500 ${
                currentStepIndex >= 1
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  currentStepIndex >= 1
                    ? 'bg-green-100'
                    : 'bg-gray-100'
                }`}>
                  <CheckCircle className={`w-5 h-5 transition-all duration-500 ${
                    currentStepIndex >= 1
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`} />
                </div>
                <span className={`font-medium transition-all duration-500 ${
                  currentStepIndex >= 1
                    ? 'text-green-900'
                    : 'text-gray-500'
                }`}>Creating Your Learning Path</span>
              </div>
              <div className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-500 ${
                currentStepIndex >= 2
                  ? 'bg-green-50 border-green-200'
                  : currentStepIndex >= 1
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  currentStepIndex >= 2
                    ? 'bg-green-100'
                    : currentStepIndex >= 1
                    ? 'bg-blue-100'
                    : 'bg-gray-100'
                }`}>
                  {currentStepIndex >= 2 ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : currentStepIndex >= 1 ? (
                    <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <span className={`font-medium transition-all duration-500 ${
                  currentStepIndex >= 2
                    ? 'text-green-900'
                    : currentStepIndex >= 1
                    ? 'text-blue-900'
                    : 'text-gray-500'
                }`}>Curating Best Resources for You</span>
              </div>
              <div className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-500 ${
                currentStepIndex >= 3
                  ? 'bg-green-50 border-green-200'
                  : currentStepIndex >= 2
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  currentStepIndex >= 3
                    ? 'bg-green-100'
                    : currentStepIndex >= 2
                    ? 'bg-blue-100'
                    : 'bg-gray-100'
                }`}>
                  {currentStepIndex >= 3 ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : currentStepIndex >= 2 ? (
                    <MessageCircle className="w-5 h-5 text-blue-600 animate-pulse" />
                  ) : (
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <span className={`font-medium transition-all duration-500 ${
                  currentStepIndex >= 3
                    ? 'text-green-900'
                    : currentStepIndex >= 2
                    ? 'text-blue-900'
                    : 'text-gray-500'
                }`}>Finalizing Key Details</span>
              </div>
              <div className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-500 ${
                currentStepIndex >= 4
                  ? 'bg-green-50 border-green-200'
                  : currentStepIndex >= 3
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  currentStepIndex >= 4
                    ? 'bg-green-100'
                    : currentStepIndex >= 3
                    ? 'bg-blue-100'
                    : 'bg-gray-100'
                }`}>
                  {currentStepIndex >= 4 ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : currentStepIndex >= 3 ? (
                    <Save className="w-5 h-5 text-blue-600 animate-pulse" />
                  ) : (
                    <Save className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <span className={`font-medium transition-all duration-500 ${
                  currentStepIndex >= 4
                    ? 'text-green-900'
                    : currentStepIndex >= 3
                    ? 'text-blue-900'
                    : 'text-gray-500'
                }`}>Saving to your dashboard</span>
              </div>
            </div>
            <div className="mt-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}