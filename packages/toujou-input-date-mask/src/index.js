import { LitElement, html} from 'lit';

export class ToujouInputDateMask extends LitElement {
    static get is() {
        return 'toujou-input-date-mask';
    }

    render() {
        return html`Hello World`;
    }
}

customElements.define(ToujouInputDateMask.is, ToujouInputDateMask);
