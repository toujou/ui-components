import { LitElement, html} from 'lit';

export class ToujouInputPasswordToggle extends LitElement {

  private passwordVisible: boolean;

  static get is() {
    return 'toujou-input-password-toggle';
  }

  static get properties() {
    return {
      passwordVisible: {type: Boolean, attribute: false},
    };
  }

  constructor() {
    super();
    this.passwordVisible = false;
  }

  render() {
    return html`
      <slot name="input"></slot>
      ${this.passwordVisible
    ? html`<slot name="hide-password-button" @click="${this.handleToggleClick}"></slot>`
    : html`<slot name="show-password-button" @click="${this.handleToggleClick}"></slot>`
}
    `;
  }

  handleToggleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const input = this.inputElement;

    const currentType = input?.getAttribute('type');
    const targetType = (currentType === 'password' ? 'text' : 'password');
    input?.setAttribute('type', targetType);
    this.passwordVisible = targetType === 'text';
  }

  get inputElement(): HTMLInputElement | null {
    const slot = this.shadowRoot?.querySelector('slot');

    if (null === slot) {
      return null;
    }

    const firstNode = slot?.assignedNodes({flatten: true})
      .find(node => (node as HTMLElement).tagName === 'INPUT');

    return firstNode as HTMLInputElement ?? null;
  }
}

customElements.define(ToujouInputPasswordToggle.is, ToujouInputPasswordToggle);
