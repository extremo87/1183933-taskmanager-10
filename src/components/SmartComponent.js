import {Component} from "./Component";

export default class SmartComponent extends Component {

  recoveryListeners() {
    throw new Error(`You should to implement recoveryListeners in child class.`);
  }

  rerender() {
    const oldElement = this.getElement();
    const parentElement = oldElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parentElement.replaceChild(oldElement, newElement);
    this.recoveryListeners();
  }


}
