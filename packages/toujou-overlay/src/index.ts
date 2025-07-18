import { LitElement, html, PropertyValues } from 'lit';
import { FocusReturnMixin } from "./utils/focus-return-mixin";
import { checkOverlayCookie, setOverlayCookie } from './utils/cookie';
import { uncommentTemplate } from './utils/template';

import styles from './css/toujou-overlay.css';

export class ToujouOverlay extends FocusReturnMixin(LitElement) {
  opened = false;

  protected delay = 0;

  static styles = [styles];

  static get is() {
    return 'toujou-overlay';
  }

  static get properties() {
    return {
      opened: {
        type: Boolean,
        reflect: true,
      },
      delay: {
        type: Number,
        reflect: true,
      }
    };
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    if (location.hash === '#aaa') {
      setOverlayCookie(this.id, 'accepted');
      return;
    }

    const opened = checkOverlayCookie(this.id) !== 'accepted';

    if (this.delay > 0) {
      setTimeout(()=> {
        this.opened = opened;
      }, this.delay);
    } else {
      this.opened = opened;
    }
  }

  protected updated(changedProperties: PropertyValues) {
    if (changedProperties.has('opened') && changedProperties.get('opened') !== undefined) {
      this.opened ? this.showOverlay() : this.hideOverlay();
      this.setAttribute('aria-hidden', this.opened ? 'false' : 'true');
    }

    super.updated(changedProperties);
  }

  render() {
    return html`<slot id="templatedContent"></slot>`;
  }

  private showOverlay() {
    this.captureFocus();

    const slot = this.shadowRoot.querySelector('#templatedContent') as HTMLSlotElement;
    const templates = slot
      .assignedNodes({ flatten: true })
      .filter((el) => (el as HTMLTemplateElement).tagName === 'TEMPLATE') as HTMLTemplateElement[];

    templates.forEach((template) => {
      const uncommentedTemplateContent = uncommentTemplate(template);
      this.innerHTML += uncommentedTemplateContent;
    });

    this.overlayButtons.forEach((overlayButton) => {
      overlayButton.addEventListener('click', (e: MouseEvent) => this.handleOverlayButtonClick(e));
    });

    this.overlayCloseButtons.forEach(overlayCloseButton => {
      overlayCloseButton.addEventListener('click', () => this.handleCloseButtonClick());
    });

    document.body.classList.add('toujou-overlay-open');

    const focusable = this.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length > 0) {
      (focusable[0] as HTMLElement).focus();
    }

    document.dispatchEvent(new CustomEvent('toujou-overlay-show', {detail:  {overlay: this.id}, bubbles: true}));
  }

  hideOverlay() {
    document.body.classList.remove('toujou-overlay-open');
    document.dispatchEvent(new CustomEvent('toujou-overlay-hide', {detail: {overlay: this.id}, bubbles: true}));

    Array.from(this.children).forEach((element) => {
      if (element.tagName !== 'TEMPLATE') {
        element.remove();
      }
    });

    this.restoreFocus();
  }

  showWarning() {
    if (this.overlayWarning) {
      this.overlayWarning.style.display = 'block';
    }
    if (this.overlayButtonsContainer) {
      this.overlayButtonsContainer.style.display = 'none';
    }
  }

  private handleOverlayButtonClick(e: MouseEvent) {
    const choice = (e.target as HTMLElement).getAttribute('data-overlay-value');

    document.dispatchEvent(new CustomEvent('toujou-overlay-button-click', {detail: {overlay: this.id, choice: choice}, bubbles: true}));
    if (choice === 'no') {
      setOverlayCookie(this.id,'rejected');
      this.showWarning();
    } else if (choice === 'yes') {
      setOverlayCookie(this.id, 'accepted');
      this.opened = false;
    }
  }

  private handleCloseButtonClick() {
    document.dispatchEvent(new CustomEvent('toujou-overlay-button-close-click', {detail: {overlay: this.id}, bubbles: true}));

    setOverlayCookie(this.id, 'accepted');
    this.opened = false;
  }

  private get overlayButtonsContainer(): HTMLElement|null {
    return this.querySelector('.overlay__buttons');
  }

  private get overlayButtons(): NodeListOf<HTMLElement> {
    return this.querySelectorAll('.overlay__button');
  }

  private get overlayCloseButtons(): NodeListOf<HTMLElement> {
    return this.querySelectorAll('.overlay-button-close-trigger');
  }

  private get overlayWarning(): HTMLElement|null {
    return this.querySelector('.overlay__warning');
  }
}

customElements.define(ToujouOverlay.is, ToujouOverlay);
