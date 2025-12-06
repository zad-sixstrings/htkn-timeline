import "./Timeline.css";
import TimelineEvent from "./TimelineEvent";
import { useTimelineData } from "./utils/useTimeLineData";

export default function Timeline() {
  const {
    events,
    displayedEvents,
    loading,
    error,
    visibleCount,
    previousCount,
  } = useTimelineData();

  // Show loading state
  if (loading) {
    return (
      <div className="timeline-wrapper">
        <div className="timeline-status">Chargement...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="timeline-wrapper">
        <div className="timeline-status error">Erreur: {error}</div>
      </div>
    );
  }

  // Show empty state
  if (events.length === 0) {
    return (
      <div className="timeline-wrapper">
        <div className="timeline-status">Aucun événement trouvé</div>
      </div>
    );
  }

  return (
    <div className="timeline-wrapper">
      {displayedEvents.map((event, i) => {
        // Check if this is a newly loaded event
        const isNew = i >= previousCount - 5;

        return (
          <TimelineEvent
            key={`${event.date}-${i}`}
            event={event}
            isNew={isNew}
          />
        );
      })}

      {visibleCount < events.length && (
        <div className="timeline-loading-more">
          Chargement...
        </div>
      )}
    </div>
  );
}