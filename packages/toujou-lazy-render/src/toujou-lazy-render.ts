import { LitElement, html } from 'lit';

export class ToujouLazyRender extends LitElement {
  private intersectionObserver: IntersectionObserver;

  static get is() {
    return 'toujou-lazy-render';
  }

  get templates(): HTMLTemplateElement[] {
    const slot: HTMLSlotElement = this.shadowRoot.querySelector('#slot');
    const nodes = slot.assignedNodes({ flatten: true }) as HTMLElement[];
    return nodes.filter((node) => node.tagName === 'TEMPLATE') as HTMLTemplateElement[];
  }

  render() {
    return html`
      <slot id="slot"></slot>`;
  }

  connectedCallback() {
    super.connectedCallback();

    // Render the templates content whenever the element becomes visible
    this.intersectionObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        this.renderTemplates();
        this.intersectionObserver.disconnect();
      }
    });

    this.intersectionObserver.observe(this);
  }

  disconnectedCallback() {
    this.intersectionObserver && this.intersectionObserver.disconnect();
    super.disconnectedCallback();
  }

  /**
   * Renders the content of each template element by cloning its content into the DOM.
   */
  renderTemplates() {
    this.templates.forEach((template) => {
      const fragment: DocumentFragment = document.importNode(template.content, true);
      template.parentNode.insertBefore(fragment, template);
    });
  }
}

customElements.define(ToujouLazyRender.is, ToujouLazyRender);
