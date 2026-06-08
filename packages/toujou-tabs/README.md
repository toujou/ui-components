# Toujou Tabs

Accessible and responsive tab component built with LitElement,
which provides keyboard navigation, scrollable tab headers, and automatic panel management without requiring Shadow DOM or external dependencies.

## Installation

      npm install @toujou/toujou-tabs

---

## Features

- Accessible tab navigation (ARIA-based)
- Keyboard support (Arrow keys, Home, End)
- Scrollable tab headers with overflow controls
- Automatic panel switching
- Custom events for integration
- No Shadow DOM

---

## Usage

```html
<toujou-tabs>
    <div class="tabs__buttons">
        <button class="tabs__button" id="tab-1" aria-controls="panel-1" aria-selected="true">
            Tab 1
        </button>
        <button class="tabs__button" id="tab-2" aria-controls="panel-2">
            Tab 2
        </button>
    </div>

    <div class="tabs__panels">
        <div class="tabs__panel" id="panel-1">Content 1</div>
        <div class="tabs__panel" id="panel-2" hidden>Content 2</div>
    </div>

    <button class="tabs__scroll-button--prev" aria-label="Scroll left"></button>
    <button class="tabs__scroll-button--next" aria-label="Scroll right"></button>
</toujou-tabs>
```

---

## Events

| Event                       | Description                                       |
|-----------------------------|---------------------------------------------------|
| toujou-tabs-ready           | Fired when the component is initialized           |
| toujou-tabs-change          | Fired when the selected tab changes               |
| toujou-tabs-scroll          | Fired when the tab headers are scrolled           |
| toujou-tabs-overflow-change | Fired when the tab headers overflow state changes |

---

## Notes

- The first tab with aria-selected="true" will be used as the initial active tab.
- If none is set, the first tab will be activated automatically.
- Panels are matched via aria-controls and element id.
