import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
import { stub } from 'sinon';

import '../src/index';

interface ToujouTopbuttonElement extends HTMLElement {
  visible: boolean;
}

describe('Toujou Topbutton', () => {
  let element: ToujouTopbuttonElement;

  beforeEach(async () => {
    element = await fixture(html`
      <toujou-topbutton></toujou-topbutton>`);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-topbutton'.toUpperCase());
  });

  it('passes the a11y audit', () => {
    expect(element).to.be.accessible();
  });

  it('hides button by default',  () => {
    expect(element).to.have.attribute('aria-hidden', 'true');
    expect(element).not.to.have.attribute('is-visible');
  });

  it('will show button on visible',  async () => {
    // unfortunately I was not able to mock document height and execute scroll event
    element.visible = true;
    await elementUpdated(element);

    expect(element).to.have.attribute('aria-hidden', 'false');
    expect(element).to.have.attribute('is-visible');
  });

  it('scrolls to top on on click',  () => {
    const scrollTopStub = stub(window, 'scrollTo');
    element.click();
    expect(scrollTopStub).to.have.callCount(1);
  });
});
