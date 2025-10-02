interface RefreshButtonProps {
  isRefreshing: boolean;
  cooldownRemaining: number | null;
  onRefresh: () => void;
}

export function RefreshButton({ isRefreshing, cooldownRemaining, onRefresh }: RefreshButtonProps) {
  const isDisabled = isRefreshing || (cooldownRemaining !== null && cooldownRemaining > 0);

  return (
    <div className="relative group">
      <button 
        className={`text-sm px-2 py-1 rounded transition-colors ${
          isDisabled
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-500 hover:text-gray-700 cursor-pointer hover:bg-gray-100'
        }`}
        onClick={onRefresh}
        disabled={isDisabled}
      >
        {isRefreshing ? (
          '↻ Refreshing...'
        ) : (
          '↻ Refresh'
        )}
      </button>
      {cooldownRemaining && cooldownRemaining > 0 && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          Please wait {Math.ceil(cooldownRemaining)} more minutes
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
        </div>
      )}
    </div>
  );
}
