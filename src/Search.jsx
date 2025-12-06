import { useState, useEffect, useRef } from "react";
import "./Search.css";

export default function Search({ onSearchChange, resultsCount, totalCount }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef(null);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Debounce search to avoid too many updates
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, onSearchChange]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      // Clear search when collapsing
      setSearchValue("");
      onSearchChange("");
    }
  };

  const handleClear = () => {
    setSearchValue("");
    onSearchChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="search-wrapper">
      {!isExpanded ? (
        <button
          className="search-icon-button"
          onClick={handleToggle}
          aria-label="Ouvrir la recherche"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      ) : (
        <div className="search-bar-container">
          <div className="search-bar">
            <svg
              className="search-bar-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Rechercher..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <button
                className="search-clear-button"
                onClick={handleClear}
                aria-label="Effacer"
              >
                ×
              </button>
            )}
            <button
              className="search-close-button"
              onClick={handleToggle}
              aria-label="Fermer la recherche"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          {searchValue && (
            <div className="search-results-count">
              {resultsCount} événement{resultsCount !== 1 ? "s" : ""} trouvé
              {resultsCount !== 1 ? "s" : ""} sur {totalCount}
            </div>
          )}
        </div>
      )}
    </div>
  );
}