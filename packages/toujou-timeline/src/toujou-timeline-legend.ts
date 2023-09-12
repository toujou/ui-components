import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { timelineNewObservationEventName, TimelineObservation } from "./utils/_utils";

@customElement('toujou-timeline-legend')
export class ToujouTimelineLegend extends LitElement {
  private readonly isActiveAttribute: string = 'is-active';

  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();

    window.addEventListener(timelineNewObservationEventName, this._onTimelineObservations.bind(this));
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
    })
  }
}

