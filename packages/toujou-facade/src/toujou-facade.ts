import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export const TOUJOU_FACADE_ACTIVATE_EVENT = 'toujou-facade-activate';

/**
 * <toujou-facade>
 *
 * Generic facade component that displays lightweight placeholder content until activated by the user.
 *
 * When activated:
 * - the poster and trigger are hidden
 * - the content slot is revealed
 * - a `toujou-facade-activate` event is dispatched
 */
export class ToujouFacade extends LitElement {
  static get is() {
    return 'toujou-facade';
  }

  static styles = css`
    :host {
      display: var(--toujou-facade-display, block);
      position: var(--toujou-facade-position, relative);
    }

    ::slotted([slot='content']) {
      display: var(--toujou-facade-content-display, none) !important;
    }

    :host([activated]) ::slotted([slot='content']) {
      display: var(--toujou-facade-active-content-display, revert) !important;
    }

    :host([activated]) ::slotted([slot='poster']) {
      display: var(--toujou-facade-poster-display, none) !important;
    }

    ::slotted([slot='trigger']) {
      position: var(--toujou-facade-trigger-position, absolute);
      inset: var(--toujou-facade-trigger-inset, 0);
      cursor: var(--toujou-facade-trigger-cursor, pointer);
    }

    :host([activated]) ::slotted([slot='trigger']) {
      display: var(--toujou-facade-trigger-display, none) !important;
    }
  `;

  /**
   * Indicates whether the facade has been activated.
   */
  @property({ type: Boolean, reflect: true })
  activated = false;

  /**
   * Activates the facade and reveals the content.
   *
   * Dispatches a `toujou-facade-activate` event the first time
   * it is called.
   */
  public activate() {
    if (this.activated) {
      return;
    }

    this.activated = true;

    this.dispatchEvent(
      new CustomEvent(TOUJOU_FACADE_ACTIVATE_EVENT, {
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <slot name="poster"></slot>
      <slot name="trigger" @click=${this.activate}></slot>
      <slot name="content"></slot>
    `;
  }
}

customElements.define(ToujouFacade.is, ToujouFacade);

declare global {
  interface HTMLElementTagNameMap {
    'toujou-facade': ToujouFacade;
  }
}
