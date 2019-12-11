import Tasks from '../components/tasks';
import Sort from '../components/Sort';
import Button from '../components/Button';
import Missing from '../components/Missing';
import {ITEMS_PER_PAGE} from '../config';
import {render as domRender, RenderPosition} from '../utils';
import TaskController from './TaskController';
import Filters from '../components/Filters';
import {getFilters} from '../mocks/filters';

export default class BoardController {

  constructor(component, filters) {
    this._tasks = [];
    this._component = component;
    this._sortComponent = new Sort();
    this._btnLoad = new Button();
    this._tasksContainer = new Tasks();
    this._missing = new Missing();
    this._filters = filters;

    // binding context
    this._onDataChange = this._onDataChange.bind(this);
  }

  render(items) {

    this._tasks = items;

    const isEverythingDone = this._tasks.every((task) => task.isArchive);

    const renderTasks = (position, tasks) => {
      tasks.forEach((task) => {

        const taskController = new TaskController(position, this._onDataChange);
        taskController.render(task);
      });
    };

    const renderButton = () => {
      if (tasksOnPage > this._tasks.length) {
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
      domRender(this._component.getElement(), this._tasksContainer.getElement(), RenderPosition.BEFOREEND);
    } else {
      domRender(this._component.getElement(), new Missing().getElement(), RenderPosition.AFTERNODE);
      return;
    }

    const taskListElement = this._component.getElement().querySelector(`.board__tasks`);

    let tasksOnPage = ITEMS_PER_PAGE;
    renderTasks(taskListElement, this._tasks.slice(0, tasksOnPage));
    renderButton();

    this._sortComponent.setOnClickHandler((sortOrder) => {
      const sortTypes = this._sortComponent.sortTypes;
      let tasks = [];
      switch (sortOrder) {
        case sortTypes().DEFAULT:
          tasks = this._tasks.slice(0, tasksOnPage);
          break;
        case sortTypes().DATE_DOWN:
          tasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
          break;
        case sortTypes().DATE_UP:
          tasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
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
  _onDataChange(controller, oldObject, newObject) {
    const index = this._tasks.findIndex((object) => object === oldObject);

    if (index === -1) {
      return;
    }
    this._tasks[index] = newObject;
    controller.render(newObject);
    this.updateFilters(this._tasks);
  }

  updateFilters(tasks) {
    const oldFilters = this._filters.getElement();
    this._filters = new Filters(getFilters(tasks));
    oldFilters.replaceWith(this._filters.getElement());
  }

}

