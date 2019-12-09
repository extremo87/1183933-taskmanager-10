import Component from './Component';

export default class Sort extends Component {

  constructor() {
    super();
    this._sortType = this.sortTypes.DEFAULT;
  }


  sortTypes() {
    return {
      DATE_DOWN: `date-down`,
      DATE_UP: `date-up`,
      DEFAULT: `default`,
    };
  }


  getTemplate() {

    return (
      `<div class="board__filter-list">
        <a href="#" data-sort-order=${this.sortTypes().DEFAULT} class="board__filter">SORT BY DEFAULT</a>
        <a href="#" data-sort-order=${this.sortTypes().DATE_UP} class="board__filter">SORT BY DATE up</a>
        <a href="#" data-sort-order=${this.sortTypes().DATE_DOWN} class="board__filter">SORT BY DATE down</a>
      </div>`
    );
  }

  setOnClickHandler(handler) {
    this.getElement().addEventListener(`click`, (e) => {
      e.preventDefault();

      if (e.target.tagName !== `A`) {
        return;
      }

      const sortType = e.target.dataset.sortOrder;

      if (this._sortType === sortType) {
        return;
      }
      this._sortType = sortType;

      handler(this._sortType);
    });
  }
}

