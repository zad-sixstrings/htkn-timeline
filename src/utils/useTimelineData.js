import { useEffect, useState, useMemo } from "react";
import yaml from "js-yaml";
import { INITIAL_VISIBLE_COUNT, LOAD_INCREMENT, SCROLL_THRESHOLD } from "./constants";

// Parse date for sorting
function parseFlexibleDate(dateStr) {
  if (/^\d{4}$/.test(dateStr)) {
    // Just year: treat as January 1st for sorting
    return new Date(`${dateStr}-01-01`);
  } else if (/^\d{4}-\d{2}$/.test(dateStr)) {
    // Year-month: treat as 1st of that month
    return new Date(`${dateStr}-01`);
  } else {
    // Full date
    return new Date(dateStr);
  }
}

// Extract YAML frontmatter from markdown
function parseFrontmatter(text) {
  // Handle both \n and \r\n line endings
  const match = text.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/);
  if (match) {
    return yaml.load(match[1]);
  }
  return null;
}

// Filter events based on search query
function filterEvents(events, searchQuery) {
  if (!searchQuery || searchQuery.trim() === "") {
    return events;
  }

  const query = searchQuery.toLowerCase().trim();

  return events.filter((event) => {
    // Search in title
    if (event.title && event.title.toLowerCase().includes(query)) {
      return true;
    }

    // Search in description
    if (event.description && event.description.toLowerCase().includes(query)) {
      return true;
    }

    // Search in date (formatted)
    if (event.date && event.date.toLowerCase().includes(query)) {
      return true;
    }

    // Search in category
    if (event.category && event.category.toLowerCase().includes(query)) {
      return true;
    }

    return false;
  });
}

export function useTimelineData(searchQuery = "") {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [previousCount, setPreviousCount] = useState(0);

  // Fetch and parse timeline data
  useEffect(() => {
    fetch("/timeline.md")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        return res.text();
      })
      .then((text) => {
        const data = parseFrontmatter(text);

        if (!data || !data.events) {
          throw new Error("No events found in frontmatter");
        }

        // Sort events by date
        const sortedEvents = data.events.sort(
          (a, b) => parseFlexibleDate(a.date) - parseFlexibleDate(b.date)
        );

        setEvents(sortedEvents);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading timeline:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter events based on search query (memoized to prevent infinite loops)
  const filteredEvents = useMemo(() => {
    return filterEvents(events, searchQuery);
  }, [events, searchQuery]);

  // Reset visible count when search changes
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [searchQuery]);

  // Update displayed events
  useEffect(() => {
    setDisplayedEvents(filteredEvents.slice(0, visibleCount));
    setPreviousCount(visibleCount);
  }, [filteredEvents, visibleCount]);

  // Scroll listener to load more events
  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - SCROLL_THRESHOLD;

      if (scrolledToBottom && visibleCount < filteredEvents.length) {
        setVisibleCount((prev) => Math.min(prev + LOAD_INCREMENT, filteredEvents.length));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, filteredEvents.length]);

  return {
    events,
    filteredEvents,
    displayedEvents,
    loading,
    error,
    visibleCount,
    previousCount,
  };
}