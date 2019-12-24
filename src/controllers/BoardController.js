import Tasks from '../components/tasks';
import Sort from '../components/Sort';
import Button from '../components/Button';
import Missing from '../components/Missing';
import {ITEMS_PER_PAGE} from '../config';
import {render as domRender, RenderPosition, remove} from '../utils';
import TaskController, {Mode as TaskControllerMode, EmptyTask} from './TaskController';


export default class BoardController {

  constructor(component, taskModel) {
    this._tasks = [];
    this._component = component;
    this._sortComponent = new Sort();
    this._btnLoad = new Button();
    this._tasksContainer = new Tasks();
    this._missing = new Missing();
    this._renderedControllers = [];
    this._taskModel = taskModel;
    this._showingTasksCount = ITEMS_PER_PAGE;
    this._createForm = null;

    // binding context
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setOnClickHandler(this._onSortTypeChange);
    this._taskModel.setFilterChangeHandler(this._onFilterChange);
  }

  createTask() {
    if (this._createForm) {
      return;
    }

    const taskListElement = this._tasksContainer.getElement();
    this._createForm = new TaskController(taskListElement, this._onDataChange, this._onViewChange);
    this._createForm.render(EmptyTask, TaskControllerMode.ADD);
  }


  _renderTasks(position, tasks) {
    return tasks.map((task) => {
      const taskController = new TaskController(position, this._onDataChange, this._onViewChange);
      taskController.render(task, TaskControllerMode.DEFAULT);
      return taskController;
    });
  }

  renderTasks(tasks) {
    const taskListElement = this._tasksContainer.getElement();
    const newTasks = this._renderTasks(taskListElement, tasks);
    this._renderedControllers = this._renderedControllers.concat(newTasks);
    this._showingTasksCount = this._renderedControllers.length;
  }

  render() {

    this._tasks = this._taskModel.getTasks();

    const isEverythingDone = this._tasks.every((task) => task.isArchive);

    if (!isEverythingDone) {
      domRender(this._component.getElement(), this._sortComponent.getElement(), RenderPosition.BEFOREEND);
      domRender(this._component.getElement(), this._tasksContainer.getElement(), RenderPosition.BEFOREEND);
    } else {
      domRender(this._component.getElement(), new Missing().getElement(), RenderPosition.AFTERNODE);
      return;
    }

    const taskListElement = this._component.getElement().querySelector(`.board__tasks`);
    this._renderedControllers = this._renderTasks(taskListElement, this._tasks.slice(0, this._showingTasksCount));
    this._renderLoadMoreButton();

  }

  _onSortTypeChange(sortType) {
    let tasks = [];
    const tasksModel = this._taskModel.getTasks();
    const sortTypes = this._sortComponent.sortTypes;

    switch (sortType) {
      case sortTypes().DEFAULT:
        tasks = tasksModel.slice(0, ITEMS_PER_PAGE);
        break;
      case sortTypes().DATE_UP:
        tasks = tasksModel.slice().sort((a, b) => a.dueDate - b.dueDate);
        break;
      case sortTypes().DATE_DOWN:
        tasks = tasksModel.slice().sort((a, b) => b.dueDate - a.dueDate);
        break;
    }

    this._removeTasks();
    this.renderTasks(tasks);

    if (sortType === sortTypes().DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._btnLoad);
    }
  }


  _renderLoadMoreButton() {
    remove(this._btnLoad);

    if (this._showingTasksCount >= this._taskModel.getTasks().length) {
      return;
    }
    domRender(this._component.getElement(), this._btnLoad.getElement(), RenderPosition.BEFOREEND);
    this._btnLoad.setClickhandler(this._onLoadMoreButtonClick);
  }

  _onLoadMoreButtonClick() {
    const prevTasksCount = this._showingTasksCount;

    const tasks = this._taskModel.getTasks();

    this._showingTasksCount = this._showingTasksCount + ITEMS_PER_PAGE;

    this.renderTasks(tasks.slice(prevTasksCount, this._showingTasksCount));

    if (this._showingTasksCount >= tasks.length) {
      remove(this._btnLoad);
    }
  }

  _onDataChange(controller, oldObject, newObject) {
    if (oldObject === EmptyTask) {

      this._createForm = null;
      if (newObject === null) {
        controller.destroy();
        this._updateTasks(this._showingTasksCount);
      } else {
        this._taskModel.addTask(newObject);
        controller.render(newObject, TaskControllerMode.DEFAULT);

        const destroyedTask = this._renderedControllers.pop();
        destroyedTask.destroy();

        this._renderedControllers = [].concat(controller, this._renderedControllers);

        this._showingTasksCount = this._renderedControllers.length;
      }
    } else if (newObject === null) {
      this._taskModel.removeTask(oldObject.id);
      this._updateTasks(this._showingTasksCount);
    } else {
      const isSuccess = this._taskModel.updateTask(oldObject.id, newObject);

      if (isSuccess) {
        controller.render(newObject, TaskControllerMode.DEFAULT);
      }
    }
  }

  _removeTasks() {
    this._renderedControllers.forEach((taskController) => taskController.destroy());
    this._renderedControllers = [];
  }

  _updateTasks(count) {
    this._removeTasks();
    this.renderTasks(this._taskModel.getTasks().slice(0, count));
    this._renderLoadMoreButton();
  }

  _onViewChange() {
    this._renderedControllers.forEach((controller) => controller.setDefaultView());
  }

  _onFilterChange() {
    this._updateTasks(ITEMS_PER_PAGE);
  }

  hide() {
    this._component.hide();
  }

  show() {
    this._component.show();
  }

}

