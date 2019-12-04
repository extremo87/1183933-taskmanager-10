import Component from './Component';

const createTasksTemplate = () => {
  return (
    `<div class="board__tasks"></div>`
  );
};

export default class Tasks extends Component {
  getTemplate() {
    return createTasksTemplate();
  }
}

