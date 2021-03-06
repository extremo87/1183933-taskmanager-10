import {createElement} from '../utils';

export default class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  removeFromDOM() {
    this._element.remove();
  }
}

