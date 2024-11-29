import { expect, fixture, html } from '@open-wc/testing';

import '../src/index';
import { ToujouClampedContent } from '../src/toujou-clamped-content';
import sinon from 'sinon';

describe('Toujou Clamped Content', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(html`
      <toujou-clamped-content></toujou-clamped-content>
    `);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-clamped-content'.toUpperCase());
  });

  it('should reflect `clampDisabled` attribute correctly', async () => {
    const element: ToujouClampedContent = await fixture(html`
      <toujou-clamped-content>
        <div slot="clamped-content" style="height: 100px;">
          <p style="height: 200px;">Long content</p>
        </div>
      </toujou-clamped-content>
    `);
    await element.updateComplete;

    expect(element.hasAttribute('clamp-disabled')).to.be.false;
  });

  it('reflects clamp-disabled attribute correctly when it has no content', async () => {
    const element: ToujouClampedContent = await fixture(html`<toujou-clamped-content></toujou-clamped-content>`);
    await element.updateComplete;

    expect(element.hasAttribute('clamp-disabled')).to.be.true;
  });

  it('does not enable clamping when content does not exceed container height', async () => {
    const element: ToujouClampedContent = await fixture(html`
      <toujou-clamped-content>
        <div slot="clamped-content" style="height: 400px; overflow: hidden;">
          <p style="height: 200px;">Long content...</p>
        </div>
      </toujou-clamped-content>
    `);
    await element.updateComplete;

    expect(element.hasAttribute('clamp-disabled')).to.be.true;
  });

  it('toggles isOpen state on button click', async () => {
    const el: ToujouClampedContent = await fixture(html`
      <toujou-clamped-content>
        <div slot="clamped-content">
          <p>Sample content</p>
        </div>
        <button slot="show-button">Show More</button>
        <button slot="hide-button">Show Less</button>
      </toujou-clamped-content>
    `);
    const showButton = el.querySelector('[slot="show-button"]') as HTMLButtonElement;
    const hideButton = el.querySelector('[slot="hide-button"]') as HTMLButtonElement;

    let lastEventDetail = null;
    el.addEventListener('toujou-clamped-content-changed', (e: CustomEvent) => {
      lastEventDetail = e.detail;
    });

    showButton.click();
    await el.updateComplete;
    expect(lastEventDetail.isOpen).to.be.true;

    hideButton.click();
    await el.updateComplete;
    expect(lastEventDetail.isOpen).to.be.false;

    showButton.click();
    await el.updateComplete;
    expect(lastEventDetail.isOpen).to.be.true;
  });

  it('reflects aria-expanded attribute based on isOpen', async () => {
    const el: ToujouClampedContent = await fixture(html`
      <toujou-clamped-content>
        <button slot="show-button">Show</button>
        <button slot="hide-button">Hide</button>
      </toujou-clamped-content>
    `);

    const showButton = el.querySelector('[slot="show-button"]') as HTMLButtonElement;
    const hideButton = el.querySelector('[slot="hide-button"]') as HTMLButtonElement;

    expect(el.getAttribute('aria-expanded')).to.equal('false');

    showButton.click();
    await el.updateComplete;
    expect(el.getAttribute('aria-expanded')).to.equal('true');

    hideButton.click();
    await el.updateComplete;
    expect(el.getAttribute('aria-expanded')).to.equal('false');
  });


  it('has accessibility attributes', async () => {
    const el: ToujouClampedContent = await fixture(html`<toujou-clamped-content></toujou-clamped-content>`);
    await el.updateComplete;

    expect(el.hasAttribute('aria-expanded')).to.be.true;
    expect(el.getAttribute('aria-expanded')).to.equal('false');
  });

  it('toggles accessibility attributes', async () => {
    const el: ToujouClampedContent = await fixture(html`
      <toujou-clamped-content>
        <button slot="show-button">Show</button>
        <button slot="hide-button">Hide</button>
      </toujou-clamped-content>
    `);
    await el.updateComplete;

    const showButton = el.querySelector('[slot="show-button"]') as HTMLButtonElement;
    const hideButton = el.querySelector('[slot="hide-button"]') as HTMLButtonElement;

    expect(el.hasAttribute('aria-expanded')).to.be.true;
    expect(el.getAttribute('aria-expanded')).to.equal('false');

    showButton.click();
    await el.updateComplete;
    expect(el.getAttribute('aria-expanded')).to.equal('true');

    hideButton.click();
    await el.updateComplete;
    expect(el.getAttribute('aria-expanded')).to.equal('false');
  });

  it('dispatches toujou-clamped-content-changed event on toggle', async () => {
    const el: ToujouClampedContent = await fixture(html`<toujou-clamped-content></toujou-clamped-content>`);
    const eventSpy = sinon.spy();
    el.addEventListener('toujou-clamped-content-changed', eventSpy);

    el.toggleIsOpen();
    await el.updateComplete;

    expect(eventSpy.calledOnce).to.be.true;
    expect(eventSpy.firstCall.args[0].detail.isOpen).to.be.true;
  });
});
