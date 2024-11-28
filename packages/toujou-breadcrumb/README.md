# Toujou Breadcrumb

The `toujou-breadcrumb` is a customizable breadcrumb navigation component built with Lit.

It supports both desktop and mobile views, with items displayed as a standard breadcrumb list in desktop mode and inside a dropdown menu in mobile mode.

The component automatically calculates the breakpoint based on the width of its items.

## Installation

      npm install @toujou/toujou-breadcrumb

## Usage

### Basic structure
```html
<toujou-breadcrumb>
    <button slot="toggle-buttons" class="breadcrumb__toggle">Menu</button>
    <ol slot="list" class="breadcrumb__list">
        <li class="breadcrumb__item"><a href="#">Home</a></li>
        <li class="breadcrumb__item"><a href="#">Category</a></li>
        <li class="breadcrumb__item"><a href="#">Current Page</a></li>
    </ol>
</toujou-breadcrumb>
```

### Slots
- `toggle-buttons`: Slot for the toggle button(s) that control the mobile dropdown menu.
- `list`: Slot for the ordered list (<ol>) containing breadcrumb items.


## Events

The component emits the following custom events:

- `toujou-breadcrumb-connected`: Dispatched when the component is added to the DOM and initialized.
- `toujou-breadcrumb-mode=change`: Dispatched when the breadcrumb switches between mobile and desktop views.
- `toujou-breadcrumb-menu-open`: Dispatched when the mobile view dropdown menu is opened.
- `toujou-breadcrumb-menu-close`: Dispatched when the mobile view dropdown menu is closed.
