# TOUJOU-SPINNER

The `<toujou-spinner>` render a spinner on the pge, to show that something is loading

## How to install
1. install via NPM with `npm install @toujou/toujou-spinner`
2. import
   1. in html with `<script src="node_modules/@toujou/toujou-spinner/dist/toujou-spinner.js"></script>`
   2. in js with: `import ToujouSpinner from '@toujou/toujou-spinner';`

## How to use
```html
<toujou-spinner></toujou-spinner>
```

## How to customize

### Attributes

#### [center-on-page]
You can add the `center-on-page` attribute to render the spinner in the center of the page, independent of where on the markup it is placed.

Example: `<toujou=spinner center-on-page></toujou-spinner>` 

### Styles

#### CSS Custom properties
There are several custom properties that help us customize the spinner:
- `--toujou-spinner-size`
- `--toujou-spinner-thickness`
- `--toujou-spinner-start-color`
- `--toujou-spinner-end-color`
- `--toujou-spinner-animation-duration`
- `--toujou-spinner-dash-animation-duration`
- `--toujou-spinner-display`

## Dependencies
- Lit [^2.0.0-rc.2]
