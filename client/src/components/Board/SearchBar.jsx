import { useState, useEffect, useRef } from 'react';
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi';

/**
 * Search bar with debounced input for filtering tasks across all columns.
 */
export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(query.trim().toLowerCase());
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <HiOutlineSearch className="search-bar-icon" size={16} />
      <input
        type="text"
        className="search-bar-input"
        placeholder="Search tasks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button className="search-bar-clear" onClick={handleClear} title="Clear search">
          <HiOutlineX size={14} />
        </button>
      )}
    </div>
  );
}
