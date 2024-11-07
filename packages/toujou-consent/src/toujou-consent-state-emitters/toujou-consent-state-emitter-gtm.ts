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

  public onStateChange() {
    this.state = this.store.getState();

    if (!window.gtag) {
      throw new Error('TOUJOU: Could not get the gtag library to set the ads consent state!');
    }

    this._updateGtmTrackingState();
    this._updateGtmAdsState();
  }

  protected _updateGtmTrackingState() {
    const trackingConsent = this.state.consents.tracking as ConsentSetting;
    const consentState = trackingConsent?.consentGiven === true ? 'granted' : 'denied';

    const trackingConsentObject: GtmTrackingInterface = {
      'analytics_storage': consentState,
    };

    this._sendGtagConsentUpdate(trackingConsentObject);
  }

  protected _updateGtmAdsState() {
    const adsConsent = this.state.consents.ads as ConsentSetting;
    const consentState = adsConsent?.consentGiven === true ? 'granted' : 'denied';

    const adsConsentObject: GtmAdsConsentObject = {
      'ad_storage': consentState,
      'ad_user_data': consentState,
      'ad_personalization': consentState
    };

    this._sendGtagConsentUpdate(adsConsentObject);
  }

  /**
   * Sends an update to the Google Tag Manager (GTM) consent settings using the `gtag` library.*
   */
  protected _sendGtagConsentUpdate(consentObj: GtmAdsConsentObject | GtmTrackingInterface) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.gtag('consent', 'update', consentObj);
  }
}

customElements.define(ToujouConsentStateEmitterGTM.is, ToujouConsentStateEmitterGTM);
