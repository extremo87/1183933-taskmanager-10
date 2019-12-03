import Menu from './components/Menu';
import Filters from './components/Filters';
import Button from './components/Button';
import {COUNT, ITEMS_PER_PAGE} from './config';
import {generateTasks} from './mocks/tasks';
import {getFilters} from './mocks/filters';
import Task from './components/Task';
import Board from './components/Board';
import Sort from './components/Sort';
import Tasks from './components/Tasks';
import Form from './components/Form';
import {render as domRender, RenderPosition} from './utils';

const items = generateTasks(COUNT);
const filters = getFilters(items);
const content = document.querySelector(`.main`);
const header = document.querySelector(`.main__control`);
const render = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

domRender(header, new Menu().getElement(), RenderPosition.BEFOREEND);

domRender(content, new Filters(filters).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new Board();
domRender(content, boardComponent.getElement(), RenderPosition.BEFOREEND);
domRender(boardComponent.getElement(), new Sort().getElement(), RenderPosition.BEFOREEND);
domRender(boardComponent.getElement(), new Tasks().getElement(), RenderPosition.BEFOREEND);

const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

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
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  const form = formComponent.getElement().querySelector(`form`);

  editButton.addEventListener(`click`, () => {
    taskComponent.getElement().replaceWith(formComponent.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const replaceWithTask = () => {
    formComponent.getElement().replaceWith(taskComponent.getElement());
  };

  form.addEventListener(`submit`, () => replaceWithTask());

  domRender(list, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

let tasksOnPage = ITEMS_PER_PAGE;

items.slice(0, tasksOnPage)
    .forEach((task) => {
      renderTask(taskListElement, task);
});

const btnLoad = new Button();

domRender(boardComponent.getElement(), btnLoad.getElement(), RenderPosition.BEFOREEND);

btnLoad.getElement().addEventListener(`click`, () => {
  const prevTasksOnPage = tasksOnPage;
  tasksOnPage += ITEMS_PER_PAGE;
  items.slice(prevTasksOnPage, tasksOnPage).map((item) => renderTask(taskListElement, item)).join(`\n`);

  if (tasksOnPage > items.length) {
    btnLoad.removeElement();
  }
});

