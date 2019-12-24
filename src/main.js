import Menu, {MenuItem} from './components/Menu';
import Filters from './components/Filters';
import {generateTasks} from './mocks/tasks';
import {getFilters} from './mocks/filters';
import Board from './components/Board';
import BoardController from './controllers/BoardController';
import {render as domRender, RenderPosition} from './utils';
import TaskModel from './models/tasks.js';
import FilterController from './controllers/FilterController';

const items = generateTasks(30);

const model = new TaskModel();

model.setTasks(items);

const filters = getFilters(items);

const content = document.querySelector(`.main`);
const header = document.querySelector(`.main__control`);
const siteMenuComponent = new Menu();

domRender(header, siteMenuComponent.getElement(), RenderPosition.BEFOREEND);


const filterController = new FilterController(content, model);
filterController.render();

const boardComponent = new Board();
domRender(content, boardComponent.getElement(), RenderPosition.BEFOREEND);

const board = new BoardController(boardComponent, model);

board.render();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      board.show();
      board.createTask();
      break;
    case MenuItem.STATISTICS:
      board.hide();
      break;
    case MenuItem.TASKS:
      board.show();
      break;
  }
});
