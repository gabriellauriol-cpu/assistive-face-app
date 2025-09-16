import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export type MascotMood = 'neutral' | 'thinking' | 'happy' | 'surprised' | 'tired';

interface AIMascotProps {
  mood?: MascotMood;
  onClick?: () => void;
  className?: string;
}

export const AIMascot = ({ mood = 'neutral', onClick, className }: AIMascotProps) => {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  const getMascotClasses = () => {
    const baseClasses = "mascot-base flex items-center justify-center cursor-pointer transition-all duration-300";
    
    switch (mood) {
      case 'thinking':
        return cn(baseClasses, "mascot-thinking", className);
      case 'happy':
        return cn(baseClasses, "mascot-happy", className);
      case 'surprised':
        return cn(baseClasses, "animate-pulse", className);
      case 'tired':
        return cn(baseClasses, "opacity-70", className);
      default:
        return cn(baseClasses, "mascot-glow", className);
    }
  };

  const getEyeColor = () => {
    switch (mood) {
      case 'thinking':
        return 'text-mascot-thinking';
      case 'happy':
        return 'text-mascot-happy';
      case 'surprised':
        return 'text-mascot-surprised';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className={getMascotClasses()} onClick={onClick}>
      <div className="relative">
        {/* Eyes */}
        <div className="flex space-x-2">
          <div className={cn(
            "w-2 h-2 rounded-full transition-all duration-150",
            getEyeColor(),
            blinking ? "h-0.5" : "h-2"
          )} />
          <div className={cn(
            "w-2 h-2 rounded-full transition-all duration-150",
            getEyeColor(),
            blinking ? "h-0.5" : "h-2"
          )} />
        </div>
        
        {/* Mouth */}
        <div className="mt-1 flex justify-center">
          {mood === 'happy' && (
            <div className="w-4 h-2 border-2 border-mascot-happy border-t-0 rounded-b-full" />
          )}
          {mood === 'surprised' && (
            <div className="w-2 h-2 bg-mascot-surprised rounded-full" />
          )}
          {mood === 'tired' && (
            <div className="w-3 h-1 bg-muted-foreground rounded-full opacity-50" />
          )}
          {(mood === 'neutral' || mood === 'thinking') && (
            <div className="w-1 h-1 bg-primary rounded-full" />
          )}
        </div>

        {/* Glow effect for thinking */}
        {mood === 'thinking' && (
          <div className="absolute inset-0 bg-mascot-thinking/20 rounded-full animate-ping" />
        )}
      </div>
    </div>
  );
};