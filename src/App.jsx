import { useEffect, useState } from "react";
import yaml from "js-yaml";
import "./App.css";
import Header from "./Header";

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

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/timeline.md")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        return res.text();
      })
      .then((text) => {
        console.log("Raw markdown:", text); // Debug log
        const data = parseFrontmatter(text);
        console.log("Parsed data:", data); // Debug log

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

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (events.length === 0) return <div>Aucun événement trouvé</div>;

  return (
    <>
      <Header />
      <div className="timeline-wrapper">
        {events.map((event, i) => (
          <div key={i} className="timeline-event-container">
            <div className="timeline-event right">
              <div className="timeline-event-date">
                <p>{formatDate(event.date)}</p>
              </div>
              <div className="timeline-event-title">
                <h3>{event.title}</h3>
              </div>
              <div className="timeline-event-content">
                <p>{event.description}</p>
              </div>
            </div>
            <div className="timeline-marker">
              <img
                src="./src/assets/logos/timeline-marker.png"
                alt="Marqueur de timeline"
                className="timeline-marker-logo"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
