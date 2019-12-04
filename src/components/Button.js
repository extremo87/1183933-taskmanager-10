import Component from './Component';

const createBtnTemplate = () => {
  return (`<button class="load-more" type="button">load more</button>`);
};

export default class Button extends Component {
  getTemplate() {
    return createBtnTemplate();
  }
}

