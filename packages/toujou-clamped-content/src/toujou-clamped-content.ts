import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './css/toujou-clamped-content.css';

@customElement('toujou-clamped-content')
export class ToujouClampedContent extends LitElement {
  @property({ type: Boolean, attribute: 'is-open', reflect: true })
  private isOpen = false;

  @property({ type: Boolean, attribute: 'clamp-disabled', reflect: true })
  protected clampDisabled = false;

  static get styles() {
    return styles;
  }

  render() {
    return html`
      <div class="clamped-content" part="clamped-content">
        <slot name="clamped-content" @slotchange="${this.#updateClampEnabledState}"></slot>
      </div>
      <slot name="show-button" class="button-slot" @click="${this.toggleIsOpen}"></slot>
      <slot name="hide-button" class="button-slot" @click="${this.toggleIsOpen}"></slot>
    `;
  }

  firstUpdated() {
    this.#updateClampEnabledState();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('isOpen')) {
      this.setAttribute('aria-expanded', String(this.isOpen));
    }
  }

  toggleIsOpen = () => {
    this.isOpen = !this.isOpen;

    this.dispatchEvent(new CustomEvent('toujou-clamped-content-changed', {
      bubbles: true,
      composed: true,
      detail: { isOpen: this.isOpen },
    }));
  };

  #updateClampEnabledState = () => {
    const contentSlot = this.shadowRoot?.querySelector('slot[name=clamped-content]') as HTMLSlotElement;
    const contentElements = contentSlot?.assignedElements({ flatten: true });

    if (!contentElements || contentElements.length === 0) {
      this.clampDisabled = true;
    } else {
      const contentElement = contentElements[0] as HTMLElement;
      this.clampDisabled = contentElement.scrollHeight <= contentElement.clientHeight;
    }

    this.dispatchEvent(new CustomEvent('toujou-clamped-content-clamp-enabled-changed', {
      detail: { clampDisabled: this.clampDisabled },
      bubbles: true,
      composed: true,
    }));
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'toujou-clamped-content': ToujouClampedContent;
  }
}
