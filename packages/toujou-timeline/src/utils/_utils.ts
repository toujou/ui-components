export const timelineNewObservationEventName = 'toujou-timeline-new-observation';
export const timelineReadyEventName = 'toujou-timeline-ready';

export interface TimelineObservation {
  yearId: string;
  isIntersecting: boolean;
}
