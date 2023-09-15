import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import {
  timelineNewObservationEventName,
  timelineLegendReadyEventName,
  timelineLegendYearClickEventName,
  TimelineObservation,
} from './utils/_utils';

@customElement('toujou-timeline-legend')
export class ToujouTimelineLegend extends LitElement {
  private readonly isActiveAttribute: string = 'is-active';
  private _yearLinks: NodeListOf<HTMLAnchorElement>;
  private _isHorizontalTimeline: boolean;

  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();

    this._yearLinks = this.querySelectorAll('.timeline-legend__link');
    if (!this._yearLinks) return;

    this._init();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener(timelineNewObservationEventName, this._onTimelineObservations.bind(this));
  }

  /**
   * Initialize the legend component:
   *  - Add timeline observations events listener
   *  - If horizontal timeline -> add year click listeners
   */
  _init() {
    window.addEventListener(timelineNewObservationEventName, this._onTimelineObservations.bind(this));

    this._yearLinks.forEach((yearLink) => {
      yearLink.addEventListener('keyup', this._handleYearLinkKeyUp);
    });

    this._isHorizontalTimeline = !!this.closest('.timeline[timeline-direction="horizontal"]');

    if (this._isHorizontalTimeline) {
      this._initYearClicks();
    }

    this.dispatchEvent(new CustomEvent(timelineLegendReadyEventName, {
      bubbles: true,
      composed: true,
      detail: this
    }));
  }

  /**
   * Add a click event listener to each of the year links elements
   */
  _initYearClicks() {
    this._yearLinks.forEach((yearLink) => {
      yearLink.addEventListener('click', this._onYearLinkClick);
    });
  }

  /**
   * Listen to any observations (visibility change of any timeline "year" element)
   * and toggle the 'is-active' attribute accordingly
   * @param event
   */
  _onTimelineObservations(event: Event) {
    const observations = (<CustomEvent>event).detail;
    if (!observations) return;

    observations.forEach((observation: TimelineObservation) => {
      const targetLink = this.querySelector(`.timeline-legend__link[href="#${observation.yearId}"]`);
      if (!targetLink) return;

      observation.isIntersecting
        ? targetLink.setAttribute(this.isActiveAttribute, '')
        : targetLink.removeAttribute(this.isActiveAttribute);
    });
  }

  /**
   * When a year link is clicked:
   *  - prevent default
   *  - get target hash and dispatch custom event
   * @param event
   */
  _onYearLinkClick(event: MouseEvent) {
    let yearHash = undefined;

    const year = event.currentTarget as HTMLAnchorElement;
    if (!year) return;

    const yearTargetId = year.href;
    if (!yearTargetId) return;

    const yearParts = yearTargetId.split('#');
    if (yearParts.length > 1) {
      yearHash = yearParts.pop();
    }

    if (!yearHash) return;

    event.preventDefault();
    event.stopPropagation();

    this.dispatchEvent(new CustomEvent(timelineLegendYearClickEventName, {
      bubbles: true,
      composed: true,
      detail: yearHash
    }));
  }

  /**
   * Handle Space and Enter key press when year link is focused
   * @param event
   */
  _handleYearLinkKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.code === 'Enter' || event.code === 'Space' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      const currentTarget = (event.currentTarget as HTMLInputElement);
      currentTarget.click();
    }
  }
}

