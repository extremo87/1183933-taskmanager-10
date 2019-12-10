import Task from "../components/Тask";
import Form from "../components/Form";
import {render as domRender, RenderPosition} from "../utils";

export default class TaskController {
  constructor(container) {
    this._container = container;
  }

  render(task) {
    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
      if (isEscKey) {
        replaceWithTask();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const taskComponent = new Task(task);
    const formComponent = new Form(task);

    taskComponent.setEditButtonClickHandler(() => {
      taskComponent.getElement().replaceWith(formComponent.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    const replaceWithTask = () => {
      formComponent.getElement().replaceWith(taskComponent.getElement());
    };

    formComponent.setSubmitButtonHandler(replaceWithTask);

    domRender(this._container, taskComponent.getElement(), RenderPosition.BEFOREEND);
  }
}
