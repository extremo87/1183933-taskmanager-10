import Tasks from '../components/tasks';
import Sort from '../components/Sort';
import Button from '../components/Button';
import Form from '../components/Form';
import Missing from '../components/Missing';
import {ITEMS_PER_PAGE} from '../config';
import Task from '../components/Тask';
import {render as domRender, RenderPosition} from '../utils';

export default class BoardController {

  constructor(component) {
    this._component = component;
    this._sortComponent = new Sort();
    this._btnLoad = new Button();
    this._tasks = new Tasks();
    this._missing = new Missing();
  }

  render(items) {
    const isEverythingDone = items.every((task) => task.isArchive);

    const renderTask = (list, task) => {
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

      domRender(list, taskComponent.getElement(), RenderPosition.BEFOREEND);
    };

    const renderTasks = (position, tasks) => {
      tasks.forEach((task) => {
        renderTask(position, task);
      });
    };
    
    const renderButton = () => {
      if (tasksOnPage > items.length) {
        return;
      }
      domRender(this._component.getElement(), this._btnLoad.getElement(), RenderPosition.BEFOREEND);

      this._btnLoad.setClickhandler(() => {
        const prevTasksOnPage = tasksOnPage;
        tasksOnPage += ITEMS_PER_PAGE;
        renderTasks(taskListElement, items.slice(prevTasksOnPage, tasksOnPage));

        if (tasksOnPage > items.length) {
          this._btnLoad.removeElement();
        }
      });
    };


    if (!isEverythingDone) {
      domRender(this._component.getElement(), this._sortComponent.getElement(), RenderPosition.BEFOREEND);
      domRender(this._component.getElement(), this._tasks.getElement(), RenderPosition.BEFOREEND);
    } else {
      domRender(this._component.getElement(), new Missing().getElement(), RenderPosition.AFTERNODE);
      return;
    }

    const taskListElement = this._component.getElement().querySelector(`.board__tasks`);

    let tasksOnPage = ITEMS_PER_PAGE;
    renderTasks(taskListElement, items.slice(0, tasksOnPage));
    renderButton();

    this._sortComponent.setOnClickHandler((sortOrder) => {
      const sortTypes = this._sortComponent.sortTypes;
      let tasks = [];
      switch (sortOrder) {
        case sortTypes().DEFAULT:
          tasks = items.slice(0, tasksOnPage);
          break;
        case sortTypes().DATE_DOWN:
          tasks = items.slice().sort((a, b) => b.dueDate - a.dueDate);
          break;
        case sortTypes().DATE_UP:
          tasks = items.slice().sort((a, b) => a.dueDate - b.dueDate);
          break;
      }

      taskListElement.innerHTML = ``;

      renderTasks(taskListElement, tasks);

      if (sortOrder === sortTypes().DEFAULT) {
        renderButton();
      } else {
        this._btnLoad.removeElement();
      }
    });

  }
}
