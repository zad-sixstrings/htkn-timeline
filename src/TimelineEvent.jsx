import { EVENT_ICONS } from "./utils/constants";
import timelineMarker from "./assets/logos/timeline-marker.png";

// Parse flags in description text
function parseFlags(text) {
  return text.replace(/\{flag-([\w]{2})\}(\S+)/g, (match, code, name) => {
    const countryCode = code.toLowerCase();
    return `<span style="white-space: nowrap;"><img src="/flags/${countryCode}.svg" alt="${countryCode}" class="flag-icon" />${name}</span>`;
  });
}

// Display date based on original precision
function formatDate(dateStr) {
  if (/^\d{4}$/.test(dateStr)) {
    return dateStr;
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

export default function TimelineEvent({ event, isNew }) {
  return (
    <div
      className={`timeline-event-container ${isNew ? "fade-in" : ""}`}
    >
      <div className="timeline-event right">
        {event.category && EVENT_ICONS[event.category] && (
          <img
            src={`/event-icons/${EVENT_ICONS[event.category]}`}
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
}