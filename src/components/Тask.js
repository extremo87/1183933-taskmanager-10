import moment from 'moment';
import {isExpired} from '../utils';
import SmartComponent from './SmartComponent';

const renderTag = (tag) => {
  return (`
            <span class="card__hashtag-inner">
            <span class="card__hashtag-name">
                #${tag}
            </span>
            </span>
        `);
};

export const createTaskTemplate = (task) => {
  const {description, tags, dueDate, color, repeatingDays} = task;
  const m = moment(dueDate);
  const cardTime = m.isValid() && m.format(`h:mm a`);
  const cardDate = m.isValid() && m.format(`D MMMM`);
  const deadlineClass = isExpired(dueDate) ? `card--deadline` : ``;
  const repeatClass = Object.values(repeatingDays).some(Boolean) ? `card--repeat` : ``;

  return (`<article class="card card--${color} ${repeatClass} ${deadlineClass}">
          <div class="card__form">
          <div class="card__inner">
              <div class="card__control">
              <button type="button" class="card__btn card__btn--edit">
                  edit
              </button>
              <button type="button" class="card__btn card__btn--archive ${!task.isArchive ? `card__btn--disabled` : ``}">
                  archive
              </button>
              <button
                  type="button"
                  class="card__btn card__btn--favorites ${!task.isFavorite ? `card__btn--disabled` : ``}"
              >
                  favorites
              </button>
              </div>
  
              <div class="card__color-bar">
              <svg class="card__color-bar-wave" width="100%" height="10">
                  <use xlink:href="#wave"></use>
              </svg>
              </div>
  
              <div class="card__textarea-wrap">
              <p class="card__text">${description}</p>
              </div>
  
              <div class="card__settings">
              <div class="card__details">
                  <div class="card__dates">
                  <div class="card__date-deadline">
                      <p class="card__input-deadline-wrap">
                      <span class="card__date">${cardDate ? cardDate : ``}</span>
                      <span class="card__time">${cardTime ? cardTime : ``}</span>
                      </p>
                  </div>
                  </div>
  
                  <div class="card__hashtag">
                  <div class="card__hashtag-list">
                      ${Array.from(tags).map((tag) => renderTag(tag)).join(`\n`)}
                  </div>
                  </div>
              </div>
              </div>
          </div>
          </div>
      </article>`);
};

export default class Task extends SmartComponent {
  constructor(task) {
    super();
    this._task = task;
    this._setEditButtonClickHandler = null;
    this._setFavouriteButtonClickHandler = null;
    this._setArchiveButtonClickHandler = null;

  }

  getTemplate() {
    return createTaskTemplate(this._task);
  }

  setEditButtonClickHandler(handler) {
    this._setEditButtonClickHandler = handler;
    this.getElement().querySelector(`.card__btn--edit`)
      .addEventListener(`click`, handler);
  }

  setFavouriteButtonClickHandler(handler) {
    this._setFavouriteButtonClickHandler = handler;
    this.getElement().querySelector(`.card__btn--favorites`)
      .addEventListener(`click`, handler);
  }

  setArchiveButtonClickHandler(handler) {
    this._setArchiveButtonClickHandler = handler;
    this.getElement().querySelector(`.card__btn--archive`)
      .addEventListener(`click`, handler);
  }

  recoveryListeners() {
    const element = this.getElement();
    element.querySelector(`.card__btn--favorites`)
      .addEventListener(`click`, this._setFavouriteButtonClickHandler);

    element.querySelector(`.card__btn--archive`)
      .addEventListener(`click`, this._setArchiveButtonClickHandler);

    element.querySelector(`.card__btn--edit`)
      .addEventListener(`click`, this._setEditButtonClickHandler);
  }

}
