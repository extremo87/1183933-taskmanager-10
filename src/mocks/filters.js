import {isToday, isExpired} from '../utils';

const filters = [
  `all`,
  `overdue`,
  `today`,
  `favorites`,
  `repeating`,
  `tags`,
  `archive`
];

export const getFilters = (tasks) => {
  return filters.map((filter) => {
    return {
      'title': filter,
      'count': countTasks(tasks, filter)
    };
  });
};

const countTasks = (tasks, tag) => {
  if (tag === `all`) {
    return tasks.length;
  }

  if (tag === `archive`) {
    return tasks.filter((task) => task.isArchive).length;
  }

  if (tag === `favorites`) {
    return tasks.filter((task) => task.isFavorite).length;
  }

  if (tag === `repeating`) {
    return tasks.filter((task) => task.isRepeated).length;
  }

  if (tag === `tags`) {
    return tasks.filter((task) => task.tags.size > 0).length;
  }

  if (tag === `today`) {
    return tasks.filter((task) => task.dueDate === null ? false : isToday(task.dueDate)).length;
  }

  if (tag === `overdue`) {
    return tasks.filter((task) => task.dueDate === null ? false : isExpired(task.dueDate)).length;
  }

  return 0;
};

