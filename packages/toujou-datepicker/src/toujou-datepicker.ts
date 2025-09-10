import { LitElement } from 'lit';
import { property, customElement} from 'lit/decorators.js';
import Flatpickr from 'flatpickr';
import FlatpickrMonthSelect from 'flatpickr/dist/plugins/monthSelect';
import 'flatpickr/dist/l10n/de';
import { monthIsSupported } from './utils/toujou-datepicker-utils';

type ModeType = 'single' | 'time' | 'multiple' | 'range';

@customElement('toujou-datepicker')
export class ToujouDatepicker extends LitElement {
  @property({ type: String }) mode: ModeType = 'single';
  @property({ type: String, attribute: 'date-format' }) dateFormat = 'd.m.Y';
  @property({ type: String, attribute: 'alt-format' }) altFormat: string | null = null;
  @property({ type: String }) minDate: string | null = null;
  @property({ type: String }) maxDate: string | null = null;
  @property({ type: Boolean }) enableTime = false;
  @property({ type: Boolean }) monthPicker = false;
  @property({ type: Number, attribute: 'show-months' }) showMonths = 1;

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    const locale = document.documentElement.getAttribute('lang') || 'en-US';
    const localeRoot = locale.substring(0, 2);
    if (Flatpickr.l10ns[localeRoot]) {
      Flatpickr.localize(Flatpickr.l10ns[localeRoot]);
    }

    const inputElement = this.querySelector('input') as HTMLInputElement;
    if (inputElement) {
      this._initDatepicker(inputElement);
    }
  }

  _initDatepicker(inputElement: HTMLInputElement) {
    const confObj: Flatpickr.Options.Options = {
      dateFormat: this.dateFormat,
      altInput: this.altFormat !== null,
      altFormat: this.altFormat || this.dateFormat,
      minDate: this.minDate,
      maxDate: this.maxDate,
      enableTime: this.enableTime,
      time_24hr: true,
      allowInput: false,
      mode: this.mode,
      showMonths: this.showMonths,
      onClose: (selectedDates, dateStr, instance) => {
        const closeEvent = new CustomEvent('close', {
          bubbles: true,
          composed: true,
          detail: { selectedDates, dateStr, instance, },
        });
        inputElement.dispatchEvent(closeEvent);
      },
      onOpen: (selectedDates, dateStr, instance) => {
        const openEvent = new CustomEvent('open', {
          bubbles: true,
          composed: true,
          detail: { selectedDates, dateStr, instance },
        });
        inputElement.dispatchEvent(openEvent);
      },
    };

    if (this.monthPicker) {
      const defaultMonthDateFormat = 'F Y';
      confObj.altInput = true;
      if (window.navigator.maxTouchPoints === 0 || !monthIsSupported()) {
        confObj.plugins = [ FlatpickrMonthSelect({ altFormat: defaultMonthDateFormat }) ];
      } else {
        confObj.altFormat = defaultMonthDateFormat;
      }
    }

    const valueAttribute = inputElement.getAttribute('value');
    if (valueAttribute && valueAttribute !== '') {
      try {
        confObj.defaultDate = Flatpickr.parseDate(valueAttribute, this.dateFormat);
      } catch (e) {
        // invalid date: skip
      }
    }

    Flatpickr(inputElement, confObj);
  }
}
