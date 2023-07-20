# Toujou Exit Warning

Show a modal warning to the user when they are about to leave the page

## Installation

      npm install @toujou/toujou-exit-warning


## How to use

### 1. Add a "toujou-exit-warning" attribute to a link:
```html
    <a class="link" target="toujou-exit-warning" href="https://google.com">Link</a>
```

### 2. Add the exit warning element to the page
```html
    <exit-warning title="Sie sind dabei die Seite zu verlassen">
        <template>
            <span id="c283"></span>
            <p>Sie werden in <strong>${secondsRemaining} Sekunden</strong> auf die Seite <a href="${targetUrl}">${targetUrl}</a> weitergeleitet. Wenn Sie dies abbrechen wollen, schließen Sie dieses Popup.</p>
        </template>
    </exit-warning>
```

> Notice that this element is called `exit-warning` and not `toujou-exit-warning` (for backwards compatibility)
