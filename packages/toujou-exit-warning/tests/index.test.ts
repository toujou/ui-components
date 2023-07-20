import { expect, fixture, html } from '@open-wc/testing';

import '../src/index';

describe('Toujou Exit Warning', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(html`
      <exit-warning title="Sie sind dabei die Seite zu verlassen">
        <template>
          <span id="c283"></span>
          <p>Sie werden in <strong>20 Sekunden</strong> auf die Seite <a href="www.google.com">www.google.com</a> weitergeleitet. Wenn Sie dies abbrechen wollen, schließen Sie dieses Popup.</p>
        </template>
      </exit-warning>
    `);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('exit-warning'.toUpperCase());
  });
});
