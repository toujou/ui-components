import { LitElement, html } from 'lit';
import styles from './css/toujou-collection-load-more.css';
import { customElement } from 'lit/decorators';
import { property } from 'lit/decorators.js';
import { ToujouLazyRender } from '@toujou/toujou-lazy-render/src/toujou-lazy-render';

export class ToujouCollectionLoadMore extends LitElement {

  @property({ type: Boolean, reflect: true, attribute: 'is-loading' })
    isLoading = false;

  @property({ type: String, attribute: 'items-container-selector' })
    itemsContainerSelector = '';

  static styles = [styles];

  static get is() {
    return 'toujou-collection-load-more';
  }

  render() {
    return this.isLoading
      ? html`<slot name="spinner"></slot>`
      : html`<slot @click="${this._handleLoadMoreClick}"></slot>`;
  }

  private _handleLoadMoreClick(event: MouseEvent) {
    event.preventDefault();

    let firstNewCardFigure;
    const eventTarget = event.target as HTMLLinkElement|null;

    if (null === eventTarget) {
      return;
    }

    const href = eventTarget.getAttribute('href');
    if (null === href || href === '' ) {
      throw 'Missing or empty href on toujou-collection-load-more link';
    }

    const url = new URL(href, document.baseURI).href;
    this.isLoading = true;

    fetch(url)
      .then((response) => response.text())
      .then((htmlResponse) => {
        const dummyElement = document.createElement('div');
        dummyElement.innerHTML = htmlResponse;

        return dummyElement;
      })
      .then((htmlElement) => {
        const newCards = [].slice.call(htmlElement.querySelector(this.itemsContainerSelector).children);
        const firstNewCard = newCards[0];
        firstNewCardFigure = firstNewCard?.querySelector('a');
        const newLoadMoreButton = htmlElement.querySelector(ToujouCollectionLoadMore.is);
        const cardCollection = document.querySelector(this.itemsContainerSelector);

        cardCollection.append(...newCards);

        if (newLoadMoreButton) {
          this.replaceWith(newLoadMoreButton);
        } else {
          this.remove();
        }
      })
      .catch((e) => {
        window.dispatchEvent(new CustomEvent('toujou-collection-load-more-error', {
          bubbles: true,
          composed: true,
          detail: e,
        }));
      })
      .finally(() => {
        this.isLoading = false;

        if (firstNewCardFigure) {
          requestAnimationFrame(() => {
            firstNewCardFigure.focus();
          });
        }

        window.dispatchEvent(new CustomEvent('toujou-collection-load-more-done', {
          bubbles: true,
          composed: true,
        }));
      });
  }
}

customElements.define(ToujouCollectionLoadMore.is, ToujouCollectionLoadMore);
