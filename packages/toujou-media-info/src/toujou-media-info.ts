import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './css/toujou-media-info.css';

@customElement('toujou-media-info')
export class ToujouMediaInfo extends LitElement {
  @property({ type: Boolean, reflect: true, attribute: 'open' })
    isOpen = false;

  private readonly isOpenParentAttribute = 'media-info-child-is-open';

  static styles = [styles];

  render() {
    return html`
            <slot name="open-button" class="open-button"  @click="${this.handleToggleClick}"></slot>
            <slot name="close-button" class="close-button" @click="${this.handleToggleClick}"></slot>
            <slot name="figcaption"></slot>
            <slot name="copyright"></slot>
        `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._handleClick);
  }

  updated(changed: PropertyValues<this>) {
    if (changed.has('isOpen')) {
      this.isOpen
        ? this.parentElement?.setAttribute(this.isOpenParentAttribute, '')
        : this.parentElement?.removeAttribute(this.isOpenParentAttribute);
    }
  }

  /**
   * Handle click on whole element to prevent click on element behind when open
   */
  _handleClick = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  handleToggleClick = (): void => {
    this.isOpen = !this.isOpen;
  };
}

