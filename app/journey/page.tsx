"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Circle,
  Target,
  Users,
  TrendingUp,
  Award,
  Lightbulb,
  Rocket,
  MapPin
} from "lucide-react";

interface JourneyNode {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  message: string;
  icon: React.ComponentType<any>;
}

const journeyNodes: JourneyNode[] = [
  {
    id: 'start',
    title: 'Getting Started',
    description: 'Welcome to your DevHost journey',
    status: 'completed',
    message: 'Welcome! You\'ve taken the first step in your development journey. This is where innovation begins and possibilities are endless.',
    icon: Target
  },
  {
    id: 'planning',
    title: 'Project Planning',
    description: 'Define your goals and roadmap',
    status: 'completed',
    message: 'Great planning leads to successful execution. You\'ve outlined your objectives and created a clear path forward.',
    icon: MapPin
  },
  {
    id: 'development',
    title: 'Development Phase',
    description: 'Build and iterate on your ideas',
    status: 'current',
    message: 'You\'re in the heart of creation! This is where your ideas transform into reality through code and collaboration.',
    icon: Lightbulb
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Work together with your team',
    status: 'upcoming',
    message: 'Collaboration amplifies success. Working together with talented individuals creates extraordinary results.',
    icon: Users
  },
  {
    id: 'growth',
    title: 'Growth & Scaling',
    description: 'Expand your impact and reach',
    status: 'upcoming',
    message: 'Growth is the reward for persistence and innovation. Your project is ready to make a bigger impact.',
    icon: TrendingUp
  },
  {
    id: 'success',
    title: 'Achievement',
    description: 'Celebrate your accomplishments',
    status: 'upcoming',
    message: 'Congratulations! You\'ve reached new heights. This achievement opens doors to even greater opportunities.',
    icon: Award
  },
  {
    id: 'future',
    title: 'Future Vision',
    description: 'Plan for what\'s next',
    status: 'upcoming',
    message: 'The journey continues! With your experience and achievements, the future holds unlimited potential.',
    icon: Rocket
  }
];

export default function JourneyPage() {
  const [selectedNode, setSelectedNode] = useState<JourneyNode | null>(null);

  const getStatusColor = (status: JourneyNode['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500 animate-pulse';
      case 'upcoming':
        return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: JourneyNode['status']) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'current':
        return Circle;
      case 'upcoming':
        return Circle;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Journey Nodes - Zigzag Layout */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border transform -translate-x-1/2 hidden lg:block"></div>

          <div className="space-y-16">
            {journeyNodes.map((node, index) => {
              const StatusIcon = getStatusIcon(node.status);
              const NodeIcon = node.icon;
              const isLeft = index % 2 === 0;

              return (
                <div key={node.id} className={`flex items-center ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col lg:gap-2 gap-4`}>
                  {/* Node Circle */}
                  <div
                    className={`relative w-12 h-12 rounded-full ${getStatusColor(node.status)} flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg shrink-0 z-10`}
                    onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                  >
                    <NodeIcon className="w-6 h-6 text-white" />
                    <StatusIcon className="absolute -bottom-1 -right-1 w-4 h-4 text-white bg-background rounded-full" />
                  </div>

                  {/* Node Content - Only show when selected */}
                  {selectedNode?.id === node.id && (
                    <div className={`flex-1 max-w-md ${isLeft ? 'lg:text-right' : 'lg:text-left'} text-center lg:text-left`}>
                      <div className="p-4 rounded-lg border bg-card ring-2 ring-primary shadow-lg">
                        <div className={`flex items-center justify-between mb-3 ${isLeft ? 'lg:flex-row-reverse lg:text-right' : ''}`}>
                          <h3 className="font-semibold text-foreground text-lg">{node.title}</h3>
                          <Badge
                            variant={node.status === 'completed' ? 'default' : node.status === 'current' ? 'default' : 'secondary'}
                            className={`text-xs ml-2 ${
                              node.status === 'completed' ? 'bg-green-100 text-green-800' :
                              node.status === 'current' ? 'bg-blue-100 text-blue-800' : ''
                            }`}
                          >
                            {node.status}
                          </Badge>
                        </div>
                        <div className="border-t border-border pt-3">
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            {node.description}
                          </p>
                          <p className="text-sm text-foreground font-medium leading-relaxed">
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