import {render as domRender, RenderPosition, replace} from '../utils';
import Filters from '../components/Filters';
import {FilterType} from '../config/const';
import {getTasksByFilter} from '../utils/filter.js';

export default class FilterController {

  constructor(component, model) {
    this._component = component;
    this._model = model;
    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;
    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._model.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const allTasks = this._model.getTasksAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        title: filterType,
        count: getTasksByFilter(allTasks, filterType).length,
        isChecked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new Filters(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      domRender(this._component, this._filterComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._model.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
