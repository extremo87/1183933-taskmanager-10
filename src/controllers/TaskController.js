import Task from "../components/Тask";
import Form from "../components/Form";
import {render as domRender, RenderPosition, replace, remove} from "../utils";
import {COLOR} from '../config/const';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    'mo': false,
    'tu': false,
    'we': false,
    'th': false,
    'fr': false,
    'sa': false,
    'su': false,
  },
  tags: [],
  color: COLOR.BLACK,
  isFavorite: false,
  isArchive: false,
};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._taskComponent = null;
    this._formComponent = null;
    this._mode = Mode.DEFAULT;
  }

  setDefaultView() {
    if (this._mode === Mode.EDIT) {
      this.replaceWithTask();
      this._mode = Mode.DEFAULT;
    }
  }

  get mode() {
    return this._mode;
  }

  replaceWithTask() {
    this._formComponent.reset();
    this._formComponent.getElement().replaceWith(this._taskComponent.getElement());
    this._mode = Mode.DEFAULT;
  }

  replaceWithForm() {
    this._taskComponent.getElement().replaceWith(this._formComponent.getElement());
    this._mode = Mode.EDIT;
  }

  destroy() {
    remove(this._formComponent);
    remove(this._taskComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this.replaceWithTask();
    }
  }

  render(task) {

    const oldTaskComponent = this._taskComponent;
    const oldFormComponent = this._formComponent;

    this._taskComponent = new Task(task);
    this._formComponent = new Form(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._onViewChange();
      this.replaceWithForm();
      document.addEventListener(`keydown`, this.onEscKeyDown);
    });

    this._taskComponent.setFavouriteButtonClickHandler(() => this._onDataChange(this, task, Object.assign({}, task, {isFavorite: !task.isFavorite})));
    this._taskComponent.setArchiveButtonClickHandler(() => this._onDataChange(this, task, Object.assign({}, task, {isArchive: !task.isArchive})));
    this._formComponent.setSubmitButtonHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, this._formComponent.getState()));
      this.replaceWithTask();
    });

    if (oldTaskComponent && oldFormComponent) {
      replace(this._taskComponent, oldTaskComponent);
      replace(this._formComponent, oldFormComponent);
    } else {
      domRender(this._container, this._taskComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }
}
