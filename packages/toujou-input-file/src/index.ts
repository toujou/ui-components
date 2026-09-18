import { LitElement, html } from 'lit';

export class ToujouInputFile extends LitElement {

  private fileChosen: boolean;

  static get is() {
    return 'toujou-input-file';
  }

  static get properties() {
    return {
      fileChosen: {type: Boolean, attribute: false},
    };
  }

  constructor() {
    super();
    this.fileChosen = false;
  }

  render() {
    return html`
      <slot name="input" @change="${this.handleInputChange}"></slot>
      ${this.fileChosen ? html`<slot name="clear-chosen-file-button" @click="${this.handleButtonClick}"></slot>` : html``}
    `;
  }

  handleInputChange(event) {
    const fileInput = event.target as HTMLInputElement;

    this.fileChosen = fileInput?.files.length > 0;
  }

  handleButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const input = this.inputElement;
    if (!input) return;

    const emptyDataTransfer = new DataTransfer();
    input.files = emptyDataTransfer.files;

    this.fileChosen = input?.files.length > 0;
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

customElements.define(ToujouInputFile.is, ToujouInputFile);
