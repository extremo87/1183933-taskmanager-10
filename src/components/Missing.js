import Component from './Component';

export default class Missing extends Component {
  getTemplate() {
    return (
      `<p class="board__no-tasks">
          Click «ADD NEW TASK» in menu to create your first task
        </p>`
    );
  }
}
