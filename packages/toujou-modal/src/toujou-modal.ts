import { LitElement, html } from 'lit';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import iframeResizerPkg from 'iframe-resizer';
const { iframeResizer } = iframeResizerPkg;
import styles from './css/toujou-modal.css';
import { property } from 'lit/decorators.js';
import { IframeOptions, ToujouModalEvents } from './types';

const bodyScrollLockOptions = {
  reserveScrollBarGap: true,
};

const modalStack: ToujouModal[] = [];

function pushToOpenStack(modal: ToujouModal): void {
  modalStack.forEach((modal: ToujouModal) => modal.close());
  modalStack.push(modal);
}

function popFromOpenStack(modal: ToujouModal): void {
  if (modal === modalStack[modalStack.length - 1]) {
    modalStack.pop();
    const previous: ToujouModal = modalStack.pop();
    previous && previous.open();
  }
}

/**
 * @todo use toujou-iframe-resizer
 */
export class ToujouModal extends LitElement {
  static get is() {
    return 'toujou-modal';
  }

  static get styles() {
    return styles;
  }

  @property({ type: Boolean, reflect: true }) opened = false;
  @property({ type: String }) title = '';
  @property({ type: Boolean, attribute: 'no-header', reflect: true }) noHeader = false;
  @property({ type: Boolean, attribute: 'allow-outside-scroll', reflect: true }) allowOutsideScroll = false;
  @property({ type: Boolean, attribute: 'no-backdrop', reflect: true }) noBackdrop = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: Boolean, attribute: 'keep-on-close', reflect: true }) keepOnClose = false;

  private intersectionObserver: IntersectionObserver;
  private iframeResizerMap: Map<HTMLElement, any>;
  private $!: {
    scroller: HTMLElement | null;
    content: HTMLElement | null;
    modalContent: HTMLElement | null;
    slot: HTMLSlotElement | null;
  };

  constructor() {
    super();

    this.opened = false;
    this.loading = false;
    this.keepOnClose = false;

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries[0] && this.onPosition(entries[0]);
    });

    this.iframeResizerMap = new Map();

    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('message', this.onWindowPostMessage.bind(this));
  }

  render() {
    return html`
      <div id="scroller" @click="${this.onClick}" part="scroller">
        <div id="content" part="content">
          <div id="modal-content" part="modal-content">
            <div id="modal-header" part="modal-header">
              ${this.noHeader
    ? html`
                  <button id="dog-ear-close" dialog-dismiss part="dog-ear-close"></button>`
    : html`
                  <h3 part="headline">${this.title}</h3>
                  <button id="modal-header-close" dialog-dismiss part="modal-header-close">×</button>
                `}
              <div id="progress-bar" part="progress-bar"></div>
            </div>
            <slot id="slot" @slotchange="${this.onSlotchange}"></slot>
          </div>
        </div>
      </div>
    `;
  }

  disconnectedCallback() {
    clearAllBodyScrollLocks();
    window.removeEventListener('keydown', this.onKeyDown);
    window.addEventListener('message', this.onWindowPostMessage);
  }

  firstUpdated() {
    this.$ = {
      scroller: this.shadowRoot.querySelector('#scroller'),
      content: this.shadowRoot.querySelector('#content'),
      modalContent: this.shadowRoot.querySelector('#modal-content'),
      slot: this.shadowRoot.querySelector('#slot'),
    };
  }

  updated(changedProperties: any) {
    if (changedProperties.has('opened') && changedProperties.get('opened') !== undefined) {
      this.opened ? this.onOpen() : this.onClose();
      this.hidden = !this.opened;
    }
  }

  open(): void {
    this.opened = true;
  }

  close(): void {
    this.opened = false;
  }

  toggle() {
    this.opened = !this.opened;
  }

  onOpen() {
    this.intersectionObserver.observe(this);

    if (this.allowOutsideScroll) {
      document.body.style.position = 'relative';
    } else {
      disableBodyScroll(this.$.scroller, bodyScrollLockOptions);
    }

    pushToOpenStack(this);

    setTimeout(() => {
      this.setAttribute('visible', '');
      this.dispatchModalEvent(ToujouModalEvents.OPENED);
    });
  }

  onClose() {
    this.removeAttribute('visible');
    popFromOpenStack(this);

    if (this.allowOutsideScroll) {
      document.body.style.position = '';
    } else {
      enableBodyScroll(this.$.scroller);
    }

    this.intersectionObserver.unobserve(this);
    this.dispatchModalEvent(ToujouModalEvents.CLOSED);

    if (this.keepOnClose === false) {
      setTimeout(() => {
        this.remove();
      }, 5);
    }
  }

  onLoad(loading: boolean) {
    this.loading = loading;
  }

  onClick(event: MouseEvent) {
    if (!event.composed) {
      return;
    }

    const composedPath: EventTarget[] = event.composedPath();
    if (!composedPath.includes(this.$.modalContent) || composedPath.some((node) => node instanceof HTMLElement && node.hasAttribute('dialog-dismiss'))) {
      this.close();
    }
  }

  onPosition(observerEntry: IntersectionObserverEntry) {
    const potentialTop = Math.max(observerEntry.intersectionRect.y, Math.abs(observerEntry.boundingClientRect.y));
    this.$.content.style['min-height'] = `${observerEntry.intersectionRect.height}px`;
    this.$.content.style.top = potentialTop ? `${potentialTop}px` : '';
  }

  onSlotchange() {
    const iframes = this.$.slot.assignedNodes().filter((node) => node instanceof HTMLIFrameElement);

    this.iframeResizerMap.forEach((iframe) => {
      if (!iframes.includes(iframe)) {
        this.iframeResizerMap.delete(iframe);
      }
    });

    iframes.forEach((iframe: HTMLIFrameElement) => {
      this.loading = true;
      iframe.addEventListener('load', () => {
        if (!this.iframeResizerMap.has(iframe)) {
          this.listenToIframeReadyState(iframe);
        }
      });
    });
  }

  listenToIframeReadyState(iframe: HTMLIFrameElement) {
    this.loading = true;
    this.iframeResizerMap.set(iframe, this.createIframeResizer(iframe));

    iframe.contentWindow.addEventListener('beforeunload', () => {
      this.loading = true;
    });

    try {
      this.title = iframe.contentWindow.document.title || this.title;
    } catch (e) {
      this.title = '';
    }
    this.loading = false;
    this.dispatchModalEvent(ToujouModalEvents.LOADED);
  }

  createIframeResizer(iframe: HTMLIFrameElement) {
    let iframeOptions: IframeOptions = {};

    try {
      iframeOptions = JSON.parse(iframe.getAttribute('toujou-iframe')) || {};
    } catch (e) {
      (console.error || console.log).call(console, e.stack || e);
    }

    iframeOptions.initCallback = () => {
      this.loading = false;
    };

    iframeOptions.closedCallback = () => {
      this.close();
    };

    return iframeResizer(iframeOptions, iframe);
  }

  dispatchModalEvent(eventName: string) {
    this.dispatchEvent(new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
    }));
  }

  onKeyDown(event: KeyboardEvent) {
    if ((event.target as HTMLElement)?.closest('.form')) return;

    if (event.key === 'Escape') {
      this.close();
    }
  }

  onWindowPostMessage(event: MessageEvent) {
    if (event.data === ToujouModalEvents.CLOSED) {
      this.close();
    }
  }
}

customElements.define(ToujouModal.is, ToujouModal);

