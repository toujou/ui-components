import Cookies from 'js-cookie';
import { consentsStore } from '../toujou-consent-widget/consentsStore';

class ToujouTrackingMatomo extends HTMLElement {
  get url() {
    return this.getAttribute('url').replace(/^\/\//, `${window.location.protocol}//`);
  }

  get siteid() {
    return this.getAttribute('siteid');
  }

  constructor(props) {
    super(props);

    this.hidden = true;
    this.style.display = 'contents';

    this.onStateChange = this.onStateChange.bind(this);

    this.store = consentsStore;
    this.store.subscribe(this.onStateChange);
    this.consentState = this.store.getState().consents.tracking;
  }

  /**
   * This function fires when the component is appended to the document.
   */
  connectedCallback() {
    this._handleConsentState(this.consentState);
    this._storeUnsubscribe = this.store.subscribe(this.onStateChange);
  }

  disconnectedCallback() {
    if (this._storeUnsubscribe) {
      this._storeUnsubscribe();
    }
  }

  /**
   * This function runs each time the store changes
   */
  onStateChange() {
    this.consentState = this.store.getState().consents.tracking || null;
    this._handleConsentState(this.consentState);
  }

  /**
   * Handle Google Analytics (check if cookies need to be added or removed)
   */
  _handleConsentState(consentState) {
    if (typeof consentState === 'object'
      && consentState !== null
      && consentState.consentGiven
    ) {
      this._instantiateMatomo(consentState);
    } else {
      this._disableMatomoTracking();
    }
  }

  /**
   * Call the function to start the Google Tracking
   */
  _instantiateMatomo(consentState) {
    if (this.matomoIsInstantiated) {
      return;
    }

    const matomoUrl = new URL(this.url);
    const trackerUrl = new URL(matomoUrl);
    trackerUrl.pathname = '/matomo.php';
    const scriptSrc = new URL(matomoUrl);
    scriptSrc.pathname = '/matomo.js';

    window._paq = window._paq || [];
    const { _paq } = window;
    _paq.push(['requireConsent']);
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    _paq.push(['setTrackerUrl', trackerUrl.toString()]);
    _paq.push(['setSiteId', this.siteid]);

    if (consentState.consentLifetime === 0) { // session
      _paq.push(['setConsentGiven']);
    } else {
      _paq.push(['rememberConsentGiven', consentState.consentLifetime / 1000 / 60 / 60]); // in hours
    }

    if (!this._matomo) {
      this._matomo = this._addMatomoScriptTag(scriptSrc);
    }

    this.matomoIsInstantiated = true;
    this._dispatchMatomoLoadedEvent();
  }

  _addMatomoScriptTag(scriptSrc) {
    const scriptTag = document.createElement('script');
    const firstScriptTag = document.getElementsByTagName('script')[0];
    scriptTag.async = true;
    scriptTag.src = scriptSrc.toString();
    firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
    return true;
  }

  _disableMatomoTracking() {
    if (this.matomoIsInstantiated) {
      window._paq = window._paq || [];
      const { _paq } = window;
      _paq.push(['forgetConsentGiven']);
    }

    Object.keys(Cookies.get()).forEach((cookieName) => {
      if (cookieName.match(/^pk.*$/)) {
        Cookies.remove(cookieName, { path: '/', domain: window.location.hostname });
      }
    });
    this.matomoIsInstantiated = false;
  }

  /**
   * Dispatch a custom event when the gtag is loaded
   */
  _dispatchMatomoLoadedEvent() {
    const matomoLoadedEvent = new CustomEvent('toujou-matomo-loaded', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(matomoLoadedEvent);
  }
}

customElements.define('toujou-tracking-matomo', ToujouTrackingMatomo);
