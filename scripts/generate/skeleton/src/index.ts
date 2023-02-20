import { LitElement, html} from 'lit';

export class ComponentName extends LitElement {
    static get is() {
        return '{{package_name}}';
    }

    render() {
        return html`Hello World`;
    }
}

customElements.define(ComponentName.is, ComponentName);
