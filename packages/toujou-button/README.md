# Toujou Button

The toujou button is a customized built-in element, which mean it extends one of the default html tags (button tag).

To use the toujou button we need to use the `is="toujou-button"` attribute

## Installation

      npm install @toujou/toujou-button

## Markup example
```html
<button
    is="toujou-button"
    button-variant="secondary"
    button-size="large"
    button-type="ghost"
></button>
```

## Attributes
There are some attribute which we can set to help us style the component. If a given attribute is no given, or if the value is invalid, the default value will be set.

### button-variant
Possible values are 'primary' (default), 'secondary' and 'font'

### button-size
Possible values are 'tiny', 'small', 'normal' (default) and large

### button-type
Possible values are 'default' (border), 'border' and 'ghost'
