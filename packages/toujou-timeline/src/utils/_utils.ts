// Custom event names
export const timelineNewObservationEventName = 'toujou-timeline-new-observation';
export const timelineReadyEventName = 'toujou-timeline-ready';

export const timelineLegendYearClickEventName = 'toujou-timeline-legend-year-click';
export const timelineLegendReadyEventName = 'toujou-timeline-legend-ready';

// Types and interfaces
export interface TimelineObservation {
  yearId: string;
  isIntersecting: boolean;
}
