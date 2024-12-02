import { ToujouDetails } from '../toujou-details/toujou-details';

export interface ToujouDetailsEventToggleDetails {
  detailsEl: ToujouDetails;
  state?: boolean;
}

export interface ToujouDetailsEventConnectedDetails {
  detailsEl: ToujouDetails;
}

export enum ToujouDetailsEventNames {
  DETAILS_CONNECTED = 'toujou-details-connected',
  DETAILS_TOGGLE = 'toujou-details-toggle',
  DETAILS_ACCORDION_CONNECTED = 'toujou-details-accordion-connected'
}
