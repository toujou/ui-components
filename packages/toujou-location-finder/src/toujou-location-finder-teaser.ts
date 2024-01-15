import { LitElement, html } from 'lit';
import { locationFinderStore } from './store/locationFinderStore';
import { Store } from 'redux';

class ToujouLocationFinderTeaser extends LitElement {
  isHighlightedAttribute = 'is-highlighted';

  teaserLinkSelector = '.teaser';

  _featureUid: string;

  _teaserLinkEl: HTMLElement;

  store: Store<{
    features: {
      isLoading: boolean;
      highlightedFeature: string|undefined
    }
  }>;

  _state: { features: { isLoading: boolean; highlightedFeature: string|undefined } };

  constructor() {
    super();

    this.onStateChange = this.onStateChange.bind(this);

    this._featureUid = this.getAttribute('feature-uid');
    this._teaserLinkEl = this.querySelector(this.teaserLinkSelector);

    this.store = locationFinderStore;
    this.store.subscribe(this.onStateChange);
    this._state = this.store.getState();
  }

  render() {
    return html`<slot id="slot"></slot>`;
  }

  /**
   * Toggle highlighted attribute depending on the feature ui matching the store's feature id
   * @param value
   * @private
   */
  set _highlightedFeature(value) {
    if (value == this._featureUid) {
      this._teaserLinkEl.setAttribute(this.isHighlightedAttribute, '');
    } else {
      this._teaserLinkEl.removeAttribute(this.isHighlightedAttribute);
    }
  }

  onStateChange() {
    this._state = this.store.getState();
    this._highlightedFeature = this._state.features.highlightedFeature;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('mouseenter', this._onMouseEnter);
    this.addEventListener('mouseleave', this._onMouseLeave);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('mouseenter', this._onMouseEnter);
    this.removeEventListener('mouseleave', this._onMouseLeave);
  }

  _onMouseEnter() {
    this.dispatchEvent(new CustomEvent('toujou-location-finder-teaser-mouse-enter', {
      composed: true,
      detail: {
        featureUid: this.getAttribute('feature-uid'),
      },
    }));
  }

  _onMouseLeave() {
    this.dispatchEvent(new CustomEvent('toujou-location-finder-teaser-mouse-leave', {
      composed: true,
    }));
  }
}

customElements.define('toujou-location-finder-teaser', ToujouLocationFinderTeaser);
