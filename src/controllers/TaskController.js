import Task from "../components/Тask";
import Form from "../components/Form";
import {render as domRender, RenderPosition, replace, remove} from "../utils";
import {COLOR} from '../config/const';
import TaskModel from '../models/task';

export const Mode = {
  ADD: `add`,
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

const SHAKE_ANIMATION_TIMEOUT = 600;


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

  render(task, mode) {

    const oldTaskComponent = this._taskComponent;
    const oldFormComponent = this._formComponent;
    this._mode = mode;

    this._taskComponent = new Task(task);
    this._formComponent = new Form(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._onViewChange();
      this.replaceWithForm();
      document.addEventListener(`keydown`, this.onEscKeyDown);
    });

    this._taskComponent.setFavouriteButtonClickHandler(() => {
      const newTask = TaskModel.clone(task);
      newTask.isFavorite = !newTask.isFavorite;
      this._onDataChange(this, task, newTask);
    });
    this._taskComponent.setArchiveButtonClickHandler(() => {
      const newTask = TaskModel.clone(task);
      newTask.isArchive = !newTask.isArchive;
      this._onDataChange(this, task, newTask);
    });
      
    this._formComponent.setSubmitButtonHandler((evt) => {
      evt.preventDefault();

      this._formComponent.setData({
        saveButtonText: `Saving...`,
      });

      const data = this._formComponent.getData();

      console.log(data);

      this._onDataChange(this, task, data);
      this.replaceWithTask();
    });

    this._formComponent.setDeleteButtonHandler(() => {
      this._formComponent.setData({
        deleteButtonText: `Deleting...`,
      });
      this._onDataChange(this, task, null);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskComponent && oldFormComponent) {
          replace(this._taskComponent, oldTaskComponent);
          replace(this._formComponent, oldFormComponent);
        } else {
          domRender(this._container, this._taskComponent.getElement(), RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADD:
        if (oldFormComponent && oldTaskComponent) {
          remove(oldTaskComponent);
          remove(oldFormComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        domRender(this._container, this._formComponent.getElement(), RenderPosition.AFTERBEGIN);
        break;
    }


  }

  shake() {
    this._formComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._taskComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._formComponent.getElement().style.animation = ``;
      this._taskComponent.getElement().style.animation = ``;

      this._formComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

}
