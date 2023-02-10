import { LitElement, html} from 'lit';
import Inputmask from 'inputmask';
import {dateToISO8601, formatIsoDateToFormatDate, parseDateFromFormat, validateDate} from './utlis/dates.js';

export class ToujouInputDateMask extends LitElement {
    static get is() {
        return 'toujou-input-date-mask';
    }

    static get properties() {
        return {
            mask: {
                type: String,
            },
            showMaskOnHover: {
                type: Boolean,
                attribute: 'show-mask-on-hover'
            },
            showMaskOnFocus: {
                type: Boolean,
                attribute: 'show-mask-on-focus'
            },
            customValidationErrorMessage: {
                type: String,
                attribute: 'custom-validation-error-message'

            },
        };
    }

    constructor() {
        super();
        this.mask = 'dd.mm.yyyy';
        this.showMaskOnHover = false;
        this.showMaskOnFocus = false;
        this.customValidationErrorMessage = 'Please enter a valid date';
        this.validateInput.bind(this);
    }

    firstUpdated() {
        super.connectedCallback();
        const numberMask = this.mask.replace(/[a-zA-Z]/g, '9');

        this.inputmask = new Inputmask({
            mask: numberMask,
            showMaskOnHover: this.showMaskOnHover,
            showMaskOnFocus: this.showMaskOnFocus,
        });

        this.inputmask.mask(this.facadeInputElement);

        this.facadeInputElement.addEventListener('input', this.validateInput);

        if (this.hiddenInputElement && this.hiddenInputElement.value) {
            this.facadeInputElement.value = formatIsoDateToFormatDate(this.hiddenInputElement.value, this.mask)
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.facadeInputElement.removeEventListener('input', this.validateInput);

    }

    render() {
        return html`
            <slot name="facade"></slot>
            <slot name="input"></slot>
        `;
    }

    validateInput = () => {
        const facade = this.facadeInputElement;
        const hidden = this.hiddenInputElement;
        const value = facade.value;
        let convertedValue = '';

        if (false === this.inputmask.isValid(value) || false === validateDate(value, this.mask)) {
            facade.setCustomValidity(this.customValidationErrorMessage);
        } else {
            convertedValue = dateToISO8601(parseDateFromFormat(value, this.mask));
            facade.setCustomValidity('');
        }

        if (hidden) {
            this.hiddenInputElement.value = convertedValue;
        }
    }

    /**
     * @returns {HTMLInputElement|null}
     */
    get facadeInputElement() {
        const slot = this.shadowRoot.querySelector('slot[name="facade"]');

        if (null === slot) {
            return null;
        }

        const firstNode = slot
            .assignedNodes({flatten: true})
            .find(node => node.tagName === 'INPUT');

        return firstNode ?? null;
    }

    /**
     * @returns {HTMLInputElement|null}
     */
    get hiddenInputElement() {
        const slot = this.shadowRoot.querySelector('slot[name="input"]');

        if (null === slot) {
            return null;
        }

        const firstNode = slot
            .assignedNodes({flatten: true})
            .find(node => node.tagName === 'INPUT');

        return firstNode ?? null;
    }
}

customElements.define(ToujouInputDateMask.is, ToujouInputDateMask);
