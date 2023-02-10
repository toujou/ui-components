import { expect, fixture, html } from '@open-wc/testing';

import '../src/index.js';

describe('{{component_title}}', () => {
    let element = null;
    beforeEach(async () => {
        element = await fixture(html`
            <{{package_name}}></{{package_name}}>`);
    });

    it('can create component', async () => {
        expect(element).to.not.be.null;
        expect(element).to.not.be.undefined;
        expect(element.nodeName).to.equal(`{{package_name}}`.toUpperCase());
    });
});
