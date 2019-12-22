import {isToday, isExpired} from '../utils';
import {FilterType} from '../const.js';


export const getArchiveTasks = (tasks) => {
  return tasks.filter((task) => task.isArchive);
};

export const getNotArchiveTasks = (tasks) => {
  return tasks.filter((task) => !task.isArchive);
};

export const getFavoriteTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

export const getOverdueTasks = (tasks) => {
  return tasks.filter((task) => task.dueDate === null ? false : isExpired(task.dueDate));
};

export const getRepeatingTasks = (tasks) => {
  return tasks.filter((task) => task.isRepeated);
};

export const getTasksWithHashtags = (tasks) => {
  return tasks.filter((task) => task.tags.size);
};

export const getTasksInOneDay = (tasks) => {
  return tasks.filter((task) => task.dueDate === null ? false : isToday(task.dueDate));
};

export const getTasksByFilter = (tasks, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.ALL:
      return getNotArchiveTasks(tasks);
    case FilterType.ARCHIVE:
      return getArchiveTasks(tasks);
    case FilterType.FAVORITES:
      return getFavoriteTasks(getNotArchiveTasks(tasks));
    case FilterType.OVERDUE:
      return getOverdueTasks(getNotArchiveTasks(tasks), nowDate);
    case FilterType.REPEATING:
      return getRepeatingTasks(getNotArchiveTasks(tasks));
    case FilterType.TAGS:
      return getTasksWithHashtags(getNotArchiveTasks(tasks));
    case FilterType.TODAY:
      return getTasksInOneDay(getNotArchiveTasks(tasks), nowDate);
  }

  return tasks;
};
