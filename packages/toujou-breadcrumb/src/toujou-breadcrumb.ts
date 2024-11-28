import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js';

import { debounce } from "./utils/debounce";
import styles from './css/toujou-breadcrumb.css';

@customElement('toujou-breadcrumb')
export class ToujouBreadcrumb extends LitElement {
  @property({ type: Number }) breakpoint: number = 0;
  @property({ type: Boolean, reflect: true }) isMobile = false;
  @property({ type: HTMLOListElement }) list: HTMLOListElement | null = null;
  @property({ type: Array }) listItems: HTMLLIElement[] | null = [];
  @property({ type: Array }) toggleButtons: HTMLButtonElement[] | null = [];
  @property({ type: Boolean, reflect: true }) mobileMenuIsOpen: Boolean = false;

  private _mql: MediaQueryList | undefined;

  private static DEBOUNCE_DELAY = 150;
  private static IS_MOBILE_BUFFER_PER_ITEM = 16;
  private static SELECTORS = {
    LIST: '.breadcrumb__list',
    ITEM: '.breadcrumb__item',
    TOGGLE: '.breadcrumb__toggle',
    FAKE_LIST: '.breadcrumb__fake-list'
  }

  private static EVENT_NAMES = {
    MODE_CHANGE: 'toujou-breadcrumb-mode-change',
    CONNECTED: 'toujou-breadcrumb-connected',
    MENU_OPEN: 'toujou-breadcrumb-menu-open',
    MENU_CLOSE: 'toujou-breadcrumb-menu-close',
  }

  static get styles() {
    return styles;
  }

  render() {
    return html`
      <slot name="toggle-buttons" @click="${this._handleToggleClick}"></slot>
      <slot name="list"></slot>
      <div class="breadcrumb__fake-list" part="fake-list">
        ${this.listItems
          ? repeat(
            this.listItems.slice(0, this.listItems.length - 1),
            (item, index) => index, // Unique key based on index
            (item) => html`${item.cloneNode(true)}`
          )
          : null}
      </div>
    `
  }

  constructor() {
    super();

    this._handleToggleClick = this._handleToggleClick.bind(this);
  }

  firstUpdated() {
    this._initListAndItems();
    this._calculateBreakpoint();

    this.toggleButtons = Array.from(this.querySelectorAll(ToujouBreadcrumb.SELECTORS.TOGGLE));

    if (this.breakpoint > 0) {
      this._initMediaQueryListener()

      this.isMobile = this._mql.matches;
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.dispatchEvent(new CustomEvent(ToujouBreadcrumb.EVENT_NAMES.CONNECTED, {
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Initializes the list and listItems properties by querying the DOM.
   */
  private _initListAndItems() {
    this.list = this.querySelector(ToujouBreadcrumb.SELECTORS.LIST);
    this.listItems = Array.from(this.querySelectorAll(ToujouBreadcrumb.SELECTORS.ITEM));
  }

  /**
   * Sets up the media query listener to track the screen size and update the component state accordingly.
   */
  private _initMediaQueryListener() {
    if (this._mql) return;

    this._mql = window.matchMedia(`(max-width: ${this.breakpoint}px)`);
    this._mql.addEventListener('change', debounce(this._onMediaQueryChange.bind(this), ToujouBreadcrumb.DEBOUNCE_DELAY));
  }

  /**
   * Handles changes in the media query state when the screen size crosses the breakpoint.
   */
  private _onMediaQueryChange(event: MediaQueryListEvent) {
    this.isMobile = event.matches;
    if (!event.matches) this.mobileMenuIsOpen = false;

    this.dispatchEvent(new CustomEvent(ToujouBreadcrumb.EVENT_NAMES.MODE_CHANGE, {
      bubbles: true,
      composed: true,
      detail: {
        isMobile: this.isMobile,
        breakpoint: this.breakpoint,
      }
    }));
  }

  /**
   * Calculate the breakpoint at which the breadcrumb should switch
   * between desktop and mobile views.
   */
  private _calculateBreakpoint() {
    if (!this.listItems.length) return;

    let itemsWidth = 0;
    this.listItems?.forEach((item) => {
      itemsWidth += item.getBoundingClientRect().width;
      itemsWidth += parseInt(window.getComputedStyle(item)['margin-right']);
      itemsWidth += ToujouBreadcrumb.IS_MOBILE_BUFFER_PER_ITEM;
    });

    this.breakpoint = Math.ceil(itemsWidth);
  }

  /**
   * Toggle the state whenever a button is clicked
   */
  private _handleToggleClick() {
    this.mobileMenuIsOpen = !this.mobileMenuIsOpen;

    const eventName = this.mobileMenuIsOpen
      ? ToujouBreadcrumb.EVENT_NAMES.MENU_OPEN
      : ToujouBreadcrumb.EVENT_NAMES.MENU_CLOSE;

    this.dispatchEvent(new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
    }));
  }
}


declare global {
  interface HTMLElementTagNameMap {
    'toujou-breadcrumb': ToujouBreadcrumb
  }
}
