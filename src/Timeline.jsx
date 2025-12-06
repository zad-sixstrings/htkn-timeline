import { useEffect, useRef } from "react";
import "./Timeline.css";
import TimelineEvent from "./TimelineEvent";
import { useTimelineData } from "./utils/useTimelineData";

export default function Timeline({ searchQuery, onCountsUpdate }) {
  const {
    events,
    filteredEvents,
    displayedEvents,
    loading,
    error,
    visibleCount,
    previousCount,
  } = useTimelineData(searchQuery);

  // Track previous counts to avoid unnecessary updates
  const prevCountsRef = useRef({ filtered: 0, total: 0 });

  // Update counts only when they actually change
  useEffect(() => {
    if (onCountsUpdate && !loading) {
      const filteredLength = filteredEvents.length;
      const totalLength = events.length;
      
      // Only call if counts have actually changed
      if (
        prevCountsRef.current.filtered !== filteredLength ||
        prevCountsRef.current.total !== totalLength
      ) {
        prevCountsRef.current = { filtered: filteredLength, total: totalLength };
        onCountsUpdate(filteredLength, totalLength);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredEvents.length, events.length, loading]);

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

  // Show no search results
  if (searchQuery && filteredEvents.length === 0) {
    return (
      <div className="timeline-wrapper">
        <div className="timeline-status">
          Aucun événement ne correspond à "{searchQuery}"
        </div>
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

      {visibleCount < filteredEvents.length && (
        <div className="timeline-loading-more">
          Chargement...
        </div>
      )}
    </div>
  );
}