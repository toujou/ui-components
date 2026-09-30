import {LitElement, html, nothing} from 'lit';

export class ToujouInputFileClearable extends LitElement {

  private hasFile: boolean;

  static get is() {
    return 'toujou-input-file-clearable';
  }

  static get properties() {
    return {
      hasFile: {type: Boolean, attribute: false},
    };
  }

  constructor() {
    super();
    this.hasFile = false;
  }

  render() {
    return html`
      <slot name="input" @change="${this.handleInputChange}"></slot>
      ${this.hasFile ? html`
        <slot name="clear-button" @click="${this.handleButtonClick}"></slot>` : nothing}
    `;
  }

  handleInputChange(event) {
    const fileInput = event.target as HTMLInputElement;

    this.hasFile = fileInput?.files.length > 0;
  }

  handleButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const input = this.fileInputElement;
    if (!input) return;

    input.value = '';

    this.hasFile = false;

    input.focus();
  }

  get fileInputElement(): HTMLInputElement | null {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="input"]');

    if (null === slot) {
      return null;
    }

    const firstNode = slot?.assignedNodes({flatten: true})
      .find(node => (node as HTMLElement).tagName === 'INPUT' && (node as HTMLInputElement).files !== null);

    return firstNode as HTMLInputElement ?? null;
  }
}

customElements.define(ToujouInputFileClearable.is, ToujouInputFileClearable);
