import { LitElement } from 'lit';

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * A mixin that remembers the element that was focused before opening a component (e.g. dialog, overlay)
 * and restores focus back to that element when the component is closed.
 *
 * This mixin does **not** automatically hook into the lifecycle –
 * we need to call `captureFocus()` when we open and `restoreFocus()` when we close.
 */
export const FocusReturnMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  return class extends superClass {
    /**
     * The element that had focus before the component was opened.
     * Will be restored when `restoreFocus()` is called.
     */
    private _previouslyFocusedElement: HTMLElement | null = null;

    /**
     * Stores the currently focused element so it can be restored later.
     */
    protected captureFocus() {
      this._previouslyFocusedElement = document.activeElement as HTMLElement;
    }

    /**
     * If a previously focused element was captured, it will receive focus again.
     */
    protected restoreFocus() {
      if (this._previouslyFocusedElement && typeof this._previouslyFocusedElement.focus === 'function') {
        this._previouslyFocusedElement.focus();
      }
      this._previouslyFocusedElement = null;
    }
  };
};
