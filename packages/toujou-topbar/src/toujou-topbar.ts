import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('toujou-topbar')
export class ToujouTopbar extends LitElement {
  private readonly burgerButtonStateChangeEvent = 'toujou-burger-button-state-change';
  private readonly mqlChangeEventName = 'toujou-topbar-breakpoint-change';
  private readonly openNavBodyAttribute = 'nav-is-open';

  @property({ type: Boolean, reflect: true, attribute: 'open-nav' })
    _isOpen = false;

  @property({ type: MediaQueryList })
    _mql: MediaQueryList = window.matchMedia('(max-width: 839px)');

  @property({ type: Boolean, })
    _isMobile = this._mql.matches;

  private _handleBurgerButtonClickBound = this._handleBurgerButtonClick.bind(this);
  private _handleMqlChangeBound = this._handleMqlChange.bind(this);

  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();

    window.addEventListener(this.burgerButtonStateChangeEvent, this._handleBurgerButtonClickBound);
    this._mql.addEventListener('change', this._handleMqlChangeBound);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener(this.burgerButtonStateChangeEvent, this._handleBurgerButtonClickBound);
    this._mql.removeEventListener('change', this._handleMqlChangeBound);
  }

  _handleBurgerButtonClick(event: CustomEvent<{ state: boolean }>) {
    this._isOpen = event.detail.state;
    this._isOpen
      ? document.body.setAttribute(this.openNavBodyAttribute, '')
      : document.body.removeAttribute(this.openNavBodyAttribute);
  }

  _handleMqlChange(event: MediaQueryListEvent) {
    this._isMobile = event.matches;
    this.dispatchEvent(new CustomEvent(this.mqlChangeEventName, {
      bubbles: true,
      composed: true,
      detail: { state: this._isMobile }
    }));

    if (!this._isMobile) {
      this._isOpen = false;
    }
  }
}
