import { expect, fixture, html } from '@open-wc/testing';

import '../src/index';

describe('Toujou Cookie Script Third Party Content', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(html`
      <toujou-cookie-script-third-party-content></toujou-cookie-script-third-party-content>
    `);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-cookie-script-third-party-content'.toUpperCase());
  });
});
