import { html, css, LitElement, PropertyValues } from 'lit';
import { property,queryAssignedElements } from 'lit/decorators.js';

/**
 * `<toujou-facade>`
 *
 * Generic "facade" pattern: shows lightweight placeholder content
 * (poster + trigger) until the user interacts, then reveals the
 * real (potentially expensive) content.
 *
 * Slots:
 *  - poster   – placeholder visual (e.g. an <img>)
 *  - trigger  – the element that activates the facade (e.g. a <button>)
 *  - content  – the real content (e.g. a YouTube/Vimeo <iframe>)
 *
 * Usage:
 * <toujou-facade>
 *   <img slot="poster" src="poster.jpg" alt="" />
 *   <button slot="trigger">Play</button>
 *   <iframe slot="content" src="https://www.youtube.com/embed/..." ...></iframe>
 * </toujou-facade>
 */
class ToujouFacade extends LitElement {
  static get is() {
    return 'toujou-facade';
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    ::slotted([slot='content']) {
      display: none;
    }

    :host([activated]) ::slotted([slot='poster']),
    :host([activated]) ::slotted([slot='trigger']) {
      display: none !important;
    }

    :host([activated]) ::slotted([slot='content']) {
      display: revert;
    }

    ::slotted([slot='trigger']) {
      position: absolute;
      inset: 0;
      cursor: pointer;
    }
  `;

  /**
   * Reflects whether the facade has been activated (real content shown).
   * Reflected as an attribute so it can be targeted in CSS / read in the DOM
   */
  @property({ type: Boolean, reflect: true })
  activated = false;

  /**
   * Optional. Tells the facade how to "start" the content on activation.
   * Supported out of the box: 'youtube', 'vimeo', 'video'.
   * Leave unset for non-video facades (map, social embed, etc.) —
   * activation will just reveal the content slot with no extra behavior.
   */
  @property({ type: String, attribute: 'content-type' })
  contentType?: 'youtube' | 'vimeo' | 'video';

  @queryAssignedElements({ slot: 'content' })
  private _contentEls!: HTMLElement[];

  private async _activate() {
    if (this.activated) return;
    this.activated = true;

    await this.updateComplete;

    this._startContent();
    this.dispatchEvent(
      new CustomEvent('toujou-facade-activate', {
        bubbles: true,
        composed: true,
        detail: { el: this },
      }),
    );
  }

  private _findEl<T extends HTMLElement>(root: HTMLElement, tag: string): T | null {
    return (root.tagName === tag.toUpperCase() ? root : root.querySelector(tag)) as T | null;
  }

  private _startContent() {
    const el = this._contentEls[0];
    if (!el) return;

    switch (this.contentType) {
      case 'video': {
        const video = this._findEl<HTMLVideoElement>(el, 'video');
        video?.play?.();
        break;
      }
      case 'youtube':
      case 'vimeo': {
        const iframe = this._findEl<HTMLIFrameElement>(el, 'iframe');
        if (!iframe?.src) break;

        // Ensure autoplay is permitted on the iframe itself
        const allow = iframe.getAttribute('allow') ?? '';
        if (!allow.includes('autoplay')) {
          iframe.setAttribute('allow', `${allow} autoplay`.trim());
        }

        const url = new URL(iframe.src);
        url.searchParams.set('autoplay', '1');
        url.searchParams.set('mute', '1'); // muted autoplay is reliably allowed
        iframe.src = '';
        iframe.src = url.toString();
        break;
      }
      default:
        break;
    }
  }

  render() {
    return html`
      <slot name="poster"></slot>
      <slot name="trigger" @click=${this._activate}></slot>
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
