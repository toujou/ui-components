import { LitElement, html } from 'lit';
import {property, state} from 'lit/decorators.js';
import {Store, Unsubscribe} from 'redux';

import styles from './toujou-third-party-content.css';
import { store } from '../toujou-consent-widget/store';
import { saveSingleConsent } from '../toujou-consent-widget/store/actions';
import { ConsentSetting } from '../utils/ConsentSetting';

export class ToujouThirdPartyContent extends LitElement {

  @property()
    contentType: string;

  public templateFragment: [string, string];

  @property()
  set store(store: Store | null) {
    if (this._storeUnsubscribe) {
      this._storeUnsubscribe();
      this._storeUnsubscribe = this._store = null;
      this.consent = null;
    }
    if (store) {
      this._storeUnsubscribe = store.subscribe(this.onStateChange);
      this._store = store;
      this.onStateChange();
    }
  }

  get store(): Store | null { return this._store; }

  private _store: Store = null;
  private _storeUnsubscribe: Unsubscribe = null;

  @property({ type: Boolean })
  public isIntersecting = false;

  @state()
  public contentTypeAllowed = false;

  @state()
  public show = false;

  @state()
  public consent: ConsentSetting = null;

  static get is() {
    return 'toujou-third-party-content';
  }

  static get styles() {
    return styles;
  }

  render() {
    return html`
      <slot id="templatedContent" @slotchange="${this._handleSlotChange}"></slot>
      <div @click="${this._handlePlaceholderClick}">
        <slot name="placeholder" id="placeholderContainer" class="placeholder-slot"></slot>
      </div>
    `;
  }

  constructor() {
    super();
    this.onStateChange = this.onStateChange.bind(this);
    this._handleConsentButtonClick = this._handleConsentButtonClick.bind(this);
  }

  /**
   * This function fires when the component is appended to the document.
   */
  connectedCallback() {
    super.connectedCallback();
    if (!this.store) {
      this.store = store;
    }
    this._isContentTypeAllowed(this.consent);
    this._addEventListeners();
    this._addIntersectionObserver();
  }

  /**
   * This function runs each time a property is updated.
   * We have to check of the element is intersecting with the viewport,
   * so we load when only if visible
   */
  updated(_changedProperties) {
    if (_changedProperties.has('isIntersecting') && this.isIntersecting && !this.show) {
      this.show = true;
    }
    if ((_changedProperties.has('contentTypeAllowed') || _changedProperties.has('show')) && this.contentTypeAllowed && this.show) {
      this._showContent();
    }
  }

  /**
   * This function runs each time the store changes
   */
  onStateChange() {
    console.log(this._store.getState());
    this.consent = this._store.getState()?.consents?.[this.contentType] ?? false;
    this._isContentTypeAllowed(this.consent);
  }

  /**
   * Add event listeners to the element.
   * Check if the cookies have been updated
   */
  _addEventListeners() {
    window.addEventListener('toujou-consent-widget-dismissed', () => {
      this._isContentTypeAllowed(this.consent);
    });
    window.addEventListener('toujou-consent-button-clicked', this._handleConsentButtonClick);
  }

  /**
   * If the 'always allow' button is clicked, we should set the consent for that content type
   * and show a snackbar confirming it.
   */
  _handleConsentButtonClick(event) {
    const dispatcherConsent = event.target;
    const childConsents = this.querySelectorAll('.consent');
    childConsents.forEach((childConsent) => {
      if (childConsent === dispatcherConsent) {
        this._saveSingleConsent(event.target.getAttribute('consenttype'), this._createNewConsentData(event.target));
        this._dispatchAddSnackbar(event.target.getAttribute('snackbarmessage'));
      }
    });
  }

  /**
   * Create the new consent data for a consentType
   * It returns an object ready to be dispatched to the store
   */
  // eslint-disable-next-line class-methods-use-this
  _createNewConsentData(consentElement) {
    const elementLifetimeValue = consentElement.getAttribute('consentLifetime');
    const consentLifetime = elementLifetimeValue * 24 * 60 * 60 * 1000;

    return {
      consentGiven: true,
      consentCreationDate: Date.now(),
      consentExpirationDate: Date.now() + consentLifetime,
      consentLifetime,
    };
  }

