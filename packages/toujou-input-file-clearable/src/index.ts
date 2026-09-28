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

    /**
     * File input only visually gets reset by using input.value = ''
     * The file will still be included on submitting the form
     * The following 2 lines instead set the files property of the input to an empty FileList
     * Source: https://dev.to/code_rabbi/programmatically-setting-file-inputs-in-javascript-2p7i
     */
    const emptyDataTransfer = new DataTransfer();
    input.files = emptyDataTransfer.files;

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
