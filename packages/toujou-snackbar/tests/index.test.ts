import { expect, fixture, html } from '@open-wc/testing';

import '../src/index';

describe('Toujou Snackbar', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(html`
            <toujou-snackbar></toujou-snackbar>`);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-snackbar'.toUpperCase());
  });
});
