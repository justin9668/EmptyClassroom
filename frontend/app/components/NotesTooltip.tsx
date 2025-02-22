import { useState, useRef, useEffect } from 'react';

interface NotesTooltipProps {
  children: React.ReactNode;
}

export function NotesTooltip({ children }: NotesTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    const handleScroll = () => isMobile && setIsVisible(false);

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible, isMobile]);

  return (
    <div className="relative inline-flex items-center">
      <div
        ref={triggerRef}
        onClick={() => isMobile && setIsVisible(!isVisible)}
        onMouseEnter={() => !isMobile && setIsVisible(true)}
        onMouseLeave={() => !isMobile && setIsVisible(false)}
        className="inline-flex items-center"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed left-4 right-4 md:absolute md:left-1/2 md:-translate-x-1/2 md:w-80 z-50 bg-white rounded-lg border border-gray-200 p-4 mb-2"
          style={{ bottom: '100%' }}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Notes</h2>
              <button
                onClick={() => setIsVisible(false)}
                className="md:hidden text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3 text-gray-600">
              <div className="flex">
                <span className="mr-2">•</span>
                <span>Displayed availability only reflects official class schedules and reservations</span>
              </div>
              <div className="flex">
                <span className="mr-2">•</span>
                <span>Rooms may be occupied by unofficial meetings or study groups</span>
              </div>
              <div className="flex">
                <span className="mr-2">•</span>
                <span>Building or room access may be restricted to specific colleges or departments</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 