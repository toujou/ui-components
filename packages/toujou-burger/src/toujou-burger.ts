import { html, LitElement } from 'lit';

class ToujouBurger extends LitElement {

  static get is() {
    return 'toujou-burger';
  }

  static get properties() {
    return {
      listenTo: {
        type: String,
      },
      toggleElement: {
        type: String,
      },
    };
  }

  render() {
    return html`
      <slot id="content"></slot>
    `;
  }

  /**
   * Set status of the burger button and the element to toggle (ex: #mainNavigation)
   * according to the value
   * @param value
   * @private
   */
  set _status(value) {
    this.setAttribute('aria-pressed', value);
    this.setAttribute('aria-expanded', value);
    this._elementToToggle.setAttribute('aria-hidden', !value);
  }

  connectedCallback() {
    super.connectedCallback();

    this._elementToToggle = document.querySelector(this.toggleElement);
    this._stateInput = document.querySelector(this.listenTo);
    if (this._stateInput) {
      this._stateInput.addEventListener('change', this._handleStateChange.bind(this));
    }
  }

  /**
   * React to navigation state input change
   * and add corresponding aria attribute values
   *
   * @private
   */
  _handleStateChange(event: Event) {
    this._status = event.currentTarget.checked;

    this.dispatchEvent(new CustomEvent('toujou-burger-button-click', {
      bubbles: true,
      composed: true,
      detail: {
        state: event.currentTarget.checked,
      },
    }));
  }
}

customElements.define(ToujouBurger.is, ToujouBurger);
