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

    // Ensure last element in content slot has no margin-bottom
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
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('maxLines')) {
      this.style.setProperty('--toujou-read-more-max-lines', this.maxLines.toString());
      requestAnimationFrame(() => this._checkOverflow());
    }
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
            <div class="content" part="content">
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
                `
      : ''
    }
        `;
  }
}

customElements.define(ToujouReadMore.is, ToujouReadMore);
