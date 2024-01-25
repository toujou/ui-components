import { expect, fixture, html } from '@open-wc/testing';

import '../src/index';

describe('Toujou Lazy Render', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(html`
      <toujou-lazy-render></toujou-lazy-render>
    `);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-lazy-render'.toUpperCase());
  });
});

describe('Toujou Lazy Render with templated content', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(html`
      <toujou-lazy-render>
        <template>
          <p>This is come templated content</p>
        </template>
      </toujou-lazy-render>
    `);
  });

  it('Content of template is not visible by default', async () => {
    const childP = element.querySelector('p');
    expect(childP).to.be.null;
  });

  // todo: We should find a way to mock the intersection observer (?) so we can test if the element shows the content when visible
});
