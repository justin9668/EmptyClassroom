'use client';

import { BuildingAccordion } from './BuildingAccordion';
import { SearchBar } from './SearchBar';
import { useState } from 'react';
import { OpenClassroomsResponse } from '../types/buildings';

interface BuildingsContentProps {
  buildings: OpenClassroomsResponse | null;
  error: string | null;
}

export function BuildingsContent({ buildings, error }: BuildingsContentProps) {
  const [searchQuery, setSearchQuery] = useState('');

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
        ) : null}
      </div>
    </>
  );
}