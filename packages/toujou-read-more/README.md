# Toujou Read More

Expandable text component that truncates long content to a specified number of lines and allows toggling between a collapsed and expanded view.

---

## 🧱 Overview

`<toujou-read-more>` displays text content limited to a configurable number of lines.
If the content exceeds that limit, a “read more” button appears to expand it, and a “read less” button appears to collapse it again.

The buttons are **fully slottable**, allowing you to use any custom markup (e.g., text, icons, localized strings).

---

## 📦 Installation

      npm install @toujou/toujou-read-more

---

## ✨ Features

- Automatically detects when text is overflowing
- Customizable maximum line count (`max-lines`)
- Accessible toggle buttons (ARIA attributes handled automatically)
- Slottable buttons for “read more” and “read less”
- Emits a custom event when ready
- Emits a custom event when toggled
- Works with any content (text, inline elements, etc.)

---

## 🧩 Usage

### Basic example

```html
<toujou-read-more max-lines="3">
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
  <button slot="open-button">Read more</button>
  <button slot="close-button">Read less</button>
</toujou-read-more>
```

---

### ⚙️ Properties

| Property | Type | Attribute | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **maxLines** | `number` | `max-lines` | `3` | Maximum number of visible lines before truncating. |
| **hasClampedText** | `boolean` | `has-clamped-text` | `true` | Whether the content is currently truncated. |
| **showButton** | `boolean` | *state only* | `false` | Whether the toggle buttons are currently shown. |

---

### 🎛️ Slots

| Name | Description |
| :--- | :--- |
| **default** | Content that will be clamped. |
| **open-button** | Button shown when text is truncated (“Read more”). |
| **close-button** | Button shown when text is expanded (“Read less”). |

---

### 🎨 CSS Parts

| Part | Description |
| :--- | :--- |
| **content** | Wrapper around the clamped content. |
| **buttons** | Container for the toggle buttons. |

---

### 💬 Events

### 🧠 Events

| Event name | Detail | Description |
| :--- | :--- | :--- |
| **toujou-read-more-ready** | *none* | Fired when the component has completed its initial setup (overflow check, accessibility, etc.). |
| **toujou-read-more-toggle** | `{ isClamped: boolean }` | Fired when the component toggles between clamped and expanded states. |

---

### ♿ Accessibility

* Toggle buttons automatically receive the correct **`aria-expanded`**, **`aria-controls`**, and **visibility** attributes.
* The content region is labeled with **`aria-label="Expandable content"`**.

### 🧰 Styling Hooks

You can override spacing and max lines via **CSS custom properties**:

```css
toujou-read-more {
  --toujou-read-more-max-lines: 4;
}
```
