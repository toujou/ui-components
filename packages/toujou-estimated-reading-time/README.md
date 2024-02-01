# Toujou Estimated Reading Time

Web component to calculate the estimated reading time of some text

## Installation

      npm install @toujou/toujou-estimated-reading-time

## Markup example
```html
    <toujou-estimated-reading-time class="estimated-reading-time" target-selector="main">
        <span slot="label">Estimated reading time:</span>
    </toujou-estimated-reading-time>
```

## Attributes

### class [required]
The `estimated-reading-time` class is required for the element to be displayed correctly

### target-selector [required]
The `target-selector` attribute defines the container from which we will get the word count to estimate the reading time

### reading-speed
With the `reading-speed` attribute we can set a different reading speed. The default is 250 words per minute.

### minutes-singular-text
The `minutes-singular-text` attribute gives us the opportunity to set custom text for the word `minute`.

Default is `minute`

Example:
```html
    <toujou-estimated-reading-time class="estimated-reading-time" target-selector="main" minutes-singular-text="Minuto">
        <span slot="label">Tempo de leitura:</span>
    </toujou-estimated-reading-time>

renders: "Tempo de leitura: 1 Minuto"
```

### minutes-plural-text
The `minutes-plural-text` attribute gives us the opportunity to set custom text for the word `minutes`

Default is `minutes
`
Example:
```html
    <toujou-estimated-reading-time class="estimated-reading-time" target-selector="main" minutes-plural-text="Minutos">
        <span slot="label">Tempo de leitura:</span>
    </toujou-estimated-reading-time>

renders: "Tempo de leitura: 2 Minutos"
```

### less-than-text
The `less-than-text` attribute gives us the opportunity to set custom text for the word `under`.

Default is `under`

Example:
```html
    <toujou-estimated-reading-time class="estimated-reading-time" target-selector="main" minutes-singular-text="minuto" less-than-text="Menos de">
        <span slot="label">Tempo de leitura:</span>
    </toujou-estimated-reading-time>

renders: "Tempo de leitura: Menos de 1 minuto"
```
