'use client';

import { BuildingsContent } from './components/BuildingsContent';
import { NotesTooltip } from './components/NotesTooltip';
import { RefreshButton } from './components/RefreshButton';
import { useState, useEffect } from 'react';

export default function Home() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<number | null>(null);
  const [cooldownStartTime, setCooldownStartTime] = useState<number | null>(null);
  const [initialCooldownMinutes, setInitialCooldownMinutes] = useState<number | null>(null);

  const fetchLastUpdated = async () => {
    try {
      const response = await fetch('/api/open-classrooms');
      if (response.ok) {
        const data = await response.json();
        setLastUpdated(data.last_updated);
        
        if (data.last_updated) {
          await fetchCooldownStatus();
        }
      }
    } catch (error) {
      console.error('Failed to fetch last updated time:', error);
    }
  };

  const fetchCooldownStatus = async () => {
    try {
      const response = await fetch('/api/cooldown-status');
      if (response.ok) {
        const data = await response.json();
        if (data.in_cooldown) {
          setCooldownRemaining(data.remaining_minutes);
          setCooldownStartTime(Date.now());
          setInitialCooldownMinutes(data.remaining_minutes);
        } else {
          setCooldownRemaining(null);
          setCooldownStartTime(null);
          setInitialCooldownMinutes(null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch cooldown status:', error);
    }
  };

  const handleRefresh = async () => {
    if (cooldownRemaining && cooldownRemaining > 0) {
      return; // Don't allow refresh during cooldown
    }
    
    setIsRefreshing(true);
    setCooldownRemaining(null);
    
    try {
      const response = await fetch('/api/refresh', {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setLastUpdated(data.timestamp);
        // Refresh page to get updated data
        window.location.reload();
      } else {
        const errorData = await response.json();
        // Extract cooldown time from error message
        const cooldownMatch = errorData.error?.match(/(\d+\.?\d*)\s+more\s+minutes/);
        if (cooldownMatch) {
          const minutes = parseFloat(cooldownMatch[1]);
          setCooldownRemaining(minutes);
          setCooldownStartTime(Date.now());
          setInitialCooldownMinutes(minutes);
        }
      }
    } catch {
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLastUpdated();
    fetchCooldownStatus();
  }, []);

  // Countdown timer for cooldown
  useEffect(() => {
    if (!initialCooldownMinutes || !cooldownStartTime) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - cooldownStartTime) / (1000 * 60); // minutes
      const remaining = Math.max(0, initialCooldownMinutes - elapsed);
      
      if (remaining <= 0) {
        setCooldownRemaining(null);
        setCooldownStartTime(null);
        setInitialCooldownMinutes(null);
      } else {
        setCooldownRemaining(remaining);
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [initialCooldownMinutes, cooldownStartTime]);

  const formatLastUpdated = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 flex flex-col flex-1">
        <div className="max-w-[736px] mx-auto w-full flex flex-col flex-1">
          <h1 className="text-2xl font-semibold text-gray-900 mb-0 text-center pt-12">Find an empty classroom</h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-sm text-gray-500">Last updated {formatLastUpdated(lastUpdated)}</span>
            <RefreshButton
              isRefreshing={isRefreshing}
              cooldownRemaining={cooldownRemaining}
              onRefresh={handleRefresh}
            />
          </div>
          <BuildingsContent />
          <footer className="mt-auto py-4 flex justify-center gap-6 bg-white/80 backdrop-blur-sm -mx-4 px-4">
            <NotesTooltip>
              <span className="text-gray-500 hover:text-gray-700 cursor-pointer">
                Notes
              </span>
            </NotesTooltip>
            <a
              href="https://form.typeform.com/to/t17kzOqs"
              target="_blank"
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              Request
            </a>
            <a 
              href="https://github.com/justin9668/EmptyClassroom" 
              target="_blank" 
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              GitHub
            </a>
          </footer>
        </div>
      </div>
    </main>
  );
}
