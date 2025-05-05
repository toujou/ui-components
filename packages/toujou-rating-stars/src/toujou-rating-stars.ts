import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('toujou-rating-stars')
export class ToujouRatingStars extends LitElement {
  @property({ type: Number, attribute: 'rating-value' }) rating = 0;
  @property({ type: Number, attribute: 'rating-total' }) total = 5;
  @property({ type: String, attribute: 'rating-suffix' }) suffix = '';

  createRenderRoot() {
    return this;
  }

  protected render() {
    const stars = [];

    for (let i = 0; i < this.total; i++) {
      let value = 0;
      if (this.rating >= i + 1) {
        value = 100;
      } else if (this.rating > i) {
        value = Math.round((this.rating - i) * 100);
      }

      stars.push(html`
        <span class="rating-stars__star" aria-hidden="true" star-value="${value}"></span>
      `);
    }

    return html`
      ${stars}
      ${this.suffix.length ? html`<span class="rating-stars__suffix" aria-hidden="true">${this.suffix}</span>` : '' }
    `;
  }
}
