import { LitElement, html} from 'lit';
import Inputmask from 'inputmask';
import {validateDate} from './utlis/dates.js';

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

        this.inputmask.mask(this.inputElement);

        this.inputElement.addEventListener('input', this.validateInput);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.inputElement.removeEventListener('input', this.validateInput);

    }

    render() {
        return html`<slot></slot>`;
    }


    validateInput = () => {
        const value = this.inputElement.value;
        if (false === this.inputmask.isValid(value) || false === validateDate(value, this.mask)) {
            this.inputElement.setCustomValidity(this.customValidationErrorMessage);
        } else {
            this.inputElement.setCustomValidity('');

        }
    }

    /**
     * @returns {HTMLInputElement|null}
     */
    get inputElement() {

        const slot = this.shadowRoot.querySelector('slot');

        if (null === slot) {
            return null;
        }

        const firstNode = slot
            .assignedNodes({ flatten: true })
            .find(node => node.tagName === 'INPUT');

        return firstNode ?? null;
    }




}

customElements.define(ToujouInputDateMask.is, ToujouInputDateMask);
