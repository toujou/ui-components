import { expect, fixture, html } from '@open-wc/testing';

import '../src/index.js';

describe('{{component_name}}', () => {
    let element = null;
    beforeEach(async () => {
        element = await fixture(html`
            <toujou-input-date-mask></toujou-input-date-mask>`);
    });

    it('can create component', async () => {
        expect(element).to.not.be.null;
        expect(element).to.not.be.undefined;
        expect(element.nodeName).to.equal(`toujou-input-date-mask`.toUpperCase());
    });
});
