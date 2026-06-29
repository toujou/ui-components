import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './css/toujou-facade.css';

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

  static get styles() {
    return styles;
  }

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
