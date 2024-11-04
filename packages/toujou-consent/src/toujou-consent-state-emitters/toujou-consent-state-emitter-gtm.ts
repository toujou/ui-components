import { ToujouConsentStateEmitterBase } from './toujou-consent-state-emitter-base';
import { ConsentSetting } from '../utils/ConsentSetting';

type GtmOptionValue = 'granted' | 'denied';

interface GtmAdsConsentObject {
  ad_storage: GtmOptionValue;
  ad_user_data: GtmOptionValue;
  ad_personalization: GtmOptionValue;
}

interface GtmTrackingInterface {
  analytics_storage: GtmOptionValue;
}

/**
 * Custom web component for managing and emitting consent state to Google Tag Manager (GTM).
 * Extends the `ToujouConsentStateEmitterBase` class to observe consent state changes and
 * relay those changes to GTM for ads and tracking purposes.
 */
class ToujouConsentStateEmitterGTM extends ToujouConsentStateEmitterBase {

  static get is() {
    return 'toujou-consent-state-emitter-gtm';
  }

  constructor() {
    super();
  }

  /**
   * Handles updates to the consent store state.
   * This function is triggered each time the consent store changes.
   * If the `gtag` library is available, it updates both GTM tracking and ads consent states accordingly.
   */
  protected onStateChange() {
    this._state = this.store.getState();

    if (!window.gtag) {
      console.warn('TOUJOU: Could not get the gtag library to set the ads consent state!');
      return;
    }

    this._updateGtmTrackingState();
    this._updateGtmAdsState();
  }

  /**
   * Updates the GTM tracking consent state based on the current consent settings
   */
  protected _updateGtmTrackingState() {
    const trackingConsent = this._state.consents.tracking as ConsentSetting;
    const consentState = trackingConsent?.consentGiven === true ? 'granted' : 'denied';

    const trackingConsentObject: GtmTrackingInterface = {
      'analytics_storage': consentState,
    };

    this._updateConsent(trackingConsentObject);
  }

  /**
   * Updates the GTM ads consent state based on the current consent settings for ads
   */
  protected _updateGtmAdsState() {
    const adsConsent = this._state.consents.ads as ConsentSetting;
    const consentState = adsConsent?.consentGiven === true ? 'granted' : 'denied';

    const adsConsentObject: GtmAdsConsentObject = {
      'ad_storage': consentState,
      'ad_user_data': consentState,
      'ad_personalization': consentState
    };

    this._updateConsent(adsConsentObject);
  }

  /**
   * Sends an update to the Google Tag Manager (GTM) consent settings using the `gtag` library.*
   */
  protected _updateConsent(consentObj: GtmAdsConsentObject | GtmTrackingInterface) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.gtag('consent', 'update', consentObj);
  }
}

customElements.define(ToujouConsentStateEmitterGTM.is, ToujouConsentStateEmitterGTM);
