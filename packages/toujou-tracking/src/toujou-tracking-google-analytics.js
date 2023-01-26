import Cookies from 'js-cookie';
import { consentsStore } from '@toujou/consent-widget/consentsStore';

class ToujouTrackingGoogleAnalytics extends HTMLElement {
  get analyticsid() {
    return this.getAttribute('analyticsid');
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
      this._instantiateGoogleAnalytics(consentState);
    } else {
      this._removeGoogleAnalyticsCookies();
    }
  }

  /**
   * Call the function to start the Google Tracking
   */
  _instantiateGoogleAnalytics(consentState) {
    if (this.gaIsInstantiated) {
      return;
    }
    const analyticsID = this.analyticsid;

    window[`ga-disable-${analyticsID}`] = false;

    const gaConfig = {
      cookie_expires: consentState.consentExpirationDate,
      anonymize_ip: true,
    };

    // eslint-disable-next-line no-undef
    window.dataLayer = window.dataLayer || [];
    // eslint-disable-next-line prefer-rest-params,no-undef
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;

    if (!this._ga) {
      this._ga = this._addAnalyticsScriptTag(analyticsID);
      gtag('js', new Date());
    }

    gtag('config', analyticsID, gaConfig);

    this.gaIsInstantiated = true;
    this._dispatchGtagLoadedEvent();
  }

  /**
   * Add Google Analytics Script
   */
  // eslint-disable-next-line class-methods-use-this
  _addAnalyticsScriptTag(analyticsID) {
    const analyticsUrl = `https://www.googletagmanager.com/gtag/js?id=${analyticsID}`;
    const scriptTag = document.createElement('script');
    const firstScriptTag = document.getElementsByTagName('script')[0];
    scriptTag.async = true;
    scriptTag.src = analyticsUrl;
    firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
    return true;
  }

  /**
   * Remove Google Analytics Cookies
   */
  _removeGoogleAnalyticsCookies() {
    ['_ga', '_gid', '_gat'].forEach((gaCookie) => {
      Cookies.remove(gaCookie, { path: '/', domain: window.location.hostname });
    });
    window[`ga-disable-${this.analyticsid}`] = true;
    this.gaIsInstantiated = false;
  }

  /**
   * Dispatch a custom event when the gtag is loaded
   */
  _dispatchGtagLoadedEvent() {
    const gtagLoadedEvent = new CustomEvent('toujou-gtag-loaded', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(gtagLoadedEvent);
  }
}

customElements.define('toujou-tracking-google-analytics', ToujouTrackingGoogleAnalytics);
