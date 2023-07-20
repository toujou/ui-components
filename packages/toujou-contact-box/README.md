# Toujou Contact Box

Accessible contact box with keyboard event handler, focus trapping and body attribute toggle (to prevent body from scrolling when contact box is open)

## Installation

      npm install @toujou/toujou-contact-box

## How to use
```html
<toujou-contact-box class="contact-box">
    <div class="contact-box__card">
        <button class="contact-box__close" aria-label="Close contact box">
            <toujou-icon class="icon" icon-size="ms" icon-name="close" icon-color="font"></toujou-icon>
        </button>

        <div class="contact-box__content" slot="content">
            <h3 class="contact-box__headline">Kontakt</h3>
            <div class="contact-box__items">
                <div class="contact-box__item">
                    <toujou-icon class="icon" icon-size="ms" icon-color="font" icon-name="telephone"></toujou-icon>
                    <a class="contact-box__link" href="#">0911 23980870</a>
                </div>
                <div class="contact-box__item">
                    <toujou-icon class="icon" icon-size="ms" icon-color="font" icon-name="email"></toujou-icon>
                    <a class="contact-box__link" href="#">info@dfau.de</a>
                </div>
                <div class="contact-box__item">
                    <toujou-icon class="icon" icon-size="ms" icon-color="font" icon-name="calendar-day"></toujou-icon>
                    <span class="contact-box__link">Mo. - Fr.: 9:00 - 18:00h</span>
                </div>
            </div>
        </div>
    </div>
</toujou-contact-box>
```
