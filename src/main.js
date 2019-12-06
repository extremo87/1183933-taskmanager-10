import Menu from './components/Menu';
import Filters from './components/Filters';
import {COUNT} from './config';
import {generateTasks} from './mocks/tasks';
import {getFilters} from './mocks/filters';
import Board from './components/Board';
import BoardController from './controllers/BoardController';
import {render as domRender, RenderPosition} from './utils';

const items = generateTasks(COUNT);
const filters = getFilters(items);

const content = document.querySelector(`.main`);
const header = document.querySelector(`.main__control`);

domRender(header, new Menu().getElement(), RenderPosition.BEFOREEND);
domRender(content, new Filters(filters).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new Board();
domRender(content, boardComponent.getElement(), RenderPosition.BEFOREEND);

new BoardController(boardComponent).render(items);
