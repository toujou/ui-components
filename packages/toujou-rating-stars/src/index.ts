import { LitElement, html } from 'lit';

export class ToujouRatingStars extends LitElement {
  static get is() {
    return 'toujou-rating-stars';
  }

  render() {
    return html`Hello World`;
  }
}

customElements.define(ToujouRatingStars.is, ToujouRatingStars);
