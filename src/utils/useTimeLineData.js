import { useEffect, useState } from "react";
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

export function useTimelineData() {
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

  // Update displayed events
  useEffect(() => {
    setDisplayedEvents(events.slice(0, visibleCount));
    setPreviousCount(visibleCount);
  }, [events, visibleCount]);

  // Scroll listener to load more events
  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - SCROLL_THRESHOLD;

      if (scrolledToBottom && visibleCount < events.length) {
        setVisibleCount((prev) => Math.min(prev + LOAD_INCREMENT, events.length));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, events.length]);

  return {
    events,
    displayedEvents,
    loading,
    error,
    visibleCount,
    previousCount,
  };
}