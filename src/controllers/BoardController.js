import Tasks from '../components/tasks';
import Sort from '../components/Sort';
import Button from '../components/Button';
import Form from '../components/Form';
import Missing from '../components/Missing';
import {ITEMS_PER_PAGE} from '../config';
import Task from '../components/Тask';
import {render as domRender, RenderPosition} from '../utils';

export default class BoardController {

  constructor(component) {
    this._component = component;
  }

  render(items) {
    const isEverythingDone = items.every((task) => task.isArchive);

    if (!isEverythingDone) {
      domRender(this._component.getElement(), new Sort().getElement(), RenderPosition.BEFOREEND);
      domRender(this._component.getElement(), new Tasks().getElement(), RenderPosition.BEFOREEND);
    }

    const taskListElement = this._component.getElement().querySelector(`.board__tasks`);

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

      taskComponent.setEditButtonClickHandler(() => {
        taskComponent.getElement().replaceWith(formComponent.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

      const replaceWithTask = () => {
        formComponent.getElement().replaceWith(taskComponent.getElement());
      };

      formComponent.setSubmitButtonHandler(replaceWithTask);

      domRender(list, taskComponent.getElement(), RenderPosition.BEFOREEND);
    };

    if (isEverythingDone) {
      domRender(this._component.getElement(), new Missing().getElement(), RenderPosition.AFTERNODE);
    } else {
      let tasksOnPage = ITEMS_PER_PAGE;

      items.slice(0, tasksOnPage)
          .forEach((task) => {
            renderTask(taskListElement, task);
          });

      const btnLoad = new Button();

      domRender(this._component.getElement(), btnLoad.getElement(), RenderPosition.BEFOREEND);

      btnLoad.setClickhandler(() => {
        const prevTasksOnPage = tasksOnPage;
        tasksOnPage += ITEMS_PER_PAGE;
        items.slice(prevTasksOnPage, tasksOnPage).map((item) => renderTask(taskListElement, item)).join(`\n`);

        if (tasksOnPage > items.length) {
          btnLoad.removeElement();
        }
      });
    }

  }
}
