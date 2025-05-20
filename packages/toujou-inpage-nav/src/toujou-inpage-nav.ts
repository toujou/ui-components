import { LitElement, html } from 'lit';
import styles from './css/toujou-inpage-nav.css';
import { customElement, property } from 'lit/decorators.js';
import getNavBreakpoint from './utils/toujou-inpage-nav-breakpoint';
import { observeStickyElement } from './utils/observe-sticky-element';

export interface navItemsItemInterface {
  item: HTMLElement,
  link: string,
  target: HTMLElement,
}

export interface navItemsInterface {
  [key: string]: navItemsItemInterface
}

export enum INPAGE_NAV_EVENTS {
  CONNECTED = 'toujou-inpage-nav-connected',
  DISCONNECTED = 'toujou-inpage-nav-disconnected',
  STUCK_STATE_CHANGE = 'toujou-inpage-nav-stuck-state-change',
}

@customElement('toujou-inpage-nav')
export class ToujouInpageNav extends LitElement {

  @property({ type: Boolean, reflect: true }) isMobile = false;
  @property({ type: Boolean, reflect: true }) mobileOpen = false;
  @property({ type: Boolean, reflect: true, attribute: 'is-stuck' }) isStuck = false;
  @property({ type: Map }) _targetSections: Map<HTMLElement, boolean> | undefined = new Map();

  private _navItems: navItemsInterface;
  private _previousCurrentSectionID: string | null;
  private readonly mobileBreakpointOffset: number;
  private readonly _isCentered: boolean;
  private _isAuto: boolean;
  private readonly _rootMarginsSize: number;
  private _toggle: HTMLElement;
  private _navLabel: HTMLElement | null;
  private _cta: HTMLElement;
  private _navBreakpoint: number;
  private observer: IntersectionObserver;
  private intersectionObserverNumberOfSteps = 50;
  private stickyObserverCleanup: (() => void) | null = null;

  set _currentSectionID(value: string) {
    if (!this._navItems) return;

    if (!value) {
      this._updateLabelVisibility(false);
      this._updateNavItemsState(null);
    } else if (this._previousCurrentSectionID !== value) {
      this._updateLabelVisibility(!!value);
      this._updateNavItemsState(value);
    }
  }

  static styles = [styles];

  render() {
    return html`
      <slot></slot>
      <slot name="cta" id="cta"></slot>
    `;
  }

  constructor() {
    super();

    this.mobileBreakpointOffset = this._getMobileBreakpointOffset(); // in pixels
    this._currentSectionID = null;
    this._isCentered = this.hasAttribute('centered');
    this._isAuto = this.hasAttribute('is-auto');
    this._targetSections = new Map();
    this._rootMarginsSize = -200;

    setTimeout(() => {
      this._init();
    });
  }

