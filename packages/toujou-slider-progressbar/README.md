# Toujou Slider Progressbar

This component displays a progressbar on top of auto-playing sliders.

---

## 📦 Installation

```
npm install @toujou/toujou-slider-progressbar
```

---

## 🧩 Usage

### Basic example

`toujou-slider-progressbar` needs to be placed inside a `toujou-slider` element with the `auto-play` attribute set.

```html
<toujou-slider auto-play="10">
    <toujou-slider-progressbar color="primary"></toujou-slider-progressbar>
    <!-- slider items, controls etc. ... -->
</toujou-slider>
```

---

### ⚙️ Properties

| Property            | Type                                        | Attribute          | Default | Description                          |
|:--------------------|:--------------------------------------------|:-------------------|:--------|:-------------------------------------|
| **animated**        | `boolean`                                   | `animation`        | `false` | Whether the progressbar is animated. |
| **animationPaused** | `boolean`                                   | `animation-paused` | `false` | Whether the animation is paused.     |
| **hidden**          | `boolean`                                   | `hidden`            | `false` | Whether the progressbar is hidden.   |

---

### ♿ Accessibility

* If `prefers-reduced-motion` is set to `reduce`, the event listeners are not set and the component is hidden.

---

### 🧰 Styling Hooks

Default values for height and animation-duration can be overridden via **CSS custom properties**:

```css
toujou-slider-progressbar {
    --toujou-slider-progressbar-height: 4px;
    --toujou-slider-progressbar-animation-duration: 6s;
    --toujou-slider-progressbar-color: currentColor;
}
```

`color` may be set to any of `primary | secondary | font | grey` to override `--toujou-slider-progressbar-color` with one of the theme defaults.
