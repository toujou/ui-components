import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export class StoryInfo extends LitElement {
  @property({ type: String }) title = '';
  @property({ type: Array, attribute: 'themes', converter: (value) => JSON.parse(value) }) themes: string[] = [];

  static styles = css`
    :host {
      display: block;
      margin-bottom: var(--spacing-xl);
      border-left: var(--spacing-xxs) solid var(--color-primary);
      padding: var(--spacing-normal);
      background-color: var(--color-light-grey);
      font-family: sans-serif;
      line-height: var(--line-height-normal);
    }

    h3 {
      margin: 0;
      font-size: var(--font-size-m);
      color: var(--color-font);
    }

    .themes {
      display: flex;
      gap: var(--spacing-s);
      flex-wrap: wrap;
      margin-block: var(--spacing-s) var(--spacing-normal);
    }

    .theme-chip {
      background-color: var(--color-primary);
      color: white;
      font-size: var(--font-size-xs);
      padding: var(--spacing-xxs) var(--spacing-s);
      border-radius: var(--border-radius-normal);
    }

    .description {
      margin-top: var(--spacing-normal);
    }
  `;

  render() {
    return html`
      <h3>${this.title}</h3>

      ${this.themes.length
        ? html`<div class="themes">
          ${this.themes.map(theme => html`<span class="theme-chip">${theme}</span>`)}
        </div>`
        : ''}

      <div class="description">
        <slot name="description"></slot>
      </div>
    `;
  }
}

if (!customElements.get('story-info')) {
  customElements.define('story-info', StoryInfo);
}
