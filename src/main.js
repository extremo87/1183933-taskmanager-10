import {createMenuTemplate} from './components/menu';
import {createFiltersTemplate} from './components/filters';
import {createTasksTemplate} from './components/tasks';
import {createTaskTemplate} from './components/task';
import {createBtnTemplate} from './components/btnLoad';
import {createTaskFormTemplate} from './components/form';
import {COUNT} from './config';
import {generateTasks} from './mocks/tasks';
import {getFilters} from './mocks/filters';

const items = generateTasks(COUNT);
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
render(tasks, createTaskFormTemplate(items[0]));

render(tasks, items.slice(1, items.length).map((item) => createTaskTemplate(item)).join(`\n`));

const board = content.querySelector(`.board`);

render(board, createBtnTemplate());


console.log(items, filters);

