# TOUJOU-BURGER

The `<toujou-burger>` render a burger button on the page.

It acts as a container with takes care of the burger state and dispatching the relevant events.

The content of the burger button (the burger button lines) are part of the lightDOM and, as such, can also be styled
with CSS (example on `ext/toujou/Resources/Public/Scss/medatsu/elements/_burger.scss`)

## How to install

1. install via NPM with `npm install @toujou/toujou-burger`
2. import
    1. in html with `<script src="node_modules/@toujou/toujou-burger/dist/toujou-burger.js"></script>`
    2. in js with: `import ToujouBurger from '@toujou/toujou-burger';`

## How to use

```html
<toujou-burger
        class="burger"
        role="button"
        aria-pressed="false"
        aria-haspopup="true"
        aria-controls="mainNavigation"
        aria-expanded="false"
        aria-label="Menu button"
        listenTo="#navigation-state"
        toggleElement="#mainNavigation">
    <span class="burger__line burger__line--top" aria-hidden="true"></span>
    <span class="burger__line burger__line--middle" aria-hidden="true"></span>
    <span class="burger__line burger__line--bottom" aria-hidden="true"></span>
</toujou-burger>
```
