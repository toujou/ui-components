import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './css/toujou-rating-stars.css';

/* eslint-disable indent */

@customElement('toujou-rating-stars')
export class ToujouRatingStars extends LitElement {
  static styles = [styles];

  @property({ type: Array })
  entities: string[] = [];

  @property({ type: String, attribute: 'rating-entity' })
  ratingEntity = '★';

  @property({ type: Number, attribute: 'rating-total' })
  ratingTotal = 5;

  @property({ type: Number, attribute: 'rating-value' })
  ratingValue = 0;

  @property({ type: String, attribute: 'rating-suffix' })
  ratingSuffix = '';

  @property({ type: Number })
  percentage = 0;

  private readonly percentageCssVariable = '--rating-stars-percentage';

  render() {
    return html`
      <span class="entities" part="entities">
        ${this.entities.map((entity: string) => {
          return html`
            <span class="entity" part="entity">${entity}</span>
          `;
        })}
        <span class="overlay" part="overlay"></span>
      </span>
      ${this.ratingSuffix ? html`
        <span class="suffix" part="suffix">${this.ratingSuffix}</span>
      ` : ''}
    `;
  }

  /**
   * Update the percentage when the relevant attributes change
   * @param changed
   */
  updated(changed: PropertyValues<this>) {
    if (changed.has('ratingTotal')) {
      this.entities = Array(this.ratingTotal).fill(this.ratingEntity);
      this.updatePercentage();
    }
    if (changed.has('ratingValue')) {
      this.entities = Array(this.ratingTotal).fill(this.ratingEntity);
      this.updatePercentage();
    }
  }

  /**
   * Calculate the "rest percentage" depending on the ratingValue and ratingTotal values.
   * Set the correct value to the --rating-stars-percentage variable
   */
  updatePercentage = () => {
    this.percentage = (this.ratingValue / this.ratingTotal) * 100;
    this.style.setProperty(this.percentageCssVariable, `${100 - this.percentage}%`);
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'toujou-rating-stars': ToujouRatingStars
  }
}
