import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('toujou-burger-button')
export class ToujouBurgerButton extends LitElement {
  @property({ type: Boolean })
  private _state = false;

  private readonly stateChangeEventName = 'toujou-burger-button-state-change';
  private readonly topbarMqlChangeEventName = 'toujou-topbar-breakpoint-change';
  private readonly mainNavCloseEventName = 'toujou-main-nav-close';

  private readonly _boundHandleMqlChange: EventListener = this._handleMqlChange.bind(this);

  get state() {
    return this._state;
  }

  set state(value: boolean) {
    this._state = value;
    this.setAttribute('aria-pressed', String(value));
    this.setAttribute('aria-expanded', String(value));
  }

  render() {
    return html`
      <slot name="content"></slot>`;
  }

  connectedCallback() {
    super.connectedCallback();

    this.setAttribute('aria-pressed', String(this._state));
    this.setAttribute('aria-expanded', String(this._state));

    this.addEventListener('click', this._handleClickEvent);
    this.addEventListener('keyup', this._handleKeyUp);

    window.addEventListener(this.topbarMqlChangeEventName, this._boundHandleMqlChange);
    window.addEventListener(this.mainNavCloseEventName, this._handleMainNavCloseEvent);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('click', this._handleClickEvent);
    this.removeEventListener('keyup', this._handleKeyUp);

    window.removeEventListener(this.topbarMqlChangeEventName, this._boundHandleMqlChange);
    window.removeEventListener(this.mainNavCloseEventName, this._handleMainNavCloseEvent);
  }

  private _handleClickEvent = () => {
    this._toggleState();
  };

  private _handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      this._toggleState();
    }
  };

  private _handleMainNavCloseEvent = () => {
    if (this._state) {
      this._toggleState();
    }
  };

  private _toggleState = () => {
    this.state = !this._state;

    this.dispatchEvent(new CustomEvent(this.stateChangeEventName, {
      bubbles: true,
      composed: true,
      detail: { state: this.state }
    }));
  };

  private _handleMqlChange(event: Event) {
    if (!(<CustomEvent>event).detail.state) {
      this.state = false;
    }
  }
}
