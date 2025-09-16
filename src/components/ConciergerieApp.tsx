import { useState } from 'react';
import { BottomNavigation, type NavigationTab } from './BottomNavigation';
import { HomeScreen } from './screens/HomeScreen';
import { TodayScreen } from './screens/TodayScreen';
import { SuggestionsScreen } from './screens/SuggestionsScreen';
import { ConnectionsScreen } from './screens/ConnectionsScreen';

export const ConciergerieApp = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'today':
        return <TodayScreen />;
      case 'suggestions':
        return <SuggestionsScreen />;
      case 'connections':
        return <ConnectionsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="mobile-container">
      {/* Screen content */}
      <main className="pb-20">
        {renderScreen()}
      </main>

      {/* Bottom navigation */}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
};