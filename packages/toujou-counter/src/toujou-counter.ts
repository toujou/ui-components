import { LitElement, PropertyValues } from 'lit';
import { easeOutQuad } from './utils/_animationFunction';
import { counterSettings, counterEventNames } from './utils/_settings';

export class ToujouCounter extends LitElement {
  private startNumber: string;
  private endNumber: string;
  private animationSpeed: boolean;
  private _numberEl: Element;
  private _startNumberVal: number;
  private _endNumberVal: number;
  private _animationSpeedVarName: string;
  private _frameDuration = 1000 / 60; // 60 fps
  private _animationDuration: number;
  private _totalFrames: number;
  private _pageLang: string;

  private _observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= counterSettings.intersectionRatio) {
        this._dispatchCounterEvent(counterEventNames.animationStart);
        this._animate();
        observer.unobserve(this);
      }
    });
  }, { threshold: counterSettings.intersectionThreshold });

  static get is() {
    return 'toujou-counter';
  }

  static properties = {
    startNumber: {
      type: String,
      attribute: 'start-number'
    },
    endNumber: {
      type: String,
      attribute: 'end-number'
    },
    animationSpeed: {
      type: String,
      attribute: 'animation-speed'
    },
  };

  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    if (!this.startNumber || !this.endNumber) {
      console.error('TOUJOU: could not get start and end values for the counter animation!', this);
      return;
    }

    this._numberEl = this.querySelector('.counter__number-text');
    if (!this._numberEl) {
      console.error('TOUJOU: could not get the counter number element!', this);
      return;
    }

    if (!this.animationSpeed) {
      console.warn('TOUJOU: could not get the counter animation speed. Using default value!', this);
    }

    // Check if user has "reduced motion" active
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this._numberEl.textContent = this.endNumber;
    } else {
      this._init();
    }
  }

  _init = () => {
    this._startNumberVal = parseFloat(this.startNumber);
    this._endNumberVal = parseFloat(this.endNumber);
    this._animationDuration = this._getAnimationDuration();
    this._totalFrames = Math.round(this._animationDuration / this._frameDuration);
    this._pageLang = document.documentElement.getAttribute('lang') || counterSettings.defaultLang;

    this._observer.observe(this._numberEl);

    this._dispatchCounterEvent(counterEventNames.init);
  };

  /**
   * Create an animation loop to animate from the start to the end values in the selected speed
   */
  _animate = () => {
    let frame = 0;

    const animationLoop = () => {
      frame++;

      const progress = easeOutQuad(frame / this._totalFrames);

      // Count up or down
      const currentCount = this._endNumberVal >= this._startNumberVal
        ? Math.round(this._startNumberVal + (this._endNumberVal - this._startNumberVal) * progress)
        : Math.round(this._startNumberVal - (this._startNumberVal - this._endNumberVal) * progress);

      if (parseFloat(this._numberEl.textContent.replace(/,/g, '')) !== currentCount) {
        this._numberEl.textContent = new Intl.NumberFormat(this._pageLang).format(currentCount);
      }

      if (frame < this._totalFrames) {
        requestAnimationFrame(animationLoop);
      } else {
        this._numberEl.textContent = new Intl.NumberFormat(this._pageLang).format(this._endNumberVal);
        this._dispatchCounterEvent(counterEventNames.animationEnd);
      }
    };

    requestAnimationFrame(animationLoop);
  };

  /**
   * Get the animation speed from the correct CSS variable
   */
  _getAnimationDuration = () => {
    this._animationSpeedVarName = `--counter-animation-duration-${this.animationSpeed ? this.animationSpeed : counterSettings.defaultAnimationSpeed}`;
    const counterStyles = getComputedStyle(this);
    let durationVariable = parseInt(counterStyles.getPropertyValue(`${this._animationSpeedVarName}`));

    if (!durationVariable) {
      console.warn('TOUJOU: could not get the counter animation duration variable. Using fallback value', this);
      durationVariable = counterSettings.defaultAnimationDuration;
    }

    return durationVariable;
  };

  _dispatchCounterEvent = (eventName: string) => {
    this.dispatchEvent(new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail: {
        counter: this
      }
    }));
  };
}

customElements.define(ToujouCounter.is, ToujouCounter);
