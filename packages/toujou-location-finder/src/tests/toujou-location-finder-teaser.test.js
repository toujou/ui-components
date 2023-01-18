import { html, fixture, expect } from '@open-wc/testing';
import '../toujou-location-finder-teaser.js';

describe('toujou-location-finder-teaser', () => {
  let element = null;
  beforeEach(async () => {
    element = await fixture(html`<toujou-location-finder-teaser></toujou-location-finder-teaser>`);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('TOUJOU-LOCATION-FINDER-TEASER');
  });
});
