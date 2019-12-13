import Component from './Component';

export const createFiltersTemplate = (filters) => {

  const renderFilter = (item, isChecked) => {
    const {title, count} = item;
    return (`
      <input
          type="radio"
          id="filter__${title}"
          class="filter__input visually-hidden"
          name="filter"
          ${isChecked ? `checked` : ``}

          ${count === 0 ? `disabled` : ``}
      />
      <label for="filter__${title}" class="filter__label">
        ${title} <span class="filter__${title}-count"> ${count}</span>
      </label>`
    );
  };

  return (`
    <section class="main__filter filter container">
    ${(filters.map((filter) => renderFilter(filter, false))).join(`\n`)}
    </section>
  `);
};

export default class Filter extends Component {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }


}