  connectedCallback() {
    super.connectedCallback();

    this.updateComplete.then(() => {
      this._setupStickyStateObserver();
    });

    this.dispatchEvent(new CustomEvent(INPAGE_NAV_EVENTS.CONNECTED, {
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Remove event listeners when the element disconnect from page
   */
  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('resize', this._checkIsMobileState.bind(this));
    this._toggle.removeEventListener('click', this._mobileOpenToggle.bind(this));
    this.addEventListener('click', this._handleNavClick.bind(this));

    // Clean up sticky observer when component is removed
    if (this.stickyObserverCleanup) {
      this.stickyObserverCleanup();
      this.stickyObserverCleanup = null;
    }

    // Clean up the intersection observer
    if (this.observer) {
      this.observer.disconnect();
    }

    this.dispatchEvent(new CustomEvent(INPAGE_NAV_EVENTS.DISCONNECTED, {
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Watch for attribute changes, so we can update the aria attribute values
   *
   * @param name
   * @param _old
   * @param value
   * @returns void
   */
  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'ismobile' || name === 'mobileopen') {
      this._updateAriaAttributes(name);
    }
  }

  /**
   * Setup the sticky state observer for this element
   *
   * @private
   */
  _setupStickyStateObserver() {
    console.log('SETTING UP////');
    // Clean up previous observer if it exists
    if (this.stickyObserverCleanup) {
      this.stickyObserverCleanup();
    }

    // Only observe if the element should have sticky behavior
    if (this.hasAttribute('is-sticky')) {
      // Setup new observer with options
      this.stickyObserverCleanup = observeStickyElement(
        this,
        (isStuck: boolean) => {
          this.isStuck = isStuck;

          // Dispatch an event when sticky state changes
          this.dispatchEvent(new CustomEvent(INPAGE_NAV_EVENTS.STUCK_STATE_CHANGE, {
            detail: { isStuck },
            bubbles: true,
            composed: true
          }));
        },
        {
          threshold: 0.1, // Lower threshold for earlier detection
          triggerImmediately: true,
          rootMargin: '-1px 0px 0px 0px' // Slight offset to prevent flickering
        }
      );
    }
  }

  /**
   * Initialize the inpage navigation component
   *    - Get child elements
   *    - add intersection observers
   *    - set event listeners
   *
   * @private
   */
  _init() {
    this._getChildrenElements();
    if (!this._navItems) {
      console.error('Could not initialize the inpage-nav. Error: No nav items!!!');
      return;
    }

    this._toggle = this.querySelector('.inpage-nav__toggle');
    this._checkIsMobileState();
    this._addTargetObservers();

    window.addEventListener('resize', this._checkIsMobileState.bind(this));
    this._toggle.addEventListener('click', this._mobileOpenToggle.bind(this));
    this.addEventListener('click', this._handleNavClick.bind(this));
  }

  /**
   * Get nav items information: item, item link and item link target
   *
   * @private
   */
  _getChildrenElements() {
    this._navItems = {};
    this._navLabel = this.querySelector('.inpage-nav__label') || null;
    this._cta = this.querySelector('[slot="cta"]');
    const allNavItems = this.querySelectorAll('.inpage-nav__item') || null;

    allNavItems.forEach((navItem: HTMLElement, i: number) => {
      const navItemLink = navItem.querySelector('a');
      const navItemLinkHref = navItemLink.getAttribute('href');
      this._navItems[i] = {
        item: navItem as HTMLElement,
        link: navItemLinkHref as string,
        target: document.querySelector(navItemLinkHref) as HTMLElement,
      };
    });
  }

  /**
   * Check if there is enough place to show the navigation items side by side
   * so we can toggle the isMobile attribute accordingly
   *
   * @private
   */
  _checkIsMobileState() {
    this.isMobile = false;
    window.requestAnimationFrame(() => {
      this._navBreakpoint = getNavBreakpoint(this._navItems, this._navLabel, this._cta, this._isCentered);
      this.isMobile = this._navBreakpoint > (this.offsetWidth - this.mobileBreakpointOffset);
    });
  }

  /**
   * Create an intersection observer for the target section of each navigation item
   * If the target itself doesn't have an id we observe the next sibling
   *
   * @private
   */
  _addTargetObservers() {
    const options = {
      rootMargin: `${this._rootMarginsSize}px 0px ${this._rootMarginsSize}px 0px`,
      threshold: this._createThresholdList(this.intersectionObserverNumberOfSteps),
    };

    this.observer = new IntersectionObserver(this._handleObserver.bind(this), options);

    Object.keys(this._navItems).forEach((navItem: string) => {
      const targetElement: HTMLElement = this._navItems[navItem].target;

      if (!(targetElement instanceof HTMLElement)) {
        return;
      }

      this._targetSections.set(targetElement, false);

      const elementToObserve: Element = targetElement.hasAttribute('id')
        ? targetElement
        : targetElement.nextElementSibling;

      this.observer.observe(elementToObserve);
    });
  }

  /**
   * Generate a threshold list for the observer based on a number of steps
   *
   * @param numberOfSteps
   * @returns {[number]}
   * @private
   */
  _createThresholdList(numberOfSteps: number): number[] {
    return [...Array(numberOfSteps).keys()].map((x) => x / numberOfSteps);
  }

  /**
   * Handle intersection observers change
   * Add / remove attribute when target sections came or leave view
   *
   * @param entries
   * @private
   */
  _handleObserver(entries: any[]) {
    entries.forEach((entry) => {
      this._targetSections.set(entry.target, entry.isIntersecting);
    });

    this._updateSectionsAttributes();
    this._updateActiveItemUI();
  }

  /**
   * Update the attribute on the section according to their visibility
   *
   * @private
   */
  _updateSectionsAttributes() {
    let firstOneIsVisible = false;

    this._targetSections.forEach((isVisible: boolean, element: HTMLElement) => {
      element.toggleAttribute('inpageNavTargetVisible', firstOneIsVisible ? false : (isVisible));
      if (isVisible && !firstOneIsVisible) {
        firstOneIsVisible = isVisible;
      }
    });
  }

  /**
   * Update the navbar items to highlight the currently active item
   * (corresponding to the visible section)
   *
   * @private
   */
  _updateActiveItemUI() {
    const firstVisibleSection = document.querySelector('*[inpageNavTargetVisible]') || null;

    if (firstVisibleSection) {
      this._currentSectionID = `#${firstVisibleSection.id.toString()}`;
    } else if (!firstVisibleSection && this._navLabel) {
      this._currentSectionID = null;
    } else if (!firstVisibleSection && !this._navLabel) {
      this._currentSectionID = this._navItems[0].link;
    }
  }

  /**
   * Toggle the mobileOpen attribute
   *
   * @private
   */
  _mobileOpenToggle() {
    this.mobileOpen = !this.mobileOpen;
  }

  /**
   * handle navigation item click
   *    - close nav
   *    - smooth scroll to target
   *
   * @param event
   * @private
   */
  _handleNavClick(event) {
    const clickedElement = event.target;
    if (clickedElement.classList.contains('inpage-nav__link')) {
      this.mobileOpen = false;
    }
  }

  /**
   * Update aria attributes when the relevant property changes
   *
   * @param propertyName
   * @private
   */
  _updateAriaAttributes(propertyName: string) {
    if (propertyName === 'mobileopen') {
      this._toggle.setAttribute('aria-expanded', String(this.mobileOpen));
    } else if (propertyName === 'ismobile') {
      this._toggle.setAttribute('aria-hidden', String(!this.isMobile));
    }
  }

  /**
   * Update the label visibility status
   *
   * @param value
   * @private
   */
  _updateLabelVisibility(labelIsVisible: boolean) {
    if (this._navLabel) {
      if (!labelIsVisible) {
        this._navLabel.setAttribute('visible', '');
      } else {
        this._navLabel.removeAttribute('visible');
      }
    }
  }

  /**
   * Update currently active nav item
   *
   * @param value
   * @private
   */
  _updateNavItemsState(value: string) {
    const currentActiveItem = this.querySelector('.inpage-nav__item[active]');

    if (currentActiveItem) {
      currentActiveItem.removeAttribute('active');
      currentActiveItem.removeAttribute('aria-current');
    }

    Object.keys(this._navItems).forEach((navItem) => {
      if (this._navItems[navItem].link === value) {
        this._navItems[navItem].item.setAttribute('active', '');
        this._navItems[navItem].item.setAttribute('aria-current', 'true');
      }
    });

    this._previousCurrentSectionID = value;
  }

  /**
   * Get inpagenav breakpoint offset from the corresponding CSS Variable
   *
   * @returns {number}
   * @private
   */
  _getMobileBreakpointOffset() {
    const cStyles = getComputedStyle(document.documentElement);
    return parseInt(cStyles.getPropertyValue('--toujou-inpage-nav-breakpoint-offset') || '180', 10);
  }

}
