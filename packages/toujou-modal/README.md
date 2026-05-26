# Toujou Modal

A custom modal element to use across all toujou projects

## Table of Contents
- [Installation](#installation)
- [Features](#features)
- [How to Use](#how-to-use)
    - [Basic Usage](#basic-usage)
    - [Handling Modal Content](#handling-modal-content)
    - [Modal Customization](#modal-customization)
        - [Attributes](#attributes)
        - [Custom CSS Variables](#custom-css-variables)
        - [Parts](#parts)
- [Event Listeners](#event-listeners)

## Installation

```
npm install @toujou/toujou-modal
```

## Features
- **Dynamic Content Loading**: Load content into modals via iframe or direct HTML content.
- **Scroll Locking**: Prevent background content from scrolling when a modal is open (optional).
- **Iframe Resizing**: Automatically resize embedded iframes to fit the modal.
- **Customizable Appearance**: Easily customize modal headers, content, and buttons.
- **Modal Stack**: Only one modal is visible at a time, automatically managing multiple open modals.
- **Keyboard Navigation**: Close modals with the Escape key for better accessibility.

## How to use

### Basic usage
1. **Create a Modal**: You can create a modal by adding the <toujou-modal> element to your HTML, like this:
```html
<toujou-modal id="myModal" title="My Modal Title">
  <p>This is the content of the modal.</p>
</toujou-modal>
```

2. **Open the Modal**: You can open the modal programmatically with JavaScript:
```javascript
const modal = document.querySelector('#myModal');
modal.open();
```

Or, you can attach an event listener to an element, such as a button, to trigger the modal to open:
```javascript
<button id="openModalButton">Open Modal</button>

<script>
  document.querySelector('#openModalButton').addEventListener('click', () => {
    const modal = document.querySelector('#myModal');
    modal.open();
  });
</script>
```

3. **Close the Modal**: You can close the modal by calling the `close()` method:
```javascript
modal.close();
```

## Handling modal content
The toujou-modal supports loading dynamic content:

- **iFrame Embedding**: Add an iframe inside the modal to load external content (The modal will automatically handle iframe resizing)
```html
&lt;toujou-modal id=&quot;myModal&quot; title=&quot;Iframe Modal&quot;&gt;
  &lt;iframe src=&quot;https://example.com&quot; toujou-iframe=&quot;{}&quot;&gt;&lt;/iframe&gt;
&lt;/toujou-modal&gt;
```

- **Content from another page**: You can load content from another page by using the `target="toujou-modal"` attribute on a link.
```html
<a href="https://example.com/content" target="toujou-modal">Open Content in Modal</a>
```
This will open the content in a modal, either by embedding it or by submitting data via a POST request.

## Modal Customization

### Attributes

You can customize the modal appearance by using the following attributes:
- **no-header**: Hide the modal header.
- **allow-outside-scroll**: Allow scrolling outside the modal while it's open.
- **no-backdrop**: Remove the backdrop overlay.
- **keep-on-close**: Keep the modal in the DOM after closing.

Example:
```html
<toujou-modal no-header allow-outside-scroll>
  <p>Custom content goes here.</p>
</toujou-modal>
```

### Custom CSS Variables

#### Backdrop
Style the background of the toujou-modal itself.

| Property | Description | Default |
|----------|-------------|---------|
|`--toujou-modal-backdrop-color` | Set modal overlay `background-color` | rgba(0, 0, 0, .6) |


#### Content
These properties apply to the `#content` element, and are mostly needed for IE.

| Property | Description | Default |
|----------|-------------|---------|
|`--toujou-modal-container-justify-content`| Set content element `justify-content` | center |
|`--toujou-modal-container-min-height`| Set content element `min-height` | automatically set |
|`--toujou-modal-container-height`| Set content element `height` | 100vh |
|`--toujou-modal-container-width`| Set content element `width` | 100vw |


#### Modal-Content
These properties apply to the `#modal-content` element.

| Property | Description | Default |
|----------|-------------|---------|
|`--toujou-modal-content-width| Set modal content `width` | 100% |
|`--toujou-modal-content-max-width`| Set modal content `max-width` | calc(100vw - 1rem) |
|`--toujou-modal-content-min-width`| Set modal content `min-width` | 42.5rem |
|`--toujou-modal-content-margin`| Set modal content `margin` | 2rem auto |
|`--toujou-modal-content-shadow`| Set modal content `shadow-box` | 0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px -5px rgba(0,0,0,0.4) |
|`--toujou-modal-content-border`| Set modal content `border` | none |
|`--toujou-modal-content-border-radius`| Set modal content `border-radius` | 0px |
|`--toujou-modal-content-background`| Set modal content `background` | #fff |
|`--toujou-modal-content-max-height`| Set modal content `max-height` | 100vh |
|`--toujou-modal-content-overflow`| Set modal content `overflow` | auto |


#### Header
These properties apply to the `#modal-header` element.

| Property | Description | Default |
|----------|-------------|---------|
|`--toujou-modal-header-position`| Set modal header `position` | relative |
|`--toujou-modal-header-display`| Set modal header `display` | flex |
|`--toujou-modal-header-background`| Set modal header `background-color` | --neutral-color--050 |
|`--toujou-modal-header-padding` | Set modal header `padding` | .5rem |
|`--toujou-modal-header-border-bottom` | Set modal header `border-bottom` | 1px solid --neutral-color--200 |
|`--toujou-modal-header-justify` | Set modal header `justify-content` | space-between |
|`--toujou-modal-header-width` | Set modal header `width` | 100% |


#### Title
These styles apply to the `h3` element inside the `#modal-header`.

| Property | Description | Default |
|----------|-------------|---------|
|`--toujou-modal-title-display` | Set modal headline `display` | flex |
|`--toujou-modal-title-color` | Set modal headline `color` | --secondary-color |
|`--toujou-modal-title-font-family` | Set modal headline `font-family` | --headline__family |
|`--toujou-modal-title-font-size` | Set modal headline `font-size` | 1.21875rem |
|`--toujou-modal-title-font-weight` | Set modal headline `font-weight` | 500 |
|`--toujou-modal-title-padding` | Set modal headline `padding` | 0 .5rem |
|`--toujou-modal-title-align` | Set modal headline `justify-content` | flex-start |


#### Close Button
These styles apply to the `#modal-header-close` button.

| Property | Description | Default |
|----------|-------------|---------|
|`--toujou-modal-close-display` | Set modal close button `display` | block |
|`--toujou-modal-close-position` | Set modal close button `position` | relative |
|`--toujou-modal-close-background` | Set modal close button `background-color` | --primary-color |
|`--toujou-modal-close-background-size` | Set modal close button `background-size` | contain |
|`--toujou-modal-close-background-repeat` | Set modal close button `background-repeat` | no-repeat |
|`--toujou-modal-close-background-position` | Set modal close button `background-position` | center |
|`--toujou-modal-close-font-size` | Set modal close button `font-size` | 2rem |
|`--toujou-modal-close-border` | Set modal close button `border` | 1px solid --primary-color |
|`--toujou-modal-close-color` | Set modal close button `color` | white |
|`--toujou-modal-close-padding` | Set modal close button `padding` | .25rem .675rem |
|`--toujou-modal-close-border-radius` | Set modal close button `border-radius` | 2px |
|`--toujou-modal-close-font-family` | Set modal close button `font-family` | --headline__family |
|`--toujou-modal-close-margin` | Set modal close button `margin` | 0 0 0 1.5rem |
|`--toujou-modal-close-top` | Set modal close top `top` | 0 |
|`--toujou-modal-close-bottom` | Set modal close bottom `bottom` | 0 |
|`--toujou-modal-close-left` | Set modal close left `left` | 0 |
|`--toujou-modal-close-right` | Set modal close right `right` | 0 |
|`--toujou-modal-close-hover-background` | Set modal close button `background-color` when hovered | --primary-color--dark |
|`--toujou-modal-close-hover-background-size` | Set modal close button `background-size` when hovered | contain |
|`--toujou-modal-close-hover-background-repeat` | Set modal close button `background-repeat` when hovered | no-repeat |
|`--toujou-modal-close-hover-background-position` | Set modal close button `background-position` when hovered | center |
|`--toujou-modal-close-hover-border` | Set modal close button `border` when hovered | 1px solid  --primary-color--dark |
|`--toujou-modal-close-hover-color` | Set modal close button `color` when hovered | white |


#### Progress Bar
These styles apply to the `#progress-bar` element.

| Property | Description | Default |
|----------|-------------|---------|
|`--toujou-modal-progressbar-color` | Set modal 'active' progressbar `background-color` | --primary-color |
|`--toujou-modal-progressbar-height` | Set modal progressbar `height` | 4px |
|`--toujou-modal-progressbar-animation` | Set modal progressbar `animation` | progress 6s linear infinite) |

### Parts
## Parts
The toujou-modal web component exposes several parts that can be styled externally using the ::part() pseudo-element.

| Part                 | Description                                         |
|:---------------------|:----------------------------------------------------|
| `scroller`           | The scrollable container inside the modal           |
| `content`            | The main content wrapper of the modal               |
| `modal-content`      | The container for the modal's content               |
| `modal-header`       | The header element of the modal                     |
| `headline`           | The modal's headline element                        |
| `dog-ear-close`      | The "dog-ear" close button (visible when no header) |
| `modal-header-close` | The close button in the modal header                |
| `progress-bar`       | The progress bar displayed inside the header        |


## Event listeners
Toujou Modal dispatches the following events, which you can listen for:

- `toujou-modal-opened`: Dispatched when the modal is opened.
- `toujou-modal-closed`: Dispatched when the modal is closed.
- `toujou-modal-loaded`: Dispatched when an iframe inside the modal is loaded.

Example:
```html
const modal = document.querySelector('#myModal');
modal.addEventListener('opened', () => {
  console.log('The modal has opened!');
});
```
