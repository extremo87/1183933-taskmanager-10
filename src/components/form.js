import moment from 'moment';
import {colors, week} from '../config';
import Component from './Component';

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

export const createTaskFormTemplate = (task) => {
  const {tags, description, color, dueDate, repeatingDays} = task;
  const isRepeated = Object.values(repeatingDays).some(Boolean);
  const date = dueDate instanceof Date ? moment(dueDate).format(`D MMMM h:mm a`) : false;
  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const repeatClass = isRepeated ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;
  const repeatingDaysMarkup = createRepeatingDaysMarkup(week, repeatingDays);

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
              date: <span class="card__date-status">${ date ? `YES` : `NO`}</span>
            </button>
            ${
    (date) ?
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
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`);
};

export default class Form extends Component {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createTaskFormTemplate(this._task);
  }

  setSubmitButtonHandler(handler) {
    this.getElement().querySelector(`.card__save`).addEventListener(`click`, handler);
  }
}
