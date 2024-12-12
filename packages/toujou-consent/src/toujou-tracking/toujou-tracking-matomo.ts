import { cookieStore } from 'cookie-store';
import { consentsStore } from '../toujou-consent-widget/consentsStore';
import { Store, Unsubscribe } from 'redux';
import { ConsentSetting } from '../utils/ConsentSetting';

declare global {
  interface Window {
    _paq?: object[];
  }
}

window._paq = window._paq || [];

class ToujouTrackingMatomo extends HTMLElement {

  public store: Store;

  public consentState: ConsentSetting;

  public matomoIsInstantiated: boolean;

  private _matomo: boolean;
  private _storeUnsubscribe: Unsubscribe;


  get url() {
    return this.getAttribute('url').replace(/^\/\//, `${window.location.protocol}//`);
  }

  get siteid() {
    return this.getAttribute('siteid');
  }

  constructor() {
    super();
    this.hidden = true;
    this.style.display = 'contents';

    this.onStateChange = this.onStateChange.bind(this);
    this.store = consentsStore;
  }

  /**
   * This function fires when the component is appended to the document.
   */
  connectedCallback() {
    this._instantiateMatomo();
    this._storeUnsubscribe = this.store.subscribe(this.onStateChange);
    this.onStateChange();
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
    const changedConsentState = this.store.getState().consents.tracking || null;
    if (JSON.stringify(changedConsentState) !== JSON.stringify(this.consentState)) {
      this.consentState = changedConsentState;
      this._handleConsentState(this.consentState);
    }
  }

  /**
   * Handle Matomo (check if cookies need to be added or removed)
   */
  private _handleConsentState(consentState) {
    const { _paq } = window;

    if (typeof consentState === 'object'
      && consentState !== null
      && consentState.consentGiven
    ) {
      this._enableAnonymizedTracking(consentState, _paq);
    } else {
      this._disableAnonymizedTracking(_paq);
    }
  }

  private _enableAnonymizedTracking(consentState, _paq: object[]) {
    _paq.push(['setCookieConsentGiven']);
  }

  private _disableAnonymizedTracking(_paq: object[]) {
    _paq.push(['forgetCookieConsentGiven']);
    cookieStore.getAll().then(
      (cookies) => cookies.forEach((cookie) => {
        if (cookie.name.match(/^_pk_.*$/) || cookie.name.match(/^_mtm_.*$/) || cookie.name.match(/^MATOMO.*$/)) {
          cookieStore.delete(cookie.name);
        }
      })
    );
  }

  /**
   * Call the function to start the Matomo Tracking
   */
  private _instantiateMatomo() {
    if (this.matomoIsInstantiated) {
      return;
    }

    const matomoUrl = new URL(this.url);
    const trackerUrl = new URL(matomoUrl);
    trackerUrl.pathname = '/matomo.php';
    const scriptSrc = new URL(matomoUrl);
    scriptSrc.pathname = '/matomo.js';

    const { _paq } = window;
    _paq.push(['requireCookieConsent']);
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    _paq.push(['setTrackerUrl', trackerUrl.toString()]);
    _paq.push(['setSiteId', this.siteid]);

    if (!this._matomo) {
      this._matomo = this._addMatomoScriptTag(scriptSrc);
    }

    this.matomoIsInstantiated = true;
    this._dispatchMatomoLoadedEvent();
  }

  private _addMatomoScriptTag(scriptSrc) {
    const scriptTag = document.createElement('script');
    const firstScriptTag = document.getElementsByTagName('script')[0];
    scriptTag.async = true;
    scriptTag.src = scriptSrc.toString();
    firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
    return true;
  }

  /**
   * Dispatch a custom event when the gtag is loaded
   */
  private _dispatchMatomoLoadedEvent() {
    const matomoLoadedEvent = new CustomEvent('toujou-matomo-loaded', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(matomoLoadedEvent);
  }
}

customElements.define('toujou-tracking-matomo', ToujouTrackingMatomo);
