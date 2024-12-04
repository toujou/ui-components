# Toujou Topbar

`toujou-topbar` is a responsive topbar bar component built with LitElement.
It handles the state of a burger button (for mobile view) and listens to media query changes to adjust its visibility and behavior.
It automatically toggles the visibility of the navigation based on screen size and the state of the burger button.

This component is used for instance on the Kojo theme

## Installation
```
npm install @toujou/toujou-topbar
```

## Example
```html
<toujou-topbar id="topbar" class="topbar">

    <nav aria-label="Topbar Logo">...</nav>

    <ul class="topbar__actions">...</ul>

    <nav class="language-picker" >...</nav>

    <toujou-burger-button class="burger-button">...</toujou-burger-button>

    <nav class="service-nav">...</nav>

    <nav class="main-nav">
        <ul class="main-nav__list">...</ul>
    </nav>

</toujou-topbar>
```

## Features
- **Responsive**: Automatically adapts to screen sizes with media query listeners.
- **Custom Events**: Dispatches events on burger button state changes and media query breakpoint changes.
- **Reflective Properties**: The component reflects the open-nav property to synchronize with the UI state.
- **Customizable**: Easy to style and integrate into your application.

## Properties
- `open-nav`: A boolean property that reflects the open state of the navigation
- `_is-mobile`: A boolean private property that indicates whether the viewport is considered mobile. It is updated when the viewport changes
- `_isOpen`: A boolean private property that tracks the open / close state of the navigation/ This property is bound to the `open-nav` attribute

## Events
- `toujou-burger-button-state-change`: Fired when the burger button's state changes. The event's detail contains a state property that indicates whether the navigation is open (`true`) or closed (`false`).
- `toujou-topbar-breakpoint-change`: Fired when the media query breakpoint changes. The event's detail contains a state property that indicates whether the screen is mobile (`true`) or not (`false`).

## Breakpoint
You can customize the breakpoint for the mobile view using the `--toujou-topbar-breakpoint` CSS variable.
This allows you to change the width threshold at which the top bar switches to the mobile layout.
It must be a valid CSS width value, for instance `1024px` or `60rem`.

example:
```html
<toujou-topbar style="--toujou-topbar-breakpoint: 600px;"></toujou-topbar>
```
In this example, the mobile view will be triggered when the window width is less than 600px (`matchMedia((width < 600px)`).
By default, the breakpoint is set to 840px if the CSS variable is not provided.
