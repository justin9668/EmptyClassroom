import * as Accordion from '@radix-ui/react-accordion';
import { OpenClassroomsResponse, Building, Classroom, TimeSlot } from '../types/buildings';
import { useState, useEffect } from 'react';

interface BuildingAccordionProps {
  buildings: OpenClassroomsResponse;
  searchQuery: string;
}

export function BuildingAccordion({ buildings, searchQuery }: BuildingAccordionProps) {
  const [openItem, setOpenItem] = useState<string | undefined>();
  const [currentTime, setCurrentTime] = useState(new Date());
  const isSearching = searchQuery.trim().length > 0;

  useEffect(() => {
    const scheduleNextUpdate = () => {
      setCurrentTime(new Date());
      return setTimeout(scheduleNextUpdate, 60000);
    };

    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    const initialTimeoutId = setTimeout(scheduleNextUpdate, msToNextMinute);
    
    return () => clearTimeout(initialTimeoutId);
  }, []);

  const parseTimeString = (timeStr: string): { hours: number; minutes: number } => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours, minutes };
  };

  const createTimeForToday = (hours: number, minutes: number, seconds = 0, milliseconds = 0): Date => {
    const date = new Date(currentTime);
    date.setHours(hours, minutes, seconds, milliseconds);
    return date;
  };

  const isTimeSlotAvailable = (slot: TimeSlot): boolean => {
    const { hours: startHour, minutes: startMinute } = parseTimeString(slot.start);
    const { hours: endHour, minutes: endMinute } = parseTimeString(slot.end);
    
    const startTime = createTimeForToday(startHour, startMinute);
    const endTime = createTimeForToday(endHour, endMinute, 59, 999);
    
    return currentTime >= startTime && currentTime <= endTime;
  };

  const isRoomAvailable = (room: Classroom): boolean => {
    return room.availability.some(isTimeSlotAvailable);
  };

  const getAvailableCount = (classrooms: Classroom[]): number => {
    return classrooms.filter(isRoomAvailable).length;
  };

  const formatTime = (time: string): string => {
    const { hours, minutes } = parseTimeString(time);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = hours % 12 || 12;
    return `${formattedHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const sortClassrooms = (classrooms: Classroom[]): Classroom[] => {
    return [...classrooms].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      
      const aStartsWithLetter = /^[a-z]/.test(nameA);
      const bStartsWithLetter = /^[a-z]/.test(nameB);
      
      if (aStartsWithLetter && !bStartsWithLetter) return -1;
      if (!aStartsWithLetter && bStartsWithLetter) return 1;
      
      if (aStartsWithLetter && bStartsWithLetter) {
        return nameA.localeCompare(nameB);
      }
      
      const aMatch = nameA.match(/^(\d+)([a-z]*)/);
      const bMatch = nameB.match(/^(\d+)([a-z]*)/);
      
      if (aMatch && bMatch) {
        const aNum = parseInt(aMatch[1], 10);
        const bNum = parseInt(bMatch[1], 10);
        const aSuffix = aMatch[2] || '';
        const bSuffix = bMatch[2] || '';
        
        if (aNum !== bNum) {
          return aNum - bNum;
        }
        
        if (aSuffix === '' && bSuffix !== '') return -1;
        if (aSuffix !== '' && bSuffix === '') return 1;
        if (aSuffix !== '' && bSuffix !== '') return aSuffix.localeCompare(bSuffix);
      }
      
      return nameA.localeCompare(nameB);
    });
  };

  const matchesSearch = (building: Building, code: string, classroom?: Classroom) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    if (classroom) {
      const withSpace = `${code} ${classroom.name}`.toLowerCase();
      const withoutSpace = `${code}${classroom.name}`.toLowerCase();
      return (
        withSpace.includes(query) ||
        withoutSpace.includes(query) ||
        building.name.toLowerCase().includes(query)
      );
    }

    return (
      code.toLowerCase().includes(query) ||
      building.name.toLowerCase().includes(query) ||
      building.classrooms.some(room => {
        const withSpace = `${code} ${room.name}`.toLowerCase();
        const withoutSpace = `${code}${room.name}`.toLowerCase();
        return withSpace.includes(query) || withoutSpace.includes(query);
      })
    );
  };

  const filteredBuildings = Object.entries(buildings).reduce<OpenClassroomsResponse>((acc, [code, building]) => {
    const typedBuilding = building as Building;
    const filteredClassrooms = typedBuilding.classrooms.filter(classroom => 
      matchesSearch(typedBuilding, code, classroom)
    );

    if (filteredClassrooms.length > 0 || matchesSearch(typedBuilding, code)) {
      acc[code] = {
        ...typedBuilding,
        classrooms: sortClassrooms(filteredClassrooms),
      };
    }

    return acc;
  }, {});

  const handleValueChange = (value: string) => {
    if (!isSearching) {
      setOpenItem(value);
    }
  };

  return (
    <Accordion.Root
      type="single"
      collapsible
      value={isSearching ? undefined : openItem}
      onValueChange={handleValueChange}
      className="w-full space-y-4 pb-4"
    >
      {Object.entries(filteredBuildings).map(([code, building]) => {
        const typedBuilding = building as Building;
        const availableCount = getAvailableCount(typedBuilding.classrooms);
        const isAvailable = availableCount > 0;

        return (
          <Accordion.Item
            key={code}
            value={code}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            data-state={isSearching ? "open" : undefined}
          >
            <Accordion.Header>
              <Accordion.Trigger 
                className="group w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 focus:outline-none"
                disabled={isSearching}
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {typedBuilding.name} - {code}
                </h3>
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-0.5 rounded-full text-sm font-medium ${
                    isAvailable 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {isAvailable 
                      ? `${availableCount} available`
                      : 'unavailable'
                    }
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-200 ease-in-out text-gray-700 ${isSearching ? 'rotate-180' : 'group-data-[state=open]:rotate-180'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </Accordion.Trigger>
            </Accordion.Header>
            
            <Accordion.Content 
              className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden" 
              {...(isSearching ? { forceMount: true } : {})}
            >
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="space-y-4">
                  {typedBuilding.classrooms.map((classroom: Classroom) => {
                    const available = isRoomAvailable(classroom);
                    return (
                      <div
                        key={classroom.id}
                        className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 font-mono">{code} {classroom.name}</span>
                              <div className={`w-2 h-2 rounded-full ${available ? 'bg-green-500' : 'bg-red-500'}`} />
                            </div>
                            {classroom.availability.length > 0 && (
                              <div className={`text-base font-medium font-mono ${isTimeSlotAvailable(classroom.availability[0]) ? 'text-green-600' : 'text-gray-700'}`}>
                                {formatTime(classroom.availability[0].start.slice(0, 5))} - {formatTime(classroom.availability[0].end.slice(0, 5))}
                              </div>
                            )}
                          </div>
                          {classroom.availability.slice(1).map((slot: TimeSlot, index) => {
                            const isActive = isTimeSlotAvailable(slot);
                            return (
                              <div 
                                key={index}
                                className="flex justify-end"
                              >
                                <div className={`text-base font-medium font-mono ${isActive ? 'text-green-600' : 'text-gray-700'}`}>
                                  {formatTime(slot.start.slice(0, 5))} - {formatTime(slot.end.slice(0, 5))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
} 