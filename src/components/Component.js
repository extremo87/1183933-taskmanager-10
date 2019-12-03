import {createElement} from '../utils';

export default class Component {
  constructor() {
    this._element = null;
  }

  getTemplate() {}

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element.remove();
  }
}
