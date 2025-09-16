import { useState, useRef, TouchEvent, MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';

export interface SwipeCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  className?: string;
  showHints?: boolean;
}

export const SwipeCard = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  className,
  showHints = true 
}: SwipeCardProps) => {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    const { x, y } = dragOffset;
    const threshold = 100;
    
    if (Math.abs(x) > threshold && Math.abs(x) > Math.abs(y)) {
      if (x > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (x < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    } else if (y < -threshold && onSwipeUp) {
      onSwipeUp();
    }
    
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  // Touch events
  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  // Mouse events for desktop testing
  const handleMouseDown = (e: MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const getSwipeDirection = () => {
    const { x, y } = dragOffset;
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    
    if (absX > absY && absX > 30) {
      return x > 0 ? 'right' : 'left';
    } else if (absY > 30 && y < 0) {
      return 'up';
    }
    return null;
  };

  const swipeDirection = getSwipeDirection();

  return (
    <div
      ref={cardRef}
      className={cn(
        "card-interactive select-none",
        isDragging && "transition-none",
        !isDragging && "transition-transform duration-300",
        className
      )}
      style={{
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={isDragging ? handleMouseMove : undefined}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      {children}
      
      {/* Swipe hints */}
      {showHints && (
        <div className="absolute top-4 right-4 flex space-x-2">
          {onSwipeLeft && (
            <div className={cn(
              "w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center transition-all",
              swipeDirection === 'left' && "bg-destructive/40 scale-125"
            )}>
              <ChevronLeft className="w-3 h-3 text-destructive" />
            </div>
          )}
          {onSwipeUp && (
            <div className={cn(
              "w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center transition-all",
              swipeDirection === 'up' && "bg-primary/40 scale-125"
            )}>
              <ChevronUp className="w-3 h-3 text-primary" />
            </div>
          )}
          {onSwipeRight && (
            <div className={cn(
              "w-6 h-6 rounded-full bg-success/20 flex items-center justify-center transition-all",
              swipeDirection === 'right' && "bg-success/40 scale-125"
            )}>
              <ChevronRight className="w-3 h-3 text-success" />
            </div>
          )}
        </div>
      )}

      {/* Swipe overlay */}
      <div className={cn(
        "card-swipe-hint",
        swipeDirection === 'left' && "card-swipe-reject opacity-100",
        swipeDirection === 'right' && "card-swipe-accept opacity-100"
      )} />
    </div>
  );
};