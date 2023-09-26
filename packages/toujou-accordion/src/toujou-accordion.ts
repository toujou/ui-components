import { LitElement, PropertyValues } from 'lit';

export class ToujouAccordion extends LitElement {
  private expandModeSingle: boolean;

  static get properties() {
    return {
      expandModeSingle: {
        type: Boolean,
        attribute: 'expand-mode-single'
      },
    };
  }

  private settings = {
    panelSelector: '.accordion__panel',
    contentSelector: '.accordion__content',
    panelActiveClass: 'accordion__panel--active',
    contentActiveClass: 'accordion__content--active'
  };

  static get is() {
    return 'toujou-accordion';
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    const panels: NodeListOf<HTMLElement> = this.querySelectorAll(this.settings.panelSelector);
    const contentElements: NodeListOf<HTMLElement> = this.querySelectorAll(this.settings.contentSelector);

    contentElements.forEach((el) => el.setAttribute('aria-hidden', 'true'));

    panels.forEach((panel: HTMLElement) => {
      const identifier = panel.dataset.for;
      const openOnLoad = panel.dataset.open;
      panel.setAttribute('aria-expanded', 'false');

      if (openOnLoad === 'true') {
        this.togglePanel(identifier);
      }

      panel.addEventListener('click', (e) => {
        e.preventDefault();

        if (this.expandModeSingle) {
          const openAccordionsSelector = `[aria-expanded="true"][data-for]:not([data-for="${identifier}"])`;
          this.querySelectorAll(openAccordionsSelector).forEach((element) => {
            this.togglePanel(element.getAttribute('data-for'));
          });
        }

        this.togglePanel(identifier);

        // Legacy code:
        // 5c961eac277b18392072a3da085188e14fb62cf5: Trigger resize event on accordion click, restart slider width calc
        window.dispatchEvent(new Event('resize'));
      });
    });
  }

  firstUpdated(_changedProperties: PropertyValues<this>) {
    super.firstUpdated(_changedProperties);
    this.dispatchEvent(new CustomEvent('toujou-accordion-ready', { bubbles: true, composed: true, detail: this }));
  }

  /**
   * @param {string} identifier
   */
  togglePanel(identifier: string) {
    const contentEl = this.querySelector(`[data-content="${identifier}"]`);
    const panelEl = this.querySelector(`[data-for="${identifier}"]`);

    if (panelEl === null) {
      throw new Error(`Panel for '${identifier}' not found`);
    }

    if (contentEl === null) {
      throw new Error(`Panel for '${identifier}' not found`);
    }

    if (contentEl.classList.contains(this.settings.contentActiveClass)) {
      contentEl.classList.remove(this.settings.contentActiveClass);
      contentEl.setAttribute('aria-hidden', 'true');
    } else {
      contentEl.classList.add(this.settings.contentActiveClass);
      contentEl.setAttribute('aria-hidden', 'false');
    }

    if (panelEl.classList.contains(this.settings.panelActiveClass)) {
      panelEl.classList.remove(this.settings.panelActiveClass);
      panelEl.setAttribute('aria-expanded', 'false');
    } else {
      panelEl.classList.add(this.settings.panelActiveClass);
      panelEl.setAttribute('aria-expanded', 'true');
    }

    const event = new CustomEvent('accordion-change', {
      bubbles: true,
      cancelable: true,
    });

    this.dispatchEvent(event);
  }
}

customElements.define(ToujouAccordion.is, ToujouAccordion);

declare global {
  interface HTMLElementTagNameMap {
    'toujou-accordion': ToujouAccordion
  }
}
