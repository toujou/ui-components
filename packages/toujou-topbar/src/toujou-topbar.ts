import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('toujou-topbar')
export class ToujouTopbar extends LitElement {
  private readonly burgerButtonStateChangeEvent = 'toujou-burger-button-state-change';
  private readonly mqlChangeEventName = 'toujou-topbar-breakpoint-change';
  private readonly openNavBodyAttribute = 'nav-is-open';

  @property({ type: Boolean, reflect: true, attribute: 'open-nav' })
    _isOpen = false;

  @property({ type: Boolean })
    _isMobile = false;

  public _mql: MediaQueryList;
  public _breakpoint = '840px';
  private _handleBurgerButtonClickBound = this._handleBurgerButtonClick.bind(this);
  private _handleMqlChangeBound = this._handleMqlChange.bind(this);

  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();

    this._setMediaQuery();

    this._isMobile = this._mql.matches;

    window.addEventListener(this.burgerButtonStateChangeEvent, this._handleBurgerButtonClickBound);
    this._mql.addEventListener('change', this._handleMqlChangeBound);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener(this.burgerButtonStateChangeEvent, this._handleBurgerButtonClickBound);
    this._mql.removeEventListener('change', this._handleMqlChangeBound);
  }

  _setMediaQuery = () => {
    const computedStyle = getComputedStyle(this);
    const customBreakpoint = computedStyle.getPropertyValue('--toujou-topbar-breakpoint');

    if (customBreakpoint) {
      this._breakpoint = customBreakpoint;
    }

    this._mql = window.matchMedia(`(width < ${this._breakpoint})`);
  };

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
