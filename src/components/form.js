import moment from 'moment';
import {colors, week} from '../config';
import SmartComponent from './SmartComponent';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/light.css';
import {DAYS} from '../config/const';
import he from 'he';
import Adapter from '../models/task.js';

const parseFormData = (formData) => {
  const repeatingDays = DAYS.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});
  const date = formData.get(`date`);

  const selectedDays = formData.getAll(`repeat`).reduce((acc, it) => {
    acc[it] = true;
    return acc;
  }, repeatingDays);

  const isRepeatedDays = Object.values(selectedDays).some(Boolean);

  return new Adapter({
    'description': he.encode(formData.get(`text`)),
    'color': formData.get(`color`),
    'tags': formData.getAll(`hashtag`),
    'due_date': date ? new Date(date) : null,
    'isRepeated': isRepeatedDays,
    'repeating_days': formData.getAll(`repeat`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays),
    'is_favorite': false,
    'is_done': false,
  });
};

const renderTag = (tag) => {
  return (`
      <span class="card__hashtag-inner">
        <input
          type="hidden"
          name="hashtag"
          value="${tag}"
          class="card__hashtag-hidden-input"
        />
        <p class="card__hashtag-name">
          #${tag}
        </p>
        <button type="button" class="card__hashtag-delete">
          delete
        </button>
      </span>
  `);
};

const renderColor = (color, currentColor) => {
  return (`
  <input
    type="radio"
    id="color-${color}-4"
    class="card__color-input card__color-input--${color} visually-hidden"
    name="color"
    value="${color}"
    ${currentColor === color ? `checked` : ``}
  />
  <label
          for="color-${color}-4"
          class="card__color card__color--${color}"
          >${color}</label
    >
  `);
};

const createRepeatingDaysMarkup = (weekDays, repeatingDays) => {
  return weekDays
    .map((day) => {
      const isChecked = repeatingDays[day];
      return (
        `<input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-${day}-4"
          name="repeat"
          value="${day}"
          ${isChecked ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-${day}-4"
          >${day}</label
        >`
      );
    })
    .join(`\n`);
};

const minLength = (input) => {
  return input.length >= 1;
};

const maxLength = (input) => {
  return input.length <= 144;
};

export const createTaskFormTemplate = (task, options = {}) => {
  const {tags, description, color} = task;
  const {isDateShowing, isRepeated, repeatingDays, dueDate, currentDescription} = options;
  const date = dueDate instanceof Date ? moment(dueDate).format(`D MMMM h:mm a`) : false;
  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const repeatClass = isRepeated ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;
  const repeatingDaysMarkup = createRepeatingDaysMarkup(week, repeatingDays);

  const validate = () => {
    if (isRepeated && !Object.values(repeatingDays).some(Boolean)) {
      return false;
    }
    if (!minLength(currentDescription) || !maxLength(currentDescription)) {
      return false;
    }
    return true;


    // TODO: date validation

  };


  return (`
      <article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>
        
      <div class="card__textarea-wrap">
        <label>
          <textarea
            class="card__text"
            placeholder="Start typing your text here..."
            name="text"
          >${description}</textarea>
        </label>
      </div>
        
      <div class="card__settings">
        <div class="card__details">
          <div class="card__dates">
            <button class="card__date-deadline-toggle" type="button">
              date: <span class="card__date-status">${ isDateShowing ? `YES` : `NO`}</span>
            </button>
            ${
    (isDateShowing) ?
      `<fieldset class="card__date-deadline">
                     <label class="card__input-deadline-wrap">
                      <input
                        class="card__date"
                        type="text"
                        placeholder=""
                        name="date"
                        value="${date}"
                    />
                  </label>
                </fieldset>`
      : ``
    }
  
                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${ isRepeated ? `yes` : `no` }</span>
                </button>
  
                <fieldset class="card__repeat-days">
                  <div class="card__repeat-days-inner">
                  ${
    isRepeated ?
      `<fieldset class="card__repeat-days">
        <div class="card__repeat-days-inner">
          ${repeatingDaysMarkup}
        </div>
      </fieldset>`
      : ``
    }
                    
                  </div>
                </fieldset>
              </div>
  
              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${Array.from(tags).map((tag) => renderTag(tag)).join(`\n`)}
                </div>
  
                <label>
                  <input
                    type="text"
                    class="card__hashtag-input"
                    name="hashtag-input"
                    placeholder="Type new hashtag here"
                  />
                </label>
              </div>
            </div>
  
            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colors.map((item) => renderColor(item, color)).join(`\n`)}
              </div>
            </div>
          </div>
  
          <div class="card__status-btns">
            <button class="card__save" type="submit" ${(validate()) ? `` : `disabled`}>save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`);
};

export default class Form extends SmartComponent {
  constructor(task) {
    super();
    this._task = task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeated = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._dueDate = task.dueDate;
    this._formHandler = null;
    this._deleteButtonHandler = null;
    this._flatpickr = null;
    this._currentDescription = task.description;
    this.recoveryListeners();
    this._applyFlatpickr();
  }

  getTemplate() {
    return createTaskFormTemplate(this._task, {
      isDateShowing: this._isDateShowing,
      isRepeated: this._isRepeated,
      repeatingDays: this._activeRepeatingDays,
      dueDate: this._dueDate,
      currentDescription: this._currentDescription
    });
  }

  setSubmitButtonHandler(handler) {
    this._formHandler = handler;
    this.getElement().querySelector(`.card__save`).addEventListener(`click`, handler);
  }

  setDeleteButtonHandler(handler) {
    this._deleteButtonHandler = handler;
    this.getElement().querySelector(`.card__delete`).addEventListener(`click`, handler);
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  getData() {
    const form = this.getElement().querySelector(`.card__form`);
    const formData = new FormData(form);

    return parseFormData(formData);
  }

  reset() {
    const task = this._task;

    this._isDateShowing = !!task.dueDate;
    this.isRepeated = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);

    this.rerender();
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);
      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._dueDate,
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
      });
    }
  }

  recoveryListeners() {
    const element = this.getElement();

    element.querySelector(`.card__text`)
    .addEventListener(`input`, (evt) => {
      this._currentDescription = evt.target.value;

      const saveButton = this.getElement().querySelector(`.card__save`);
      saveButton.disabled = (!minLength(this._currentDescription) || !maxLength(this._currentDescription));
    });

    element.querySelector(`.card__save`).addEventListener(`click`, this._formHandler);

    const dateElement = element.querySelector(`.card__date`);
    if (dateElement) {
      dateElement.addEventListener(`change`, (evt) => {
        this._dueDate = evt.target.value;
        this.rerender();
      });
    }

    element.querySelector(`.card__color-input`)
      .addEventListener(`click`, () => {
        this._isDateShowing = !this._isDateShowing;
        this.rerender();
      });

    element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => {
        this._isDateShowing = !this._isDateShowing;
        this.rerender();
      });

    element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => {
        this._isRepeated = !this._isRepeated;
        this.rerender();
      });

    const repeatDays = element.querySelector(`.card__repeat-days`);
    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {
        this._activeRepeatingDays[evt.target.value] = evt.target.checked;
        this.rerender();
      });
    }
  }

  getState() {
    return {
      isRepeated: this._isRepeated,
      repeatingDays: this._activeRepeatingDays,
      dueDate: this._dueDate
    };
  }

}
