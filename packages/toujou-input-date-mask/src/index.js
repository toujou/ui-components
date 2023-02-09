import { LitElement, html} from 'lit';
import Inputmask from 'inputmask/dist/inputmask.es6.js';

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
            },
            showMaskOnFocus: {
                type: Boolean
            },
        };
    }

    constructor() {
        super();
        this.mask = 'dd.mm.yyyy';
        this.showMaskOnHover = false;
        this.showMaskOnFocus = false;
    }

    createRenderRoot() {
        return this;
    }

    connectedCallback() {
        super.connectedCallback();
        this.inputmask = new Inputmask({
            mask: this.mask,
            showMaskOnHover: this.showMaskOnHover,
            showMaskOnFocus: this.showMaskOnFocus,
        });
    }

    render() {
        return html`
            <input ref={myRef} placeholder={statePlaceholder} type='tel'
                   onClick={onClick} className={className} spellCheck="false" onInput={onInput} onTouchStart={onTouchStart}
                   onFocus={onFocus} value={maskOnFocus ? newState : ''} onKeyDown={onKeyDown}
            autoComplete='off' onPaste={onHandlePaste} onMouseEnter={onHandleMouseEnter}
            onMouseLeave={onHandleMouseLeave} onBlur={onHandleBlur} disabled={disabled} readOnly={readOnly}></input>
            
        `;
    }
}

customElements.define(ToujouInputDateMask.is, ToujouInputDateMask);
