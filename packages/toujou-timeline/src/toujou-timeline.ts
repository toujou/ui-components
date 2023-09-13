import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import {
  timelineNewObservationEventName,
  timelineLegendYearClickEventName,
  timelineReadyEventName,
  TimelineObservation
} from "./utils/_utils";

@customElement('toujou-timeline')
export class ToujouTimeline extends LitElement {
  private _years: NodeListOf<Element>;
  private observer: IntersectionObserver;
  private _timelineContainerEl: HTMLElement;
  private _isHorizontalTimeline: boolean;

  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();

    this._init();
  }

  /**
   * Initialize the timeline element by
   *  - Getting all 'year' element and start observing any visibility changes
   */
  _init() {
    this._years = this.querySelectorAll('.timeline-item__year');
    if (!this._years) return;

    this._timelineContainerEl = this.querySelector('.timeline__container');

    this._isHorizontalTimeline = this.getAttribute('timeline-direction') === 'horizontal';
    if (this._isHorizontalTimeline) {
      this._checkForLocationHash();
    }

    // Options for the intersection observer
    const options = {
      rootMargin: '-100px -100px -100px -100px',
      threshold: this._createThresholdList(50),
    }

    this.observer = new IntersectionObserver(this._handleObserver.bind(this), options);

    // Watch for any visibility changes on any of the "year" items
    this._years.forEach((year) => {
      this.observer.observe(year);
    })

    // Timeline ready event dispatch
    this.dispatchEvent(new CustomEvent(timelineReadyEventName, {
      bubbles: true,
      composed: true,
      detail: this
    }));

    this.addEventListener(timelineLegendYearClickEventName, this._onLegendYearClick);
  }

  /**
   * Dispatch a custom event whenever any of the "year" element's visibility changes
   * @param entries
   */
  _handleObserver(entries: IntersectionObserverEntry[]) {
    const observations: TimelineObservation[] = [];

    entries.forEach((entry) => {
      const targetId = entry.target.id;
      if (!targetId) return;

      observations.push({
        yearId: targetId,
        isIntersecting: entry.isIntersecting
      } as TimelineObservation);

      this.dispatchEvent(new CustomEvent(timelineNewObservationEventName, {
        bubbles: true,
        composed: true,
        detail: observations
      }));
    })
  }

  /**
   * Generate a threshold list for the observer base on a number of steps
   * @param numberOfSteps
   */
  _createThresholdList(numberOfSteps: number) {
    return [...Array(numberOfSteps).keys()].map((x) => x / numberOfSteps);
  }

  /**
   * React to the legend year click by getting the correct scroll target element and triggering the scroll function
   * @param event
   */
  _onLegendYearClick(event: Event) {
    const scrollTarget = (<CustomEvent>event).detail;
    if (!scrollTarget) return;

    this._scrollToYear(scrollTarget);
  }

  /**
   * Scroll to the correct target element
   * @param scrollTarget
   */
  _scrollToYear(scrollTarget: string) {
    const targetYearEl = this.querySelector(`#${scrollTarget}`);
    if (!targetYearEl) return;

    const targetParentTimelineItem = targetYearEl.closest('.timeline-item') as HTMLElement;
    if (!targetParentTimelineItem) return;

    const timelineParentItemOffsetLeft = targetParentTimelineItem.offsetLeft;

    this._timelineContainerEl.scrollTo({
      left: timelineParentItemOffsetLeft,
      behavior: 'smooth'
    })
  }

  /**
   * Check if the location address has a #id. If so:
   *  - check if it corresponds to a timeline's child element. If so:
   *    - Scroll timeline into view
   *    - Scroll to correct year
   */
  _checkForLocationHash = () => {
    const yearHash = window.location.hash;
    if (!yearHash) return;
    const targetYearEl = this.querySelector(`${yearHash}`);

    if (targetYearEl) {
      // Means the hash corresponds to a child element's id, and we should scroll it into view
      this._timelineContainerEl.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
      this._scrollToYear(yearHash.substring(1))

      setTimeout(() => {
        console.log('TODO: this has been called from inside a timeout!!!');
        this.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
      }, 1000);
    }
  }
}

