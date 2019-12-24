import Menu from './components/Menu';
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

domRender(header, new Menu().getElement(), RenderPosition.BEFOREEND);

const filterController = new FilterController(content, model);
filterController.render();

const boardComponent = new Board();
domRender(content, boardComponent.getElement(), RenderPosition.BEFOREEND);

new BoardController(boardComponent, model).render(items);
