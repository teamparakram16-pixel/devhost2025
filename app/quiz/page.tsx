"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Send } from "lucide-react";

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
// This hardcoded data simulates the AI's conversation flow
const conversationFlow: ConversationStep[] = [
  {
    step: 0,
    question:
      "Hi there. I'm Leeco, your personal learning companion. I can help you create a roadmap for anything you want to learn. What do you want to learn?",
    replies: [
      "Data Structures & Algorithms",
      "AI Agent Development",
      "Full Stack Development",
      "Data Science",
      "Backend Development",
      "Frontend Development",
      "Cybersecurity",
      "Cloud Computing",
    ],
  },
  {
    step: 1,
    question:
      "Great choice! Next, could you tell me your current knowledge level in this area? This helps me customize the roadmap to your needs.",
    replies: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    step: 2,
    question:
      "Perfect! Last question: What is your preferred timeline to complete your full learning? Choose from 1 week, 1 month, 3 months, 6 months, or 6+ months. This helps set a realistic pace.",
    replies: ["1 week", "1 month", "3 months", "6 months", "6+ months"],
  },
];

// --- Main Page Component ---
export default function Home() {
  // --- State Hooks ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isThinking, setIsThinking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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
  }, []);

  // Scroll to the bottom of the chat when new messages appear
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

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

  // --- Render Function ---
  const currentReplies = conversationFlow[currentStep]?.replies || [];

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Sidebar (as seen in video) */}
      <nav className="w-16 border-r border-gray-200 p-4 flex flex-col items-center gap-6">
        <div className="p-2 bg-purple-600 text-white rounded-lg">L</div>
        <div className="p-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </div>
        <div className="p-2 text-gray-500 rounded-lg cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
      </nav>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-screen max-h-screen">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-3 ${
                  msg.sender === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* "Thinking..." Indicator */}
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-black rounded-lg px-4 py-3">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
          
          {/* Empty div to force scroll to bottom */}
          <div ref={chatEndRef} />
        </div>

        {/* Reply Buttons & Input Area */}
        <div className="p-6 border-t border-gray-200 bg-white">
          {/* Suggested Replies */}
          {currentReplies.length > 0 && !isThinking && (
            <div className="flex flex-wrap gap-2 mb-4">
              {currentReplies.map((reply) => (
                <Button
                  key={reply}
                  variant="outline"
                  className="bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-800"
                  onClick={() => handleReplyClick(reply)}
                >
                  {reply}
                </Button>
              ))}
            </div>
          )}

          {/* Text Input (disabled for this demo) */}
          <div className="flex items-center border border-gray-300 rounded-lg p-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 outline-none p-2"
              disabled // We only use buttons in this flow
            />
            <Button size="icon" className="bg-gray-800 text-white" disabled>
              <Send size={18} />
            </Button>
          </div>
        </div>
      </main>

      {/* Progress Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold">
              Hang tight, Leeco is crafting your personalized learning roadmap 🚀
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {/* This is a static list, but you could make it dynamic */}
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-full">✓</div>
                <span className="font-medium">Creating Your Learning Path</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-full animate-pulse">...</div>
                <span className="font-medium text-gray-500">Curating Best Resources for You</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 text-gray-400 rounded-full"></div>
                <span className="font-medium text-gray-400">Finalizing Key Details</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 text-gray-400 rounded-full"></div>
                <span className="font-medium text-gray-400">Saving this on your dashboard</span>
              </div>
            </div>
            <div className="mt-6 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 w-1/4 animate-pulse"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}