import { useState } from 'react';
import { AIMascot, type MascotMood } from '../AIMascot';
import { SwipeCard } from '../SwipeCard';
import { Lightbulb, Heart, Zap, Calendar, MapPin, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  type: 'schedule' | 'conflict' | 'reminder' | 'habit';
  icon: React.ComponentType<any>;
  priority: 'low' | 'medium' | 'high';
  timeSlot?: string;
}

const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    title: 'Schedule gym time',
    description: 'You have 2 hours free this evening. Perfect for your workout routine!',
    type: 'schedule',
    icon: Zap,
    priority: 'medium',
    timeSlot: '6:00 PM - 8:00 PM'
  },
  {
    id: '2',
    title: 'Resolve meeting conflict',
    description: 'Team meeting overlaps with doctor appointment. Choose which one to keep.',
    type: 'conflict',
    icon: Calendar,
    priority: 'high',
    timeSlot: '3:00 PM'
  },
  {
    id: '3',
    title: 'Coffee with Sarah',
    description: 'It\'s been 2 weeks since you last met. Free slot tomorrow afternoon?',
    type: 'reminder',
    icon: Coffee,
    priority: 'low',
    timeSlot: 'Tomorrow 2:00 PM'
  },
  {
    id: '4',
    title: 'Weekly planning session',
    description: 'Sunday evening is free. Great time to plan next week\'s priorities.',
    type: 'habit',
    icon: Calendar,
    priority: 'medium',
    timeSlot: 'Sunday 7:00 PM'
  },
  {
    id: '5',
    title: 'Visit parents',
    description: 'Mom\'s birthday is next week. Should we plan a visit this weekend?',
    type: 'reminder',
    icon: Heart,
    priority: 'high',
    timeSlot: 'This weekend'
  },
  {
    id: '6',
    title: 'Lunch break meditation',
    description: 'You seem stressed lately. 15-minute meditation during lunch?',
    type: 'habit',
    icon: Lightbulb,
    priority: 'low',
    timeSlot: '12:15 PM - 12:30 PM'
  }
];

export const SuggestionsScreen = () => {
  const [suggestions, setSuggestions] = useState(mockSuggestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mascotMood, setMascotMood] = useState<MascotMood>('thinking');
  const { toast } = useToast();

  const currentSuggestion = suggestions[currentIndex];

  const handleAccept = () => {
    setMascotMood('happy');
    toast({
      title: "Great choice! ✨",
      description: "Suggestion accepted and scheduled",
    });
    
    setTimeout(() => {
      setMascotMood('thinking');
      nextSuggestion();
    }, 800);
  };

  const handleReject = () => {
    setMascotMood('neutral');
    toast({
      title: "No problem",
      description: "Suggestion dismissed",
      variant: "destructive"
    });
    
    setTimeout(() => {
      setMascotMood('thinking');
      nextSuggestion();
    }, 800);
  };

  const nextSuggestion = () => {
    if (currentIndex < suggestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const getSuggestionStyle = (type: Suggestion['type']) => {
    switch (type) {
      case 'conflict':
        return 'border-warning/30 bg-warning/5';
      case 'habit':
        return 'border-success/30 bg-success/5';
      case 'reminder':
        return 'border-accent/30 bg-accent/5';
      default:
        return 'border-primary/30 bg-primary/5';
    }
  };

  const getPriorityColor = (priority: Suggestion['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive';
      case 'medium':
        return 'bg-warning';
      default:
        return 'bg-success';
    }
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Header with thinking mascot */}
      <div className="flex items-center justify-between pt-8">
        <div>
          <h1 className="text-2xl font-bold">AI Suggestions</h1>
          <p className="text-sm text-muted-foreground">Smart ideas for your schedule</p>
        </div>
        <AIMascot mood={mascotMood} className="scale-75" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-primary">{suggestions.length}</div>
          <div className="text-xs text-muted-foreground">Ideas</div>
        </div>
        <div className="bg-card rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-success">4</div>
          <div className="text-xs text-muted-foreground">Accepted</div>
        </div>
        <div className="bg-card rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-warning">2</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </div>
      </div>

      {/* Main suggestion card */}
      <div className="flex-1 flex items-center justify-center">
        {currentSuggestion ? (
          <SwipeCard
            onSwipeRight={handleAccept}
            onSwipeLeft={handleReject}
            className="w-full max-w-sm"
          >
            <div className={cn(
              "space-y-4",
              getSuggestionStyle(currentSuggestion.type)
            )}>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <currentSuggestion.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{currentSuggestion.title}</h3>
                    {currentSuggestion.timeSlot && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {currentSuggestion.timeSlot}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  getPriorityColor(currentSuggestion.priority)
                )} />
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentSuggestion.description}
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground capitalize">
                  {currentSuggestion.type} suggestion
                </span>
                <span className="text-xs text-muted-foreground">
                  {currentIndex + 1} of {suggestions.length}
                </span>
              </div>
            </div>
          </SwipeCard>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-6xl">💡</div>
            <h3 className="text-xl font-semibold">All suggestions reviewed!</h3>
            <p className="text-muted-foreground">I'll have new ideas for you soon</p>
          </div>
        )}
      </div>

      {/* Action hint */}
      <div className="text-center text-xs text-muted-foreground">
        Swipe right to accept • Swipe left to dismiss
      </div>
    </div>
  );
};