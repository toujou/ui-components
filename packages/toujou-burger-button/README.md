# Toujou Burger Button

The `<toujou-burger-button>` is a customizable, accessible toggle button, ideal for use in navigation menus.
It dispatches events when clicked or toggled, and reacts to media query changes, making it responsive to different screen sizes.
It is used for instance on the Kojo theme.


## Installation

      npm install @toujou/toujou-burger-button


## Features
- Toggle functionality: Click or press the "Enter" or "Space" key to toggle the button state.
- ARIA support: The button uses aria-pressed and aria-expanded attributes for better accessibility.
- Responsive behavior: Automatically closes when the screen width changes (e.g., switching to desktop view).
- Custom event: Dispatches a toujou-burger-button-state-change event when the state changes, allowing other components to react.


## Usage

```html
    <toujou-burger-button
        class="burger-button"
        role="button"
        aria-pressed="false"
        aria-haspopup="true"
        aria-controls="mainNavigation"
        aria-expanded="false"
        aria-label="Menu button"
        toggle-element-selector="#topbar"
        tabindex="0"
    >
        <span class="burger-button__line" slot="content"></span>
        <span class="burger-button__line" slot="content"></span>
        <span class="burger-button__line" slot="content"></span>
    </toujou-burger-button>
```


## Events
The component dispatches the following events:
- `toujou-burger-button-state-change`: this event is triggered whenever the button state changes


## Accessibility
The button supports keyboard navigation with `Enter` and `Space` keys.
It also uses ARIA attributes (`aria-pressed`, `aria-expanded`) to make it more accessible

We should also add
- `aria-haspopup="true"`: To indicate that the button will trigger a menu or dialog when activated, helping assistive technologies understand the purpose of the button.
- `aria-controls="#main-menu"`: To associate the button with the element it controls (e.g., a menu).
- `aria-label="Menu button"`: To provides a descriptive label for the button, making it more understandable for screen readers.

