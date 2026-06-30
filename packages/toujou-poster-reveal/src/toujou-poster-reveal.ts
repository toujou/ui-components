import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './css/toujou-poster-reveal.css';

export const TOUJOU_POSTER_REVEAL_ACTIVATE_EVENT = 'toujou-poster-reveal-activate';

/**
 * <toujou-poster-reveal>
 *
 * Generic "poster" component that displays lightweight placeholder content until activated by the user.
 *
 * When activated:
 * - the poster and trigger are hidden
 * - the content slot is revealed
 * - a `toujou-poster-reveal-activate` event is dispatched
 */
export class ToujouPosterReveal extends LitElement {
  static get is() {
    return 'toujou-poster-reveal';
  }

  static get styles() {
    return styles;
  }

  /**
   * Indicates whether the element has been activated.
   */
  @property({ type: Boolean, reflect: true })
    activated = false;

  /**
   * Activates the element and reveals the content.
   *
   * Dispatches a `toujou-poster-reveal-activate` event the first time
   * it is called.
   */
  public activate() {
    if (this.activated) {
      return;
    }

    this.activated = true;

    this.dispatchEvent(
      new CustomEvent(TOUJOU_POSTER_REVEAL_ACTIVATE_EVENT, {
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      ${!this.activated
    ? html`
          <slot name="poster"></slot>
          <slot name="trigger" @click=${this.activate}></slot>
        `
    : html`
          <slot name="content"></slot>
    `
}
    `;
  }
}

customElements.define(ToujouPosterReveal.is, ToujouPosterReveal);

declare global {
  interface HTMLElementTagNameMap {
    'toujou-poster-reveal': ToujouPosterReveal;
  }
}
