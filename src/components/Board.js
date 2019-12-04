import Component from './Component';

const createBoardTemplate = () => {
  return (
    `<section class="board container"></section>`
  );
};


export default class Board extends Component {

  getTemplate() {
    return createBoardTemplate();
  }

}
