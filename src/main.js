import Menu, {MenuItem} from './components/Menu';
import Board from './components/Board';
import BoardController from './controllers/BoardController';
import {render as domRender, RenderPosition} from './utils';
import TaskModel from './models/tasks.js';
import FilterController from './controllers/FilterController';
import {AUTHORIZATION, END_POINT} from './config';
import API from './api.js';
import Statistics from './components/Statistics';

const api = new API(END_POINT, AUTHORIZATION);
const model = new TaskModel();

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();
const statisticsComponent = new Statistics({tasks: model, dateFrom, dateTo});

const content = document.querySelector(`.main`);
const header = document.querySelector(`.main__control`);
const siteMenuComponent = new Menu();
domRender(header, siteMenuComponent.getElement(), RenderPosition.BEFOREEND);

const filterController = new FilterController(content, model);
filterController.render();
const boardComponent = new Board();
domRender(content, boardComponent.getElement(), RenderPosition.BEFOREEND);
const board = new BoardController(boardComponent, model, api);
domRender(content, statisticsComponent.getElement(), RenderPosition.BEFOREEND);
statisticsComponent.hide();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      statisticsComponent.hide();
      board.show();
      board.createTask();
      break;
    case MenuItem.STATISTICS:
      board.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TASKS:
      statisticsComponent.hide();
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
