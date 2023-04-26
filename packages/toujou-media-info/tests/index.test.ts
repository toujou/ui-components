import { elementUpdated, expect, fixture, html } from '@open-wc/testing';

import '../src/index';

describe('Toujou Media Info', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(html`
              <toujou-media-info class="media-info">
                <button slot="open-button" class="media-info__toggle" aria-description="Toggle the image caption and / or copyright"></button>
                <button slot="close-button" class="media-info__toggle" aria-description="Toggle the image caption and / or copyright"></button>
                <figpaction slot="figcaption" class="media-info__figcaption">This is the image description in fileadmin</figpaction>
                <small slot="copyright" class="media-info__copyright">© Cool photographer</small>
              </toujou-media-info>
           `);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-media-info'.toUpperCase());
  });

  it('wont have `open` attribute on default', async () => {
    expect(element).not.to.have.attribute('open');
  });

  it('will toggle component `open` attribute on click', async () => {
    (element.shadowRoot?.querySelector('slot[name="open-button"]') as HTMLElement).click();
    await elementUpdated(element);
    expect(element).to.have.attribute('open');
  });

  it('will toggle parents `media-info-child-is-open` attribute on click', async () => {
    (element.shadowRoot?.querySelector('slot[name="open-button"]') as HTMLElement).click();
    await elementUpdated(element);
    expect(element.parentElement).to.have.attribute('media-info-child-is-open');
  });
});
