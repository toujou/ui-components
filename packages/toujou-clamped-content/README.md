# Toujou Clamped Content

The `toujou-clamped-content` Web Component provides a customizable clamping mechanism for content, allowing users to toggle between showing a limited and full view of the content.

## Installation

      npm install @toujou/toujou-clamped-content


## Usage
After adding the component to our bundle, we can use it like this:
```html
<toujou-clamped-content>
  <div slot="clamped-content">
    <p>Your content goes here. If the content exceeds the available space, clamping will be applied.</p>
  </div>
  <button slot="show-button">Show More</button>
  <button slot="hide-button">Show Less</button>
</toujou-clamped-content>
```


## Attributes
- `is-open`: Reflects whether the content is expanded. Defaults to `false`
- `clamp-disabled`: indicates clamping is disabled due to insufficient content. Automatically updated


## Styling
You can style the content normally because it is placed on the light DOM.
If, for some reason, you also need to style the internals of the componend you can use the following `part` selectors:
- `clamped-content`: Targets the content wrapper


## Accessibility
The component reflects ARIA attributes to the host element:

`aria-expanded`: Indicates whether the content is expanded.


## Events
The component dispatches custom events
- `toujou-clamped-content-changed`: triggered when the component's state changes (show / hide)
- `toujou-clamped-content-clamp-enabled-changed`: triggered when the 'clampDisabled' state changes
