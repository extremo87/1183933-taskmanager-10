import {Component} from "./Component";

export default class SmartComponent extends Component {
  constructor() {
    super();

    if (new.target === SmartComponent) {
      throw new Error(`Can't instantiate SmartComponent, only concrete one.`);
    }
  }

  rerender() {
    return;
  }


}
