import Menu, {MenuItem} from './components/Menu';
import Board from './components/Board';
import BoardController from './controllers/BoardController';
import {render as domRender, RenderPosition} from './utils';
import TaskModel from './models/tasks.js';
import FilterController from './controllers/FilterController';
import {AUTHORIZATION, END_POINT} from './config';
import API from './api';
import Statistics from './components/Statistics';
import Provider from './api/provider';
import Store from './api/store';

if (`serviceWorker` in navigator) {
  window.addEventListener(`load`, () => {
    navigator.serviceWorker.register(`/sw.js`)
      .then(() => {
        // Действие, в случае успешной регистрации ServiceWorker
      }).catch(() => {
        // Действие, в случае ошибки при регистрации ServiceWorker
      });
  });
}

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

const STORE_PREFIX = `taskmanager-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
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
const board = new BoardController(boardComponent, model, apiWithProvider);
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


apiWithProvider.getTasks()
  .then((tasks) => {
    model.setTasks(tasks);
    filterController.render();
    board.render();
});
