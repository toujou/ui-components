import { expect, fixture, html } from '@open-wc/testing';

import '../src/index';
import { ToujouSliderProgressbar } from '../src/toujou-slider-progressbar';

describe('toujou-slider-progressbar', () => {
  let element: ToujouSliderProgressbar;
  beforeEach(async () => {
    element = await fixture(html`
      <toujou-slider-progressbar color="primary"></toujou-slider-progressbar>
    `);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-slider-progressbar'.toUpperCase());
  });
});
