import { LitElement } from 'lit';
import ToujouSliderProgressbarStyles from './css/toujou-slider-progressbar.css';

export class ToujouSliderProgressbar extends LitElement {
  private _parentElement: HTMLElement;

  static get is() {
    return 'toujou-slider-progressbar';
  }

  static get styles() {
    return [ ToujouSliderProgressbarStyles ];
  }

  static get properties() {
    return {
      animated: {
        type: Boolean,
        reflect: true,
        attribute: 'animated'
      },
      animationPaused: {
        type: Boolean,
        reflect: true,
        attribute: 'animation-paused'
      },
      hidden: {
        type: Boolean,
        reflect: true,
        attribute: 'hidden'
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this._parentElement = this.parentElement;

      if (this._parentElement) {
        this._parentElement.addEventListener('glider-slide-visible', () => this._addAnimation());
        this._parentElement.addEventListener('glider-slide-hidden', () => this._removeAnimation());
        this._parentElement.addEventListener('glider-reset-animation', () => this._resetAnimation());
        this._parentElement.addEventListener('mouseenter', () => this._pauseAnimation());
        this._parentElement.addEventListener('mouseleave', () => this._unpauseAnimation());
      }

      this._resetAnimation();
    } else {
      this.setAttribute('hidden', '');
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this._parentElement) {
      this._parentElement.removeEventListener('glider-slide-visible', () => this._addAnimation());
      this._parentElement.removeEventListener('glider-slide-hidden', () => this._removeAnimation());
      this._parentElement.removeEventListener('glider-reset-animation', () => this._resetAnimation());
      this._parentElement.removeEventListener('mouseenter', () => this._pauseAnimation());
      this._parentElement.removeEventListener('mouseleave', () => this._unpauseAnimation());
    }
  }

  private _addAnimation() {
    this.setAttribute('animated', '');
  }

  private _removeAnimation() {
    this.removeAttribute('animated');
  }

  private _resetAnimation() {
    this._removeAnimation();
    requestAnimationFrame(() => {
      this._addAnimation();
    });
  }

  private _pauseAnimation() {
    this.setAttribute('animation-paused', '');
  }

  private _unpauseAnimation() {
    this.removeAttribute('animation-paused');
    this._resetAnimation();
  }
}

customElements.define(ToujouSliderProgressbar.is, ToujouSliderProgressbar);
