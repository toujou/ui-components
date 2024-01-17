import { LitElement, html, PropertyValues } from 'lit';
import { checkOverlayCookie, setOverlayCookie } from './utils/cookie';
import { uncommentTemplate } from './utils/template';

import styles from './css/toujou-overlay.css';

export class ToujouOverlay extends LitElement {

  protected opened = false;

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
    };
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    if (location.hash === '#aaa') {
      setOverlayCookie(this.id, 'accepted');
      return;
    }

    this.opened = checkOverlayCookie(this.id) !== 'accepted';
  }

  protected updated(changedProperties: PropertyValues) {

    if (changedProperties.has('opened') && changedProperties.get('opened') !== undefined) {
      this.opened ? this.showOverlay() : this.hideOverlay();
    }

    super.updated(changedProperties);
  }

  render() {
    return html`<slot id="templatedContent"></slot>`;
  }

  private showOverlay() {
    const slot = this.shadowRoot
      .querySelector('#templatedContent') as HTMLSlotElement;

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
