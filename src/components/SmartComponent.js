import Component from "./Component";

export default class SmartComponent extends Component {

  recoveryListeners() {
    throw new Error(`You should to implement recoveryListeners in child class.`);
  }

  rerender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);

    this.recoveryListeners();
  }


}
