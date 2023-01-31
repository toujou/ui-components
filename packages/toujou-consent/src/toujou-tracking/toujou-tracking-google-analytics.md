# `<toujou-tracking-google-analytics>`

This element was created as a wrapper for google analytics.

It takes care about the proper configuration for GDPR compliant tracking.

The element can be positioned somewhere on the page. But it is only useful in conjunction
with the `<toujou-conents-widget>` and the attached redux store. It gets activated via
the store and the tracking state.

WARNING: Please ensure that only one instance of the custom element is present on a page.

## `<toujou-tracking-google-analytics>` example
```html
<toujou-tracking-google-analytics analyticsid="UA-Foo-Bar"></toujou-tracking-google-analytics>
```


## `<toujou-tracking-google-analytics>` attributes
The element takes only one attribute:

| Attribute | Description |
|-----------|-------------|
| analyticsid | The google analytics ID code.  |
