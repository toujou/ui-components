import { expect, fixture, html } from '@open-wc/testing';

import '../src/index';

describe('Toujou Rating Stars', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(html`
      <toujou-rating-stars
        class="rating-stars"
        rating-entity="★"
        rating-total="5"
        rating-value="4.4"
        rating-entity-size="xl"
      >
      </toujou-rating-stars>
    `);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-rating-stars'.toUpperCase());
  });

  it('passes a11y audit', async () => {
    expect(element).to.be.accessible();
  });
});
