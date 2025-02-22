interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="flex justify-center">
      <div className="relative max-w-[736px] w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <input
          type="search"
          placeholder="Search classrooms"
          className="w-full h-[42px] pl-10 pr-4 rounded-[21px] bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
} 