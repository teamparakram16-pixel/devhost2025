"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface JourneyNode {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  message: string;
  gradient: string;
}

const journeyNodes: JourneyNode[] = [
  {
    id: 'start',
    title: 'Getting Started',
    description: 'Welcome to your DevHost journey',
    status: 'completed',
    message: 'Welcome! You\'ve taken the first step in your development journey. This is where innovation begins and possibilities are endless.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'planning',
    title: 'Project Planning',
    description: 'Define your goals and roadmap',
    status: 'completed',
    message: 'Great planning leads to successful execution. You\'ve outlined your objectives and created a clear path forward.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'development',
    title: 'Development Phase',
    description: 'Build and iterate on your ideas',
    status: 'current',
    message: 'You\'re in the heart of creation! This is where your ideas transform into reality through code and collaboration.',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Work together with your team',
    status: 'upcoming',
    message: 'Collaboration amplifies success. Working together with talented individuals creates extraordinary results.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'growth',
    title: 'Growth & Scaling',
    description: 'Expand your impact and reach',
    status: 'upcoming',
    message: 'Growth is the reward for persistence and innovation. Your project is ready to make a bigger impact.',
    gradient: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'success',
    title: 'Achievement',
    description: 'Celebrate your accomplishments',
    status: 'upcoming',
    message: 'Congratulations! You\'ve reached new heights. This achievement opens doors to even greater opportunities.',
    gradient: 'from-yellow-500 to-amber-500'
  },
  {
    id: 'future',
    title: 'Future Vision',
    description: 'Plan for what\'s next',
    status: 'upcoming',
    message: 'The journey continues! With your experience and achievements, the future holds unlimited potential.',
    gradient: 'from-rose-500 to-red-500'
  }
];

export default function JourneyPage() {
  const [selectedNode, setSelectedNode] = useState<JourneyNode | null>(null);

  const getStatusColor = (status: JourneyNode['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-linear-to-br from-green-500 to-emerald-500';
      case 'current':
        return 'bg-linear-to-br from-blue-500 to-purple-500 animate-pulse';
      case 'upcoming':
        return 'bg-linear-to-br from-gray-300 to-gray-400';
    }
  };

  const getStatusIndicator = (status: JourneyNode['status']) => {
    switch (status) {
      case 'completed':
        return <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>;
      case 'current':
        return <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>;
      case 'upcoming':
        return <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-400 rounded-full border-2 border-white shadow-md"></div>;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">Your Journey</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Track your progress through each milestone and celebrate your achievements along the way.</p>
        </div>

        {/* Journey Nodes - Zigzag Layout */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-blue-200 via-purple-200 to-indigo-200 transform -translate-x-1/2 hidden lg:block rounded-full"></div>

          <div className="space-y-20">
            {journeyNodes.map((node, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div key={node.id} className={`flex items-center ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col lg:gap-8 gap-6`}>
                  {/* Node Circle */}
                  <div
                    className={`relative w-16 h-16 rounded-2xl bg-linear-to-br ${node.gradient} flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-xl shrink-0 z-10 group`}
                    onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                  >
                    <div className="w-8 h-8 bg-white/30 rounded-lg backdrop-blur-sm group-hover:bg-white/40 transition-colors"></div>
                    {getStatusIndicator(node.status)}
                  </div>

                  {/* Node Content - Only show when selected */}
                  {selectedNode?.id === node.id && (
                    <div className={`flex-1 max-w-md ${isLeft ? 'lg:text-right' : 'lg:text-left'} text-center`}>
                      <div className="p-6 rounded-2xl border-2 border-blue-100 bg-white/90 backdrop-blur-sm ring-2 ring-blue-200/50 shadow-2xl">
                        <div className={`flex items-center justify-between mb-4 ${isLeft ? 'lg:flex-row-reverse' : ''} flex-wrap gap-2`}>
                          <h3 className="font-bold text-foreground text-xl">{node.title}</h3>
                          <Badge
                            variant={node.status === 'completed' ? 'default' : node.status === 'current' ? 'default' : 'secondary'}
                            className={`text-xs px-3 py-1 ${
                              node.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-300' :
                              node.status === 'current' ? 'bg-blue-100 text-blue-800 border border-blue-300 animate-pulse' : 
                              'bg-gray-100 text-gray-600 border border-gray-300'
                            }`}
                          >
                            {node.status}
                          </Badge>
                        </div>
                        <div className="border-t-2 border-blue-100 pt-4 space-y-3">
                          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                            {node.description}
                          </p>
                          <p className="text-sm text-foreground leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                            {node.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}