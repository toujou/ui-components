import { LitElement, html} from 'lit';

export class ToujouExitWarning extends LitElement {
    static get is() {
        return 'toujou-exit-warning';
    }

    render() {
        return html`Hello World`;
    }
}

customElements.define(ToujouExitWarning.is, ToujouExitWarning);
