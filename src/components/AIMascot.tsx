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

  const getEyeStyles = () => {
    switch (mood) {
      case 'thinking':
        return {
          color: 'bg-mascot-thinking',
          glow: 'shadow-[0_0_20px_hsl(var(--mascot-thinking))]',
          shape: 'w-3 h-5 rounded-full'
        };
      case 'happy':
        return {
          color: 'bg-mascot-happy',
          glow: 'shadow-[0_0_20px_hsl(var(--mascot-happy))]',
          shape: 'w-4 h-2 rounded-full transform rotate-12'
        };
      case 'surprised':
        return {
          color: 'bg-mascot-surprised',
          glow: 'shadow-[0_0_20px_hsl(var(--mascot-surprised))]',
          shape: 'w-4 h-6 rounded-full'
        };
      case 'tired':
        return {
          color: 'bg-cyan-400',
          glow: 'shadow-[0_0_15px_hsl(180_100%_70%)]',
          shape: 'w-4 h-1 rounded-full'
        };
      default:
        return {
          color: 'bg-cyan-400',
          glow: 'shadow-[0_0_25px_hsl(180_100%_70%)]',
          shape: 'w-3 h-5 rounded-full'
        };
    }
  };

  const eyeStyles = getEyeStyles();

  return (
    <div className={getMascotClasses()} onClick={onClick}>
      <div className="relative">
        {/* Eyes */}
        <div className="flex space-x-3 items-center justify-center">
          <div className={cn(
            "transition-all duration-300",
            eyeStyles.color,
            eyeStyles.glow,
            blinking ? "h-0.5 w-4" : eyeStyles.shape
          )} />
          <div className={cn(
            "transition-all duration-300",
            eyeStyles.color,
            eyeStyles.glow,
            blinking ? "h-0.5 w-4" : eyeStyles.shape
          )} />
        </div>
        
        {/* Mouth */}
        <div className="mt-2 flex justify-center">
          {mood === 'happy' && (
            <div className="w-6 h-3 border-2 border-mascot-happy border-t-0 rounded-b-full shadow-[0_0_10px_hsl(var(--mascot-happy))]" />
          )}
          {mood === 'surprised' && (
            <div className="w-3 h-3 bg-mascot-surprised rounded-full shadow-[0_0_10px_hsl(var(--mascot-surprised))]" />
          )}
          {mood === 'tired' && (
            <div className="w-4 h-1 bg-cyan-400 rounded-full opacity-60" />
          )}
          {(mood === 'neutral' || mood === 'thinking') && (
            <div className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_hsl(180_100%_70%)]" />
          )}
        </div>

        {/* Enhanced glow effect for thinking */}
        {mood === 'thinking' && (
          <div className="absolute inset-0 bg-mascot-thinking/20 rounded-full animate-ping" />
        )}
      </div>
    </div>
  );
};