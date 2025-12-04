import { useEffect, useState } from "react";
import yaml from "js-yaml";
import "./Timeline.css";
import timelineMarker from "./assets/logos/timeline-marker.png";

// Parse flags
function parseFlags(text) {
  return text.replace(/\{flag-([\w]{2})\}(\S+)/g, (match, code, name) => {
    const countryCode = code.toLowerCase();
    return `<span style="white-space: nowrap;"><img src="/flags/${countryCode}.svg" alt="${countryCode}" class="flag-icon" />${name}</span>`;
  });
}

// Parse date for sorting (fills in missing parts with defaults)
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

// Display date based on original precision
function formatDate(dateStr) {
  if (/^\d{4}$/.test(dateStr)) {
    return dateStr; // "2008"
  } else if (/^\d{4}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
    });
  } else {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

export default function Timeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [previousCount, setPreviousCount] = useState(0);

  const eventIcons = {
    achievement: "trophy.png",
    gaming: "controller.png",
    team: "group.png",
  };

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
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

      if (scrolledToBottom && visibleCount < events.length) {
        setVisibleCount((prev) => Math.min(prev + 1, events.length));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, events.length]);

  /*
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (events.length === 0) return <div>Aucun événement trouvé</div>;
  */
 
  return (
    <div className="timeline-wrapper">
      {displayedEvents.map((event, i) => {
        // Check if this is a newly loaded event
        const isNew = i >= previousCount - 5;

        return (
          <div
            key={i}
            className={`timeline-event-container ${isNew ? "fade-in" : ""}`}
          >
            <div className="timeline-event right">
              {event.category && eventIcons[event.category] && (
                <img
                  src={`/event-icons/${eventIcons[event.category]}`}
                  alt={event.category}
                  className="event-icon"
                />
              )}
              <div className="timeline-event-date">
                <p>{formatDate(event.date)}</p>
              </div>
              <div className="timeline-event-title">
                <h3>{event.title}</h3>
              </div>
              <div className="timeline-event-content">
                <p
                  dangerouslySetInnerHTML={{
                    __html: parseFlags(event.description),
                  }}
                ></p>
              </div>
              {event.image && (
                <div className="timeline-event-image">
                  <img
                    src={`/images/${event.image}`}
                    alt={event.title}
                    className="event-image"
                  />
                </div>
              )}
            </div>
            <div className="timeline-marker">
              <img
                src={timelineMarker}
                alt="Marqueur de timeline"
                className="timeline-marker-logo"
              />
            </div>
          </div>
        );
      })}

      {visibleCount < events.length && (
        <div style={{ textAlign: "center", padding: "20px", opacity: 0.5 }}>
          Chargement...
        </div>
      )}
    </div>
  );
}
