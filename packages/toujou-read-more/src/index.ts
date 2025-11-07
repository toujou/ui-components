import { LitElement, html, css } from 'lit';

/**
 * Expandable text component with "read more / read less" functionality.
 *
 * @element toujou-read-more
 * @fires toujou-read-more-toggle - Fired when the clamped state toggles.
 * @fires toujou-read-more-ready - Fired when the component has finished its initial setup and overflow check.
 * @csspart content - Wrapper around the clamped content.
 * @csspart buttons - Container for the toggle buttons.
 * @cssprop --toujou-read-more-max-lines - Overrides the max-lines property for clamping via CSS.
 * @cssprop --spacing-normal - Used for margin above the toggle buttons.
 */
export class ToujouReadMore extends LitElement {
  /** Number of lines to show before truncating */
  maxLines = 3;

  /** Whether text is currently clamped */
  hasClampedText = true;

  /** Whether the toggle button should be visible */
  showButton = false;

  static get is() {
    return 'toujou-read-more';
  }

  static properties = {
    /** Max number of visible lines before truncating */
    maxLines: { type: Number, attribute: 'max-lines' },
    /** Whether the content is currently clamped */
    hasClampedText: { type: Boolean, reflect: true, attribute: 'has-clamped-text' },
    /** Internal: controls button visibility */
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
          // Remove margin from all children to prevent spacing issues
          nodes.forEach((n: { style: { marginBottom: string; }; }) => (n instanceof HTMLElement ? n.style.marginBottom = '' : null));
          const last = nodes[nodes.length - 1] as HTMLElement;
          if (last) last.style.marginBottom = '0';
        }
      });
    }

    this._setupSlotListeners();
    this._setupButtonAccessibility();

    this.dispatchEvent(
      new CustomEvent('toujou-read-more-ready', {
        bubbles: true,
        composed: true,
      }),
    );
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

  /**
   * Sets up listeners on the open and close button slots.
   * Re-runs accessibility checks if the slotted content (the buttons themselves) changes.
   * @private
   */
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

  /**
   * Manages ARIA attributes (aria-controls, aria-expanded, aria-hidden, tabindex)
   * on the slotted "read more" and "read less" buttons to ensure correct accessibility
   * based on the component's clamped state.
   * @private
   */
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
        // If clamped and button should show: make button active and accessible, reflecting collapsed state.
        button.setAttribute('aria-expanded', 'false');
        button.removeAttribute('aria-hidden');
        button.removeAttribute('tabindex');
      } else {
        // Button is logically hidden: prevent focus and screen reader detection.
        button.setAttribute('aria-hidden', 'true');
        button.setAttribute('tabindex', '-1');
      }
    });

    // Configure close buttons
    allCloseButtons.forEach(button => {
      button.setAttribute('aria-controls', content?.id || 'read-more-content');

      if (!this.hasClampedText && this.showButton) {
        // If expanded and button should show: make button active and accessible, reflecting expanded state.
        button.setAttribute('aria-expanded', 'true');
        button.removeAttribute('aria-hidden');
        button.removeAttribute('tabindex');
      } else {
        // Button is logically hidden: prevent focus and screen reader detection.
        button.setAttribute('aria-hidden', 'true');
        button.setAttribute('tabindex', '-1');
      }
    });
  }

  /**
   * Determines if content is overflowing its container, which controls button visibility.
   * This is done by temporarily removing clamping to measure full height,
   * then comparing it to the clamped height.
   * @private
   */
  private async _checkOverflow() {
    const content = this.shadowRoot?.querySelector('.content') as HTMLElement | null;
    if (!content) {
      console.warn('toujou-read-more: .content not found');
      return;
    }

    // Temporarily remove clamping to get the full, natural height of the content.
    this.hasClampedText = false;
    await this.updateComplete;
    const fullHeight = content.scrollHeight;

    // Apply clamping again to get the clamped height for comparison.
    this.hasClampedText = true;
    await this.updateComplete;
    const clampedHeight = content.clientHeight;

    // Check if the content's full height exceeds the clamped height.
    this.showButton = fullHeight > clampedHeight;

    // If a button is shown, the content *must* start clamped.
    this.hasClampedText = this.showButton;
  }

  /**
   * Toggles the clamped state of the component and dispatches the 'toujou-read-more-toggle' event.
   * @private
   */
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
