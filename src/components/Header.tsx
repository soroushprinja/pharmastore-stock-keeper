
import React from 'react';
import { Activity, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CurrencySelector from '@/components/CurrencySelector';

interface HeaderProps {
  onShowSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowSettings }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                PharmaStore
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <CurrencySelector />
            
            {onShowSettings && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowSettings}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            )}
            
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
