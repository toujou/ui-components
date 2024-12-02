# Toujou Details

The `<toujou-details>` component is a web component that encapsulates a collapsible section.
It wraps around to a native <details> element and can be used independently or as part of a `<toujou-details-accordion>` to create grouped collapsible accordions.

This package has two components:
- `toujou-details`
- `toujou-details-accordion`

## Installation

      npm install @toujou/toujou-details

## toujou-details

```html
<toujou-details is-open>
  <summary slot="summary">Click to toggle</summary>
  <div slot="content">
    <p>This is the content of the details component.</p>
  </div>
</toujou-details>
```

### Slots
  - `sumamry`: Slot for the detail's summary element
  - `content`: Slot for the collapsible content inside the details

### Attributes
  - `is-open` (Boolean): Sets / reflects wether th details is open

### Events
- `toujou-details-connected`: Dispatched when the element connects
- `toujou-details-toggle`: Dispatched when the element toggles open / close

### Printing support
  - Automatically open for printing

### Customization
We can style the component either using the CSS Variables or using the exposed parts:
- `details`: The details element itself
- `details-summary`: The details element's summary child
- `detauls-content`: The wrapper for the details element's content

---

## toujou-details-accordion

### Usage
```html
<toujou-details-accordion single-expand-mode>
  <toujou-details>
    <summary slot="summary">First Panel</summary>
    <div slot="content">Content of the first panel.</div>
  </toujou-details>
  <toujou-details>
    <summary slot="summary">Second Panel</summary>
    <div slot="content">Content of the second panel.</div>
  </toujou-details>
</toujou-details-accordion>
```

### Single expand mode
When the `single-expand-mode` attribute is set, only one panel can be open at a time.

### Events
- `toujou-details-accordion-connected`: Dispatched when the accordion connects to the DOM
