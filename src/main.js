import Menu, {MenuItem} from './components/Menu';
import Board from './components/Board';
import BoardController from './controllers/BoardController';
import {render as domRender, RenderPosition} from './utils';
import TaskModel from './models/tasks.js';
import FilterController from './controllers/FilterController';
import {AUTHORIZATION, END_POINT} from './config';
import API from './api.js';

const api = new API(END_POINT, AUTHORIZATION);
const model = new TaskModel();

const content = document.querySelector(`.main`);
const header = document.querySelector(`.main__control`);
const siteMenuComponent = new Menu();
domRender(header, siteMenuComponent.getElement(), RenderPosition.BEFOREEND);
const filterController = new FilterController(content, model);
filterController.render();
const boardComponent = new Board();
domRender(content, boardComponent.getElement(), RenderPosition.BEFOREEND);
const board = new BoardController(boardComponent, model, api);

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


api.getTasks()
  .then((tasks) => {
    model.setTasks(tasks);
    filterController.render();
    board.render();
  });
