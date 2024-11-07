import { LitElement } from 'lit';
import { consentsStore } from '../toujou-consent-widget/consentsStore';
import { Store } from 'redux';
import { ConsentSetting } from '../utils/ConsentSetting';
import { consentTypeNames } from '../utils/consentTypeNames';

/**
 * Base class for creating custom web components that handle consent state changes.
 * This class sets up a subscription to a consent store, observes state changes,
 * and provides an interface for derived classes to customize consent management.
 */
export abstract class ToujouConsentStateEmitterBase extends LitElement {

  /** List of consent type names available for managing various consent categories */
  public consentTypeNames = consentTypeNames;

  /** Redux store managing consent state across components */
  public store: Store;

  /** Current state of the consents */
  public _state: {
    consents: {
      ads: ConsentSetting;
      tracking: ConsentSetting;
      video: ConsentSetting;
      maps: ConsentSetting;
      html: ConsentSetting;
      consentBoxDismissed: boolean;
    };
  };

  static get is() {
    return 'toujou-consent-state-emitter-base';
  }

  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  constructor() {
    super();

    this.onStateChange = this.onStateChange.bind(this);

    // Initialize the store and set up the subscription to listen to state changes
    this.store = consentsStore;
    this.store.subscribe(this.onStateChange);

    // Retrieve the initial consent state from the store
    this._state = this.store.getState();
  }

  /**
   * Placeholder function for handling state changes in the consent store.
   * This function is meant to be overridden by derived classes that will implement
   * specific logic for managing consent updates.
   */
  protected onStateChange() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  }
}
