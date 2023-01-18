class ToujouLocationFinderTeaser extends HTMLElement {
  connectedCallback() {
    this.addEventListener('mouseenter', this._onMouseEnter);
    this.addEventListener('mouseleave', this._onMouseLeave);
  }

  disconnectedCallback() {
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
