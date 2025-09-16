import { useState } from 'react';
import { AIMascot, type MascotMood } from '../AIMascot';
import { SwipeCard } from '../SwipeCard';
import { TaskCard, type Task } from '../TaskCard';
import { useToast } from '@/hooks/use-toast';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Call with Sarah about project',
    type: 'reminder',
    time: '2:00 PM',
    description: 'Discuss the new mobile app wireframes and timeline',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Gym session - Upper body',
    type: 'suggestion',
    time: '6:00 PM',
    description: 'You have 2h free. Perfect time for your workout routine!',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Team meeting conflicts with doctor appointment',
    type: 'conflict',
    time: '3:00 PM',
    description: 'Both scheduled at the same time. Which one should we keep?',
    priority: 'high'
  },
  {
    id: '4',
    title: 'Client call - Product demo',
    type: 'missed',
    time: '1:00 PM',
    description: 'You missed this important call',
    priority: 'high'
  }
];

export const HomeScreen = () => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [mascotMood, setMascotMood] = useState<MascotMood>('neutral');
  const [showSummary, setShowSummary] = useState(false);
  const { toast } = useToast();

  const currentTask = mockTasks[currentTaskIndex];

  const handleSwipeRight = () => {
    setMascotMood('happy');
    toast({
      title: "Accepted ✓",
      description: "Task accepted and scheduled",
    });
    
    setTimeout(() => {
      setMascotMood('neutral');
      nextTask();
    }, 800);
  };

  const handleSwipeLeft = () => {
    setMascotMood('surprised');
    toast({
      title: "Declined ✗",
      description: "Task declined and dismissed",
      variant: "destructive"
    });
    
    setTimeout(() => {
      setMascotMood('neutral');
      nextTask();
    }, 800);
  };

  const handleSwipeUp = () => {
    setMascotMood('happy');
    toast({
      title: "Completed! ✨",
      description: "Task marked as done",
    });
    
    setTimeout(() => {
      setMascotMood('neutral');
      nextTask();
    }, 800);
  };

  const nextTask = () => {
    if (currentTaskIndex < mockTasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    } else {
      setCurrentTaskIndex(0);
    }
  };

  const handleMascotClick = () => {
    setMascotMood('thinking');
    setShowSummary(!showSummary);
    
    setTimeout(() => {
      setMascotMood('neutral');
    }, 2000);
  };

  const handlePullDown = () => {
    toast({
      title: "Today's Summary",
      description: "3 tasks • 2 completed • 1 pending",
    });
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-8">
      {/* Header with Mascot */}
      <div className="flex flex-col items-center space-y-4 pt-8">
        <AIMascot 
          mood={mascotMood} 
          onClick={handleMascotClick}
          className="mb-2"
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Conciergerie IA
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your intelligent assistant
          </p>
        </div>
      </div>

      {/* Quick Summary Bubble */}
      {showSummary && (
        <div className="bg-card border border-border rounded-2xl p-4 animate-fade-in">
          <p className="text-sm text-muted-foreground text-center">
            Today: 3 tasks • 2 completed • 1 pending
          </p>
        </div>
      )}

      {/* Main Card */}
      <div className="flex-1 flex items-center justify-center">
        {currentTask ? (
          <SwipeCard
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            onSwipeUp={handleSwipeUp}
            className="w-full max-w-sm"
          >
            <TaskCard task={currentTask} />
          </SwipeCard>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <h3 className="text-xl font-semibold">All caught up!</h3>
            <p className="text-muted-foreground">No pending tasks right now</p>
          </div>
        )}
      </div>

      {/* Pull down hint */}
      <div 
        className="text-center text-xs text-muted-foreground cursor-pointer"
        onClick={handlePullDown}
      >
        Pull down for today's list
      </div>

      {/* Swipe instructions */}
      <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
        <div className="text-center">
          <div className="text-destructive">←</div>
          <div>Decline</div>
        </div>
        <div className="text-center">
          <div className="text-primary">↑</div>
          <div>Done</div>
        </div>
        <div className="text-center">
          <div className="text-success">→</div>
          <div>Accept</div>
        </div>
      </div>
    </div>
  );
};