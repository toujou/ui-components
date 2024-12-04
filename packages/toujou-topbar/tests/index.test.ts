import { expect, fixture, html } from '@open-wc/testing';
import { ToujouTopbar } from '../src/toujou-topbar';
import '../src/index';
import sinon from 'sinon';

describe('Toujou Topbar', () => {
  let element: ToujouTopbar;

  beforeEach(async () => {
    element = await fixture(html`<toujou-topbar></toujou-topbar>`);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-topbar'.toUpperCase());
  });

  it('should have default property values', async () => {
    element = await fixture(html`<toujou-topbar></toujou-topbar>`);
    expect(element._isOpen).to.be.false;
    expect(element._isMobile).to.equal(window.matchMedia('(width < 840px)').matches);
    expect(element._mql.media).to.equal('(width < 840px)');
  });

  it('should handle burger button state change event', async () => {
    const event = new CustomEvent('toujou-burger-button-state-change', {
      detail: { state: true },
    });

    window.dispatchEvent(event);
    expect(element._isOpen).to.be.true;
    expect(document.body.hasAttribute('nav-is-open')).to.be.true;

    const closeEvent = new CustomEvent('toujou-burger-button-state-change', {
      detail: { state: false },
    });

    window.dispatchEvent(closeEvent);
    expect(element._isOpen).to.be.false;
    expect(document.body.hasAttribute('nav-is-open')).to.be.false;
  });

  it('should handle media query changes', async () => {
    const listener = sinon.spy();
    element.addEventListener('toujou-topbar-breakpoint-change', listener);

    let changeEvent = new MediaQueryListEvent('change', {
      matches: true,
      media: 'width < 840px',
    });
    element._handleMqlChange(changeEvent);

    expect(element._isMobile).to.be.true;
    expect(listener.calledOnce).to.be.true;
    expect(listener.calledWithMatch({
      detail: { state: true },
    }));

    changeEvent = new MediaQueryListEvent('change', {
      matches: false,
      media: '(width < 840px)',
    });
    element._handleMqlChange(changeEvent);

    expect(element._isMobile).to.be.false;
    expect(listener.calledTwice).to.be.true;
    expect(listener.secondCall.args[0].detail).to.deep.equal({ state: false });
  });

  it('should add and remove event listeners in lifecycle methods', async () => {
    const addEventListenerSpy = sinon.spy(window, 'addEventListener');
    const removeEventListenerSpy = sinon.spy(window, 'removeEventListener');

    document.body.appendChild(element);
    expect(addEventListenerSpy.calledWith('toujou-burger-button-state-change')).to.be.true;

    document.body.removeChild(element);
    expect(removeEventListenerSpy.calledWith('toujou-burger-button-state-change')).to.be.true;

    addEventListenerSpy.restore();
    removeEventListenerSpy.restore();
  });

  it('should reflect open-nav attribute', async () => {
    await element.updateComplete;
    expect(element.hasAttribute('open-nav')).to.be.false;

    element._isOpen = true;
    await element.updateComplete;
    expect(element.hasAttribute('open-nav')).to.be.true;

    element._isOpen = false;
    await element.updateComplete;
    expect(element.hasAttribute('open-nav')).to.be.false;
  });

  it('should not use shadow DOM', async () => {
    expect(element.shadowRoot).to.be.null;
  });

  it('should use default breakpoint if no CSS variable is set', async () => {
    element.style.removeProperty('--toujou-topbar-breakpoint');
    element._mql = window.matchMedia('(width < 840px)');

    expect(element._mql.media).to.equal('(width < 840px)');
    expect(element._isMobile).to.equal(window.matchMedia('(width < 840px)').matches);
  });

  it('allows custom breakpoint via CSS variable', async () => {
    const testBreakpoints = ['600px', '50rem', '50vw', '1024px'];

    for (const testBreakpoint of testBreakpoints) {
      element = await fixture(html`<toujou-topbar style="--toujou-topbar-breakpoint: ${testBreakpoint};"></toujou-topbar>`);

      expect(element._mql.media).to.equal(`(width < ${testBreakpoint})`);
      expect(element._isMobile).to.equal(window.matchMedia(`(width < ${testBreakpoint})`).matches);

      const listener = sinon.spy();
      element.addEventListener('toujou-topbar-breakpoint-change', listener);

      const changeEvent = new MediaQueryListEvent('change', {
        matches: true,
        media: `(width < ${testBreakpoint})`,
      });
      element._handleMqlChange(changeEvent);

      expect(element._isMobile).to.be.true;
      expect(listener.calledOnce).to.be.true;
    }

  });
});
