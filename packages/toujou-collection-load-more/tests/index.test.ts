import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
import { stub } from 'sinon';

import '../src/index';

describe('Toujou Collection Load More', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(html`
      <toujou-collection-load-more class="collection--load-more" items-container-selector="{itemsContainerSelector}">
        <a href="content-element.html?uid={data.uid}&offset={filterItems_next_offset}" class="button button--primary button--load-more">
          <f:translate key="LLL:EXT:toujou/Resources/Private/Language/Frontend.xlf:collection.show_more_button.label" />
        </a>
        <toujou-spinner slot="spinner" />
      </toujou-collection-load-more>
    `);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-collection-load-more'.toUpperCase());
  });

  it('wont have `is-loading` attribute on default', async () => {
    expect(element).not.to.have.attribute('is-loading');
  });

  it('will toggle component `is-loading` attribute on click', async () => {
    function jsonOk () {
      const mockResponse = new window.Response('<div></div>', { //the fetch API returns a resolved window Response object
        status: 200,
        headers: {
          'Content-type': 'application/html'
        }
      });

      return Promise.resolve(mockResponse);
    }

    const fetchStub = stub(window, 'fetch'); //add stub
    fetchStub.onCall(0).returns(jsonOk());

    expect(element.shadowRoot?.querySelector('slot').assignedElements()[0]).to.have.class('button');
    (element.shadowRoot?.querySelector('slot').assignedElements()[0] as HTMLElement).click();
    await elementUpdated(element);
    expect(element).to.have.attribute('is-loading');
    expect(fetchStub).to.have.callCount(1);
  });
});
