import { LitElement, html } from 'lit';
import ToujouSliderProgressbarStyles from './css/toujou-slider-progressbar.css';

export class ToujouSliderProgressbar extends LitElement {
  private _slider: Node;

  static get is() {
    return 'toujou-slider-progressbar';
  }

  render() {
    return html``;
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

  set animated(value) {
    if (value) {
      this.setAttribute('animated', '');
    } else {
      this.removeAttribute('animated');
    }
  }

  set animationPaused(value) {
    if (value) {
      this.setAttribute('animation-paused', '');
    } else {
      this.removeAttribute('animation-paused');
    }
  }

  set hidden(value) {
    if (value) {
      this.setAttribute('hidden', '');
    } else {
      this.removeAttribute('hidden');
    }
  }

  constructor() {
    super();

    // Get a reference to the slider element in which the progressbar exists
    this._slider = this.parentNode;

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Event Listeners
      this._slider.addEventListener('glider-slide-visible', this._addAnimation.bind(this));
      this._slider.addEventListener('glider-slide-hidden', this._removeAnimation.bind(this));
      this._slider.addEventListener('glider-reset-animation', this._resetAnimation.bind(this));
      this._slider.addEventListener('mouseenter', this._pauseAnimation.bind(this));
      this._slider.addEventListener('mouseleave', this._unpauseAnimation.bind(this));

      // Run the reset function when the element is ready
      this._resetAnimation();
    } else {
      this.hidden = true;
    }
  }

  private _addAnimation() {
    setTimeout(() => {
      this.animated = true;
    });
  }

  private _removeAnimation() {
    this.animated = false;
  }

  private _resetAnimation() {
    this._removeAnimation();
    this._addAnimation();
  }

  private _pauseAnimation() {
    this.animationPaused = true;
  }

  private _unpauseAnimation() {
    this.animationPaused = false;
    this._resetAnimation();
  }
}

customElements.define(ToujouSliderProgressbar.is, ToujouSliderProgressbar);
