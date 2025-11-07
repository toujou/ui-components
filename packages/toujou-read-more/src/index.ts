import { LitElement, html, css } from 'lit';

export class ToujouReadMore extends LitElement {
  maxLines = 3;
  hasClampedText = true;
  showButton = false;

  static get is() {
    return 'toujou-read-more';
  }

  static properties = {
    maxLines: { type: Number, attribute: 'max-lines' },
    hasClampedText: { type: Boolean, reflect: true, attribute: 'has-clamped-text' },
    showButton: { type: Boolean, state: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    :host([has-clamped-text]) .content {
      -webkit-line-clamp: var(--toujou-read-more-max-lines, 3);
    }

    :host(:not([has-clamped-text])) .content {
      -webkit-line-clamp: unset;
    }

    .content {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }

    .buttons {
      margin-top: var(--spacing-normal);
      display: inline-block;
    }
  `;

  constructor() {
    super();
  }

  firstUpdated() {
    this.style.setProperty('--toujou-read-more-max-lines', this.maxLines.toString());
    requestAnimationFrame(() => this._checkOverflow());

    const slot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
    if (slot) {
      slot.addEventListener('slotchange', () => {
        const nodes = slot.assignedElements({ flatten: true }) as HTMLElement[];
        if (nodes.length > 0) {
          nodes.forEach((n: { style: { marginBottom: string; }; }) => (n instanceof HTMLElement ? n.style.marginBottom = '' : null));
          const last = nodes[nodes.length - 1] as HTMLElement;
          if (last) last.style.marginBottom = '0';
        }
      });
    }

    this._setupSlotListeners();
    this._setupButtonAccessibility();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('maxLines')) {
      this.style.setProperty('--toujou-read-more-max-lines', this.maxLines.toString());
      requestAnimationFrame(() => this._checkOverflow());
    }

    if (changedProps.has('hasClampedText') || changedProps.has('showButton')) {
      this.updateComplete.then(() => {
        this._setupButtonAccessibility();
      });
    }
  }

  private _setupSlotListeners() {
    const openSlot = this.shadowRoot?.querySelector('slot[name="open-button"]') as HTMLSlotElement;
    const closeSlot = this.shadowRoot?.querySelector('slot[name="close-button"]') as HTMLSlotElement;

    if (openSlot) {
      openSlot.addEventListener('slotchange', () => {
        requestAnimationFrame(() => this._setupButtonAccessibility());
      });
    }

    if (closeSlot) {
      closeSlot.addEventListener('slotchange', () => {
        requestAnimationFrame(() => this._setupButtonAccessibility());
      });
    }
  }

  private _setupButtonAccessibility() {
    const content = this.shadowRoot?.querySelector('.content') as HTMLElement;

    // Get all button slots
    const openSlot = this.shadowRoot?.querySelector('slot[name="open-button"]') as HTMLSlotElement;
    const closeSlot = this.shadowRoot?.querySelector('slot[name="close-button"]') as HTMLSlotElement;

    // Get ALL buttons from light DOM directly (they always exist)
    const allOpenButtons = Array.from(this.querySelectorAll('[slot="open-button"]')) as HTMLElement[];
    const allCloseButtons = Array.from(this.querySelectorAll('[slot="close-button"]')) as HTMLElement[];

    // Configure open buttons
    allOpenButtons.forEach(button => {
      button.setAttribute('aria-controls', content?.id || 'read-more-content');

      if (this.hasClampedText && this.showButton) {
        // Button is visible and active
        button.setAttribute('aria-expanded', 'false');
        button.removeAttribute('aria-hidden');
        button.removeAttribute('tabindex');
      } else {
        // Button is hidden
        button.setAttribute('aria-hidden', 'true');
        button.setAttribute('tabindex', '-1');
      }
    });

    // Configure close buttons
    allCloseButtons.forEach(button => {
      button.setAttribute('aria-controls', content?.id || 'read-more-content');

      if (!this.hasClampedText && this.showButton) {
        // Button is visible and active
        button.setAttribute('aria-expanded', 'true');
        button.removeAttribute('aria-hidden');
        button.removeAttribute('tabindex');
      } else {
        // Button is hidden
        button.setAttribute('aria-hidden', 'true');
        button.setAttribute('tabindex', '-1');
      }
    });
  }

  private async _checkOverflow() {
    const content = this.shadowRoot?.querySelector('.content') as HTMLElement | null;
    if (!content) {
      console.warn('toujou-read-more: .content not found');
      return;
    }

    // Temporarily remove clamping
    this.hasClampedText = false;
    await this.updateComplete;
    const fullHeight = content.scrollHeight;

    // Apply clamping again
    this.hasClampedText = true;
    await this.updateComplete;
    const clampedHeight = content.clientHeight;

    this.showButton = fullHeight > clampedHeight;
    this.hasClampedText = this.showButton;
  }

  private _toggleClamp() {
    this.hasClampedText = !this.hasClampedText;

    this.dispatchEvent(
      new CustomEvent('toujou-read-more-toggle', {
        detail: { isClamped: this.hasClampedText },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <div id="read-more-content" class="content" role="region" aria-label="Expandable content" part="content">
          <slot></slot>
      </div>

      ${this.showButton
      ? html`
          <div class="buttons" @click=${this._toggleClamp} part="buttons">
            ${this.hasClampedText
        ? html`<slot name="open-button"></slot>`
        : html`<slot name="close-button"></slot>`
      }
          </div>
        ` : ''
    }
    `;
  }
}

customElements.define(ToujouReadMore.is, ToujouReadMore);
