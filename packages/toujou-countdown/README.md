# Toujou Countdown

Accessible countdown component built as a native Web Component.
It displays the remaining time until a target date and provides custom events and CSS states for integration and styling.

## Installation

      npm install @toujou/toujou-countdown

---

## Features

- Countdown calculation based on an ISO date string
- Automatic updates every second
- Days, hours, minutes, and seconds display
- Finished state handling
- Custom event when the countdown reaches zero
- CSS-based configuration options
- No Shadow DOM

---

## Usage

```html
<toujou-countdown
    class="countdown"
    target-date="2026-08-01T12:00:00.000Z"
    role="timer"
    aria-label="Countdown"
>
    <div class="countdown__counter" aria-hidden="true">
        <div class="countdown__item" data-unit="days">
            <span class="countdown__value">0</span>
            <span class="countdown__label">Days</span>
        </div>

        <span class="countdown__separator"></span>

        <div class="countdown__item" data-unit="hours">
            <span class="countdown__value">00</span>
            <span class="countdown__label">Hours</span>
        </div>

        <span class="countdown__separator"></span>

        <div class="countdown__item" data-unit="minutes">
            <span class="countdown__value">00</span>
            <span class="countdown__label">Minutes</span>
        </div>

        <span class="countdown__separator"></span>

        <div class="countdown__item" data-unit="seconds">
            <span class="countdown__value">00</span>
            <span class="countdown__label">Seconds</span>
        </div>
    </div>

    <div class="countdown__message">
        <h3>Countdown finished!</h3>
        <p>The countdown has ended.</p>
    </div>
</toujou-countdown>
```

---

## Attributes

| Attribute                  | Description                                                         |
|----------------------------|---------------------------------------------------------------------|
| target-date                | Target date/time in a format accepted by JavaScript `Date`          |
| hide-labels                | Hides all countdown unit labels                                     |
| hide-finished-days         | Allows styling/hiding the days unit once the countdown reaches zero |
| hide-counter-when-finished | Allows hiding the countdown counter after completion                |

---

## Events

| Event                     | Description                                |
|---------------------------|--------------------------------------------|
| toujou-countdown-finished | Fired once when the countdown reaches zero |

The event contains the countdown element in the event detail:

```js
element.addEventListener('toujou-countdown-finished', (event) => {
    console.log(event.detail.element);
});
```

---

## States

The component exposes CSS states that can be used for styling.

### Finished state

When the countdown reaches zero, the component receives:

```html
<toujou-countdown countdown-finished>
```

The days item also receives:

```html
<div class="countdown__item" data-unit="days" data-state="finished">
```

---

## Notes

- The component updates the countdown every second.
- `target-date` changes are automatically detected and restart the countdown.
- Invalid dates are ignored and logged as warnings.
- The component requires the countdown value elements (`.countdown__value`) to be present in the markup.
- The component uses `aria-hidden="true"` for the markup hat should be visible only. The accessible name should be provided through the countdown element itself.
