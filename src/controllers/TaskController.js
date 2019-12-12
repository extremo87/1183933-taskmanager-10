import Task from "../components/Тask";
import Form from "../components/Form";
import {render as domRender, RenderPosition, replace} from "../utils";

export default class TaskController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._taskComponent = null;
    this._formComponent = null;
  }

  render(task) {
    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
      if (isEscKey) {
        replaceWithTask();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    let oldTaskComponent = this._taskComponent;
    let oldFormComponent = this._formComponent;

    this._taskComponent = new Task(task);
    this._formComponent = new Form(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._taskComponent.getElement().replaceWith(this._formComponent.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._taskComponent.setFavouriteButtonClickHandler(() => this._onDataChange(this, task, Object.assign({}, task, {isFavorite: !task.isFavorite})));
    this._taskComponent.setArchiveButtonClickHandler(() => this._onDataChange(this, task, Object.assign({}, task, {isArchive: !task.isArchive})));
    this._formComponent.setSubmitButtonHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, this._formComponent.getState()));
      replaceWithTask();
    });

    const replaceWithTask = () => {
      this._formComponent.getElement().replaceWith(this._taskComponent.getElement());
    };

    if (oldTaskComponent && oldFormComponent) {
      replace(this._taskComponent, oldTaskComponent);
      replace(this._formComponent, oldFormComponent);
    } else {
      domRender(this._container, this._taskComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }
}
