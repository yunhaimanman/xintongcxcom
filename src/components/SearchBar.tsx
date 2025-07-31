import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 在实际应用中，这里会执行搜索逻辑
    if (searchQuery.trim()) {
      console.log('搜索:', searchQuery);
    }
  };
  
  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-10">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索工具..."
          className={cn(
            "w-full px-5 py-4 pr-12 rounded-full border border-gray-200 dark:border-gray-700",
            "bg-white dark:bg-gray-800 shadow-md focus:shadow-lg",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            "transition-all duration-300 text-gray-800 dark:text-white"
          )}
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
        >
          <i className="fa-solid fa-search"></i>
        </button>
      </div>
    </form>
  );
}