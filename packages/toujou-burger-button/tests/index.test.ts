import { expect, fixture, html } from '@open-wc/testing';
import { ToujouBurgerButton } from '../src/toujou-burger-button';
import '../src/index';
import sinon from 'sinon';

describe('Toujou Burger Button', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(html`
      <toujou-burger-button></toujou-burger-button>
    `);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-burger-button'.toUpperCase());
  });

  it('should initialize with default state and attributes', async () => {
    const el: ToujouBurgerButton = await fixture(html`<toujou-burger-button></toujou-burger-button>`);

    expect(el.getAttribute('aria-pressed')).to.equal('false');
    expect(el.getAttribute('aria-expanded')).to.equal('false');
    expect(el.state).to.be.false;
  });

  it('should toggle state on click', async () => {
    const el: ToujouBurgerButton = await fixture(html`<toujou-burger-button></toujou-burger-button>`);

    expect(el.state).to.be.false;
    expect(el.getAttribute('aria-pressed')).to.equal('false');
    expect(el.getAttribute('aria-expanded')).to.equal('false');

    el.click();
    expect(el.state).to.be.true;
    expect(el.getAttribute('aria-pressed')).to.equal('true');
    expect(el.getAttribute('aria-expanded')).to.equal('true');

    el.click();
    expect(el.state).to.be.false;
    expect(el.getAttribute('aria-pressed')).to.equal('false');
    expect(el.getAttribute('aria-expanded')).to.equal('false');
  });

  it('should fire event on click', async () => {
    const el: ToujouBurgerButton = await fixture(html`<toujou-burger-button></toujou-burger-button>`);

    const stateChangeListener = sinon.spy();
    el.addEventListener('toujou-burger-button-state-change', stateChangeListener);

    el.click();
    expect(stateChangeListener).to.have.been.calledOnce;

    el.click();
    expect(stateChangeListener).to.have.been.calledTwice;
  });

  it('should toggle state on "Enter" key press', async () => {
    const el: ToujouBurgerButton = await fixture(html`<toujou-burger-button></toujou-burger-button>`);
    const event = new KeyboardEvent('keyup', { key: 'Enter' });

    expect(el.state).to.be.false;
    expect(el.getAttribute('aria-pressed')).to.equal('false');
    expect(el.getAttribute('aria-expanded')).to.equal('false');

    el.dispatchEvent(event);

    expect(el.state).to.be.true;
    expect(el.getAttribute('aria-pressed')).to.equal('true');
    expect(el.getAttribute('aria-expanded')).to.equal('true');
  });

  it('should toggle state on "Space" key press', async () => {
    const el: ToujouBurgerButton = await fixture(html`<toujou-burger-button></toujou-burger-button>`);
    const event = new KeyboardEvent('keyup', { key: ' ' });

    expect(el.state).to.be.false;
    expect(el.getAttribute('aria-pressed')).to.equal('false');
    expect(el.getAttribute('aria-expanded')).to.equal('false');

    el.dispatchEvent(event);

    expect(el.state).to.be.true;
    expect(el.getAttribute('aria-pressed')).to.equal('true');
    expect(el.getAttribute('aria-expanded')).to.equal('true');
  });

  it('should handle custom "topbarMqlChangeEventName" and reset state', async () => {
    const el: ToujouBurgerButton = await fixture(html`<toujou-burger-button></toujou-burger-button>`);
    el.state = true;

    const event = new CustomEvent('toujou-topbar-breakpoint-change', {
      detail: { state: false },
    });

    window.dispatchEvent(event);

    expect(el.state).to.be.false;
    expect(el.getAttribute('aria-pressed')).to.equal('false');
    expect(el.getAttribute('aria-expanded')).to.equal('false');
  });
});
