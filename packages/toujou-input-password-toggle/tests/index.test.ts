import {elementUpdated, expect, fixture, html} from '@open-wc/testing';

import '../src/index';

describe('Toujou Input Password Toggle', () => {
    let element: Element;
    beforeEach(async () => {
        element = await fixture(html`
            <toujou-input-password-toggle>
                <input id="input" type="password" slot="input" />
                <span id="show_button" class="fa fa-fw fa-eye" slot="show-password-button"></span>
                <span id="hide_button" class="fa fa-fw fa-eye-slash" slot="hide-password-button"></span>
            </toujou-input-password-toggle>`);
    });

    it('can create component', async () => {
        expect(element).to.not.be.null;
        expect(element).to.not.be.undefined;
        expect(element.nodeName).to.equal(`toujou-input-password-toggle`.toUpperCase());
    });

    it('will render input as password input with show-password-button by default', async () => {
        const inputElement = element.querySelector('#input');
        const showButton = element.shadowRoot?.querySelector('slot[name="show-password-button"]');
        const hideButton = element.shadowRoot?.querySelector('slot[name="hide-password-button"]');

        expect(inputElement?.getAttribute('type')).to.be.equal('password');
        expect(showButton).not.to.be.null;
        expect(hideButton).to.be.null;
    });

    it('will render input as text input with hide-password-button after toggle ', async () => {
        const inputElement = element.querySelector('#input');

        (element.shadowRoot?.querySelector('slot[name="show-password-button"]') as HTMLElement).click();

        await elementUpdated(element);
        const showButton = element.shadowRoot?.querySelector('slot[name="show-password-button"]');
        const hideButton = element.shadowRoot?.querySelector('slot[name="hide-password-button"]');

        expect(inputElement?.getAttribute('type')).to.be.equal('text');
        expect(showButton).to.be.null;
        expect(hideButton).not.to.be.null;
    });
});
