import { expect, fixture, html } from '@open-wc/testing';

import '../src/index';

describe('Toujou Timeline', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(html`
      <toujou-timeline></toujou-timeline>
    `);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-timeline'.toUpperCase());
  });
});
