import { html, LitElement } from 'lit';
import { iframeResizer } from 'iframe-resizer';

class ToujouIframeResizer extends LitElement {
  static get is() {
    return 'toujou-iframe-resizer';
  }

  render() {
    return html`
      <slot @slotchange="${this.handleSlotChange}"></slot>`;
  }

  handleSlotChange(event: Event) {
    const eventTarget: HTMLSlotElement = <HTMLSlotElement>event.target;
    eventTarget.assignedNodes({ flatten: true })
      .filter((node: Node) => node instanceof HTMLIFrameElement)
      .forEach((iframe: HTMLIFrameElement) => {
        let iframeOptions = {};
        try {
          iframeOptions = JSON.parse(iframe.getAttribute('toujou-iframe'))
            || {};
        } catch (e) {
          // eslint-disable-next-line no-console
          (console.error || console.log).call(console, e.stack || e);
        }
        iframeResizer(iframeOptions, iframe);
      });
  }
}

customElements.define(ToujouIframeResizer.is, ToujouIframeResizer);
