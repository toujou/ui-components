import { ToujouButtonVariant, ToujouButtonSize, ToujouButtonType } from './toujou-button-types';

export class ToujouButton extends HTMLButtonElement {
  defaultButtonVariant: string = ToujouButtonVariant.PRIMARY;
  defaultButtonType: string = ToujouButtonType.DEFAULT;
  defaultButtonSize: string = ToujouButtonSize.NORMAL;

  constructor() {
    super();
  }

  connectedCallback() {
    this._checkRequiredAttributes();
  }

  /**
   * Check if the element has the correct attribute.
   * If not, print a warning and add the default values to the attributes
   * @private
   */
  private _checkRequiredAttributes() {
    const variant = this.getAttribute('button-variant');
    if (!variant) {
      this.setAttribute('button-variant', this.defaultButtonVariant);
    } else if (!Object.values(ToujouButtonVariant).includes(variant as ToujouButtonVariant)) {
      console.warn(`TOUJOU: Invalid button-variant value, falling back to default: "${this.defaultButtonVariant}"`);
      this.setAttribute('button-variant', this.defaultButtonVariant);
    }

    const size = this.getAttribute('button-size');
    if (!size) {
      this.setAttribute('button-size', this.defaultButtonSize);
    } else if (!Object.values(ToujouButtonSize).includes(size as ToujouButtonSize)) {
      console.warn(`TOUJOU: Invalid button-size value, falling back to default: "${this.defaultButtonSize}"`);
      this.setAttribute('button-size', this.defaultButtonSize);
    }

    const type = this.getAttribute('button-type');
    if (!type) {
      this.setAttribute('button-type', this.defaultButtonType);
    } else if (!Object.values(ToujouButtonType).includes(type as ToujouButtonType)) {
      console.warn(`TOUJOU: Invalid button-type value, falling back to default: "${this.defaultButtonType}"`);
      this.setAttribute('button-type', this.defaultButtonType);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'toujou-button': ToujouButton
  }
}

customElements.define('toujou-button', ToujouButton, { extends: 'button' });
