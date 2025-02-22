'use client';

import { BuildingAccordion } from './BuildingAccordion';
import { SearchBar } from './SearchBar';
import { useState, useEffect } from 'react';
import { OpenClassroomsResponse } from '../types/buildings';

export function BuildingsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [buildings, setBuildings] = useState<OpenClassroomsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOpenClassrooms() {
      try {
        const response = await fetch('/api/open-classrooms');
        if (!response.ok) {
          throw new Error(`Failed to load classrooms (${response.status})`);
        }
        const data = await response.json();
        setBuildings(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching buildings:', error);
        setError('Failed to load classrooms. Please try again later.');
      }
    }
    fetchOpenClassrooms();
  }, []);

  return (
    <>
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 -mx-4 px-4 py-4">
        <SearchBar onSearch={setSearchQuery} />
      </div>
      <div className="flex-1">
        {error ? (
          <div className="flex items-center justify-center py-8 text-red-500">
            {error}
          </div>
        ) : buildings ? (
          <BuildingAccordion buildings={buildings} searchQuery={searchQuery} />
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-gray-500">Loading classrooms...</div>
          </div>
        )}
      </div>
    </>
  );
} 