import { expect, fixture, html } from '@open-wc/testing';

import '../src/index';

describe('Toujou Burger', () => {
  let element: HTMLElement;

  beforeEach(async () => {
    element = await fixture(html`
      <toujou-burger></toujou-burger>`);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-burger'.toUpperCase());
  });

  it('passes the a11y audit', () => {
    expect(element).to.be.accessible();
  });
});