  /**
   * Call store action to update values of one single consent type
   */
  _saveSingleConsent(consentType, consentData) {
    this.store.dispatch(saveSingleConsent(consentType, consentData));
  }

  /**
   * Dispatch event to add a snackbar
   */
  _dispatchAddSnackbar(snackbarMessage) {
    const addSnackbarEvent = new CustomEvent('toujou-add-snackbar', {
      bubbles: true,
      composed: true,
      detail: {
        message: snackbarMessage,
        type: 'auto',
        duration: 2500,
        variant: 'success',
      },
    });
    this.dispatchEvent(addSnackbarEvent);
  }

  /**
   * Handle click on a button in the placeholder slot
   */
  _handlePlaceholderClick(event) {
    if (event.target.hasAttribute('ttpc-showcontentonce')) {
      this._handleShowContentOnceClick();
    }
  }

  /**
   * There is a button to show the content once without setting any consent 'cookies'
   * A click on this button should just show the content
   */
  _handleShowContentOnceClick() {
    this._showContent();
  }

  /**
   * Add an Intersection Observer to check if the element is visible
   */
  _addIntersectionObserver() {
    // eslint-disable-next-line no-shadow
    const observer = new IntersectionObserver((entry, observer) => {
      this.isIntersecting = entry[0].isIntersecting;
      if (this.isIntersecting) {
        observer.unobserve(this);
      }
    });
    observer.observe(this);
  }

  /**
   * Clear the #renderedContent slot.
   * This is used before we rerender the template,
   * so are are sure we always have the most recent template content
   */
  _clearRenderedContent() {
    this.querySelector('.toujou-third-party-content__templated-content').innerHTML = '';
  }

  /**
   * This function run each time a change in the #templatedContent slot is detected
   */
  _handleSlotChange() {
    // TODO rerender
  }

  /**
   * Check if the content type is allowed
   * (if cookie exists and is true)
   */
  _isContentTypeAllowed(consent: ConsentSetting | null) {
    if (consent === null) {
      this.contentTypeAllowed = false;
    } else {
      this.contentTypeAllowed = consent.consentGiven || false;
    }
    if (window.location.hash === '#aaa') {
      this.contentTypeAllowed = true;
    }
  }

  /**
   * Check if the template content is commented out
   */
  // eslint-disable-next-line class-methods-use-this
  _isCommentedTemplate(template) {
    const templateString = template.innerHTML.trim();
    return templateString.startsWith('<!--') && templateString.endsWith('-->');
  }

  /**
   * Remove the comment marks from the template content
   */
  _uncommentTemplate(template: HTMLTemplateElement) {
    const templateString = template.innerHTML.trim();
    return templateString.substring(4, templateString.length - 3).trim();
  }

  /**
   * Show the external content
   */
  _showContent() {
    this._clearRenderedContent();

    const slot = this.shadowRoot
      .querySelector('#templatedContent') as HTMLSlotElement;

    const templates = slot
      .assignedNodes({ flatten: true })
      .filter((el) => (el as HTMLTemplateElement).tagName === 'TEMPLATE') as HTMLTemplateElement[];

    const targetNode = this.querySelector('.toujou-third-party-content__templated-content');

    templates.forEach((template) => {
      if (!this._isCommentedTemplate(template)) {
        targetNode.appendChild(document.importNode(template.content, true));
      } else {
        const uncommentedTemplateContent = this._uncommentTemplate(template);
        const range = document.createRange();
        range.selectNode(targetNode);
        targetNode.innerHTML = uncommentedTemplateContent;
        this.templateFragment = [uncommentedTemplateContent, targetNode.innerHTML ];
        const templateFragment = range.createContextualFragment(uncommentedTemplateContent);
        range.insertNode(templateFragment);
      }
    });

    this.setAttribute('showingcontent', '');
  }
}

customElements.define(ToujouThirdPartyContent.is, ToujouThirdPartyContent);
