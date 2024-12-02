import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './css/toujou-details.css';
import {
  ToujouDetailsEventConnectedDetails,
  ToujouDetailsEventNames,
  ToujouDetailsEventToggleDetails
} from '../types/types';

@customElement('toujou-details')
export class ToujouDetails extends LitElement {
  detailsEl: HTMLDetailsElement | null = null;

  accordionParentTag = 'toujou-details-accordion';

  @property({ type: Boolean })
    isAccordionItem = false;

  @property({ type: Boolean, reflect: true, attribute: 'is-open' })
    isOpen = false;

  static get styles() {
    return styles;
  }

  connectedCallback() {
    super.connectedCallback();
    this.isAccordionItem = Boolean(this.closest(this.accordionParentTag));

    if (this.isAccordionItem) {
      this.dispatchEvent(new CustomEvent(ToujouDetailsEventNames.DETAILS_CONNECTED, {
        bubbles: true,
        composed: true,
        detail: {
          detailsEl: this
        } as ToujouDetailsEventConnectedDetails
      }));
    }

    // Open for printing
    if (typeof window !== 'undefined' && window.matchMedia('print').matches) {
      this.isOpen = true;
    }
  }

  firstUpdated() {
    this.detailsEl = this.shadowRoot?.querySelector('.details');
    this.isOpen = this.detailsEl?.hasAttribute('open') || false;
  }

  render() {
    return html`
      <details
        class="details"
        part="details"
        ?open="${this.isOpen}"
        @toggle="${this._handleDetailsChange}"
        exportparts="details details-summary details-content"
      >
        <summary class="details__summary" part="details-summary">
          <slot name="summary"></slot>
          <slot name="chevron"></slot>
        </summary>
        <section class="details__content" part="details-content">
          <slot name="content"></slot>
        </section>
      </details>
    `;
  }

  _handleDetailsChange(event: Event) {
    const eventTarget = event.target as HTMLDetailsElement;

    this.isOpen = eventTarget.hasAttribute('open') || false;

    if (this.isAccordionItem) {
      this.dispatchEvent(new CustomEvent(ToujouDetailsEventNames.DETAILS_TOGGLE, {
        bubbles: true,
        composed: true,
        detail: {
          detailsEl: this,
          state: this.isOpen
        } as ToujouDetailsEventToggleDetails,
      }));
    }
  }
}
