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

  connectedCallback() {
    super.connectedCallback();

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
    super.disconnectedCallback();

    this.removeEventListener(ToujouDetailsEventNames.DETAILS_TOGGLE, this._handleDetailsToggle);
  }

  firstUpdated() {
    const slot = this.shadowRoot?.querySelector('slot');
    if (!slot) return;

    const nodes = slot.assignedElements({ flatten: true });

    nodes.forEach((node) => {
      if (node.nodeName === 'TOUJOU-DETAILS') {
        this.toujouDetailsElements.add(node as ToujouDetails);
      }
    });

    if (this.toujouDetailsElements.size === 0) {
      this.setAttribute('has-no-children', '');
      console.warn('TOUJOU-DETAILS-ACCORDION has no valid children!', this);
    }
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
