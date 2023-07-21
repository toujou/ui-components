# Toujou Rating Stars

The "rating stars" element allows us to quickly add a "rating" element without having to deal with images for the different values.

The rating element is configurable: we can change the color, the "rating entity", size, number of elements, ...

## Installation

      npm install @toujou/toujou-rating-stars


## How to use
```html
<toujou-rating-stars
    class="rating-stars"
    rating-entity="★"
    rating-total="5"
    rating-value="4.4"
    rating-entity-size="xl"
>
</toujou-rating-stars>
```


## Attributes

### class [required]
The rating stars element must have the `rating-stars` class

### rating-value [required]
The `rating-value` defines the value that should be shown on the element.

This value is used together with the `rating-total` attribute to calculate the rate percentage

### rating-entity
The `rating-entity` attribute defines the "symbol" to show on the element.

If not available, the default value is `★`

Example:
```html
<toujou-rating-stars class="rating-stars" rating-entity="👍" rating-value="4.4">
```

| ⚠️ Depending on the symbol used, we may need to adjust the letter-spacing on the element, which you can do with the `--rating-stars-letter-spacing` css variable |
|:-------------------------------------------------------|

### rating-total
The `rating-total` allows us to show a ratings element with a different number of items, for instance for a 0 - 10 rating.

If not available, the default value if `5`

```html
<toujou-rating-stars class="rating-stars" rating-entity="★" rating-total="10" rating-value="7">
```

### rating-entity-size
The `rating-entity-size` defines how big the "symbols" on the element are.

If not available, the default value is `--font-size-normal`.

Available values are `s`, `normal`, `m`, `l`, `xl`, and `xxl`.

If needed, you can directly set the `--rating-stars-font-size` CSS variable to give it a custom size.

Example:
```html
<toujou-rating-stars class="rating-stars" rating-value="7" rating-entity-size="xxl">
```
or
```css
.rating-stars {
    --rating-stars-font-size: 100px;
}
```

## CSS Variables

CSS Variables allow you to adjust the element's style to meet your needs

- `--rating-stars-letter-spacing`
- `--rating-stars-color`
- `--rating-stars-font-size`
