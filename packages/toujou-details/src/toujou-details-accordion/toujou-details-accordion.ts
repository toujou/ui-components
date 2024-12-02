import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ToujouDetails } from '../toujou-details/toujou-details';
import {
  ToujouDetailsEventConnectedDetails,
  ToujouDetailsEventNames,
  ToujouDetailsEventToggleDetails
} from '../types/types';

@customElement('toujou-details-accordion')
export class ToujouDetailsAccordion extends LitElement {
  @property({ type: Boolean, attribute: 'single-expand-mode' })
    singleExpandMode = false;

  @property({ attribute: false })
    toujouDetailsElements: Set<ToujouDetails> = new Set();

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener(ToujouDetailsEventNames.DETAILS_CONNECTED, this._handleDetailsConnected);
    this.addEventListener(ToujouDetailsEventNames.DETAILS_TOGGLE, this._handleDetailsToggle);

    this.dispatchEvent(new CustomEvent(ToujouDetailsEventNames.DETAILS_ACCORDION_CONNECTED, {
      bubbles: true,
      composed: true,
      detail: {
        accordionEl: this
      }
    }));
  }

  disconnectedCallback() {
    this.removeEventListener(ToujouDetailsEventNames.DETAILS_CONNECTED, this._handleDetailsConnected);
    this.removeEventListener(ToujouDetailsEventNames.DETAILS_TOGGLE, this._handleDetailsToggle);
  }

  _handleDetailsConnected(event: Event): void {
    const connectedEvent = event as CustomEvent<ToujouDetailsEventConnectedDetails>;
    const detailsEl = connectedEvent.detail.detailsEl as ToujouDetails;
    this.toujouDetailsElements.add(detailsEl);
  }

  _handleDetailsToggle(event: Event) {
    const toggleEvent = event as CustomEvent<ToujouDetailsEventToggleDetails>;
    const { detailsEl, state } = toggleEvent.detail;
    if (!this.singleExpandMode || !state) return;

    this.toujouDetailsElements.forEach((el) => {
      if (el === detailsEl) return;
      el.isOpen = false;
    });
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'toujou-details-accordion': ToujouDetailsAccordion
  }
}
