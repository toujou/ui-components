import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import {
  timelineNewObservationEventName,
  timelineReadyEventName,
  TimelineObservation
} from "./utils/_utils";

@customElement('toujou-timeline')
export class ToujouTimeline extends LitElement {
  private _years: NodeListOf<Element>;
  private observer: IntersectionObserver;

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
   * CGenerate a threshold list for the observer base on a number of steps
   * @param numberOfSteps
   */
  _createThresholdList(numberOfSteps: number) {
    return [...Array(numberOfSteps).keys()].map((x) => x / numberOfSteps);
  }
}

