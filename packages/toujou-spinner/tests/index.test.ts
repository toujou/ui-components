import { expect, fixture, html } from '@open-wc/testing';

import '../src/index';

describe('Toujou Spinner', () => {
  let element: HTMLElement;

  beforeEach(async () => {
    element = await fixture(html`
      <toujou-spinner></toujou-spinner>`);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-spinner'.toUpperCase());
  });

  it('passes the a11y audit', () => {
    expect(element).to.be.accessible();
  });
});
