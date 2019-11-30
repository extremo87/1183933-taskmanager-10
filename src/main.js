import {createMenuTemplate} from './components/menu';
import {createFiltersTemplate} from './components/filters';
import {createTasksTemplate} from './components/tasks';
import {createTaskTemplate} from './components/task';
import {createBtnTemplate} from './components/btnLoad';
import {createTaskFormTemplate} from './components/form';
import {COUNT} from './config';
import {generateTasks} from './mocks/tasks';
import {getFilters} from './mocks/filters';


const items = generateTasks(100);
const filters = getFilters(items);

const content = document.querySelector(`.main`);

const header = document.querySelector(`.main__control`);

const render = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

render(header, createMenuTemplate());
render(content, createFiltersTemplate(filters));
render(content, createTasksTemplate());

const tasks = content.querySelector(`.board__tasks`);
render(tasks, createTaskFormTemplate());

new Array(COUNT).fill(``).forEach(
    () => render(tasks, createTaskTemplate())
);

const board = content.querySelector(`.board`);

render(board, createBtnTemplate());


console.log(filters);

