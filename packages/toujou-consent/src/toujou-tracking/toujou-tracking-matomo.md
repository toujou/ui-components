# `<toujou-tracking-matomo>`

This element was created as a wrapper for matomo.

It takes care about the proper configuration for GDPR compliant tracking.

The element can be positioned somewhere on the page. But it is only useful in conjunction
with the `<toujou-conents-widget>` and the attached redux store. It gets activated via
the store and the tracking state.

WARNING: Please ensure that only one instance of the custom element is present on a page.

## `<toujou-tracking-matomo>` example
```html
<toujou-tracking-matomo url="//bunseki.toujou.systems/" siteid="3"></toujou-tracking-matomo>
```


## `<toujou-tracking-matomo>` attributes
The element takes only one attribute:

| Attribute | Description |
|-----------|-------------|
| url | The base url of the matomo server.  |
| siteid | The site id from the tracking code.  |
