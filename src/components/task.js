import moment from 'moment';
import {isExpired} from '../utils';
import Component from './Component';

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
              <button type="button" class="card__btn card__btn--archive">
                  archive
              </button>
              <button
                  type="button"
                  class="card__btn card__btn--favorites card__btn--disabled"
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

export default class Task extends Component {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createTaskTemplate(this._task);
  }
}
