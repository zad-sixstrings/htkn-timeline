import { useState } from "react";
import { EVENT_ICONS } from "./utils/constants";
import timelineMarker from "./assets/timeline-marker.png";
import Parser from "./Parser";
import "./lightbox.css";
import "./tooltips.css";

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
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      {lightboxOpen && (
        <div
          className="lightbox-backdrop"
          onClick={() => setLightboxOpen(false)}
        >
          <p>Cliquer en dehors de l'image pour fermer.</p>
          <img
            src={`/images/${event.image}`}
            alt={event.title}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <div className={`timeline-event-container ${isNew ? "fade-in" : ""}`}>
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
            <Parser text={event.description} />
          </div>
          {event.image && (
            <div
              className="timeline-event-image"
              onClick={() => setLightboxOpen(true)}
            >
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
    </>
  );
}
