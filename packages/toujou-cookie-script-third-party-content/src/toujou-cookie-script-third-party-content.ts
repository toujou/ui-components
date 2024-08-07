import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

declare global {
  interface Window {
    CookieScript: any;
  }
}

@customElement('toujou-cookie-script-third-party-content')
export class ToujouCookieScriptThirdPartyContent extends LitElement {
  // Constants
  COOKIE_NAME = 'CookieScriptConsent';
  CATEGORY_NAME = 'functionality';
  FUNCTIONALITY_STATE_CHANGE_EVENT_NAME = 'CookieScriptCategory-functionality';
  TEMPLATED_CONTENT_SELECTOR = '.toujou-cookie-script-third-party-content__templated-content';

  @property({ type: String })
    contentType: undefined | string = undefined;

  render() {
    return html`
      <slot id="templatedContent" @slotchange="${this._onSlotChange}"></slot>
      <div @click="${this._handlePlaceholderClick}">
        <slot name="placeholder" id="placeholderContainer" class="placeholder-slot"></slot>
      </div>
    `;
  }

  _onSlotChange = () => {
    this._checkIfShouldShow();
  };

  connectedCallback() {
    super.connectedCallback();

    /* Check if we should show the content whenever the cookie-script change event is fired */
    window.addEventListener(this.FUNCTIONALITY_STATE_CHANGE_EVENT_NAME, this._checkIfShouldShow);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener(this.FUNCTIONALITY_STATE_CHANGE_EVENT_NAME, this._checkIfShouldShow);
  }

  _handlePlaceholderClick = () => {
    if (!window.CookieScript.instance.show) {
      console.error('Toujou: Could not get the CookieScript instance');
      return;
    }

    window.CookieScript.instance.show();
  };

  _checkIfShouldShow = () => {
    const cookieValue = this._getCookieValue();

    if (cookieValue && cookieValue.categories && cookieValue.categories.includes(this.CATEGORY_NAME)) {
      this._showContent();
    }
  };

  _getCookieValue = () => {
    let cookieValue = null;
    const cookies = `; ${document.cookie}`;
    if (!cookies) return cookieValue;

    const parts = cookies.split(`; ${this.COOKIE_NAME}=`);
    if (parts.length === 2) {
      cookieValue = parts.pop().split(';').shift();
      const parsedCookieValue = JSON.parse(cookieValue);

      return (!parsedCookieValue || !parsedCookieValue.categories)
        ? null
        : parsedCookieValue;
    }
  };

  /**
   * Check if the template content is commented out
   */
  // eslint-disable-next-line class-methods-use-this
  _isCommentedTemplate(templateHTML) {
    return templateHTML.startsWith('<!--') && templateHTML.endsWith('-->');
  }

  /**
   * Copy attributes and content from old script (from the template) to the readyScript ("clone")
   */
  // eslint-disable-next-line class-methods-use-this
  _copyScriptAttributesAndContent(oldScript, readyScript) {
    for (let i = 0; i < oldScript.attributes.length; i++) {
      const attr = oldScript.attributes[i];
      readyScript.setAttribute(attr.name, attr.value);
    }
    // eslint-disable-next-line no-param-reassign
    readyScript.innerHTML = oldScript.innerHTML;
    return readyScript;
  }

  /**
   * Append all elements (other that <script>) to the page
   */
  _appendNonScriptTag(templateTag) {
    this.querySelector(this.TEMPLATED_CONTENT_SELECTOR).appendChild(templateTag);
  }

  /**
   * Append script element to the page
   * We need to make sure external scripts are completely loaded
   * before we can proceed to the next element
   */
  _appendScriptTag(templateTag: any) {
    const newScript = document.createElement('script');
    const readyScript = this._copyScriptAttributesAndContent(templateTag, newScript);

    this.querySelector(this.TEMPLATED_CONTENT_SELECTOR).appendChild(readyScript);

    if (!readyScript.hasAttribute('src') || readyScript.hasAttribute('async') || readyScript.hasAttribute('defer')) {
      return new Promise<void>((resolve) => {
        resolve();
      });
    }

    return new Promise((resolve) => {
      readyScript.addEventListener('load', resolve);
    });
  }

  /**
   * Append elements inside the templated content in an asynchronous way,
   * so we can ensure the order in which the scripts are added and executed
   */
  async _appendTags(templateTags: string | any[]) {
    for (let i = 0; i < templateTags.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        if (templateTags[i].tagName !== 'SCRIPT') {
          resolve(this._appendNonScriptTag(templateTags[i]));
        } else {
          resolve(this._appendScriptTag(templateTags[i]));
        }
      });
    }
  }

  /**
   * Separate the uncommentedTemplateContent into an array of html elements (by Tag)
   */
  // eslint-disable-next-line class-methods-use-this
  _getTemplateTags(uncommentedTemplateContent) {
    const templateTags = [];
    const dummyDiv = document.createElement('div');
    dummyDiv.innerHTML = uncommentedTemplateContent;

    // eslint-disable-next-line no-restricted-syntax
    for (const key in dummyDiv.childNodes) {
      // eslint-disable-next-line max-len
      if (dummyDiv.childNodes[key].nodeType !== 3 && dummyDiv.childNodes[key].parentElement === dummyDiv) {
        templateTags.push(dummyDiv.childNodes[key]);
      }
    }

    return templateTags;
  }

  /**
   * Clear the #renderedContent slot.
   * This is used before we rerender the template,
   * so we are sure we always have the most recent template content
   */
  _clearRenderedContent() {
    this.querySelector(this.TEMPLATED_CONTENT_SELECTOR).innerHTML = '';
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

    templates.forEach((template) => {
      if (this.contentType === 'html') {
        const uncommentedTemplateContent = this._uncommentTemplate(template);
        const templateTags = this._getTemplateTags(uncommentedTemplateContent);
        this._appendTags(templateTags);
      } else {
        const clone = document.importNode(template.content, true);
        this.querySelector(this.TEMPLATED_CONTENT_SELECTOR).appendChild(clone);
      }
    });

    this.setAttribute('showingcontent', '');
  }

  /**
   * Remove the comment marks from the template content
   */
  _uncommentTemplate(template) {
    return this._isCommentedTemplate(template.innerHTML)
      ? template.innerHTML.substr(4, template.innerHTML.length - 7)
      : null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'toujou-cookie-script-third-party-content': ToujouCookieScriptThirdPartyContent
  }
}
