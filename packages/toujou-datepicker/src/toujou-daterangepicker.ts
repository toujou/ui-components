import { customElement, property } from 'lit/decorators.js';
import Flatpickr from 'flatpickr';
import { dateFromIso, formatDateToIsoDateString } from './utils/toujou-datepicker-utils';
import { ToujouDatepicker } from './toujou-datepicker';

@customElement('toujou-daterangepicker')
class ToujouDaterangepicker extends ToujouDatepicker {
  @property({ type: String }) mode: 'range' = 'range' as const;

  constructor() {
    super();
    this._onDateRangeChange = this._onDateRangeChange.bind(this);
  }

  createRenderRoot() {
    return this;
  }

  get dateFromInput(): HTMLInputElement | null {
    return this.querySelector('.date-range--from');
  }

  get dateUntilInput(): HTMLInputElement | null {
    return this.querySelector('.date-range--until');
  }

  get dateFacedInput(): HTMLInputElement | null {
    return this.querySelector('.date-range--facade');
  }

  get flatpickr(): Flatpickr.Instance {
    if (!this.dateFacedInput) {
      throw new Error('Facade is missing');
    }

    if (Object.prototype.hasOwnProperty.call(this.dateFacedInput, '_flatpickr') === false) {
      throw new Error('Flatpickr is not initialized');
    }

    return (this.dateFacedInput as any)._flatpickr;
  }

  connectedCallback(): void {
    super.connectedCallback();

    if (this.dateFacedInput) {
      this._initDatepicker(this.dateFacedInput);
      this.dateFacedInput.addEventListener('change', this._onDateRangeChange);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.dateFacedInput) {
      this.dateFacedInput.removeEventListener('change', this._onDateRangeChange);
    }
  }

  firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
    super.firstUpdated(_changedProperties);

    const dates: Date[] = [];
    const dateFromIsoString = this.dateFromInput?.value;
    const dateUntilIsoString = this.dateUntilInput?.value;

    if (dateFromIsoString && dateFromIsoString !== '') {
      dates.push(dateFromIso(dateFromIsoString));
    }

    if (dateUntilIsoString && dateUntilIsoString !== '') {
      dates.push(dateFromIso(dateUntilIsoString));
    }

    this.flatpickr.setDate(dates);
  }

  private _onDateRangeChange(): void {
    const { selectedDates } = this.flatpickr;

    if (this.dateFromInput && selectedDates[0]) {
      this.dateFromInput.value = formatDateToIsoDateString(selectedDates[0]);
    }

    if (this.dateUntilInput && selectedDates[selectedDates.length - 1]) {
      this.dateUntilInput.value = formatDateToIsoDateString(selectedDates[selectedDates.length - 1]);
    }
  }
}
