import { Home, Calendar, Lightbulb, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NavigationTab = 'home' | 'today' | 'suggestions' | 'connections';

interface BottomNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'today' as const, icon: Calendar, label: 'Today' },
    { id: 'suggestions' as const, icon: Lightbulb, label: 'Ideas' },
    { id: 'connections' as const, icon: Settings, label: 'Connect' },
  ];

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around items-center py-3 px-4">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-200",
              activeTab === id 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Icon className={cn(
              "w-5 h-5 transition-all duration-200",
              activeTab === id && "scale-110"
            )} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};