import {getRandomArrayItem, getRandomDate} from '../utils';
import {colors} from '../config';

const repeatingDays = {
  mo: false,
  tu: false,
  we: false,
  th: false,
  fr: false,
  sa: false,
  su: false
};

const descriptions = [
  `Изучить теорию;`,
  `Сделать домашку;`,
  `Пройти интенсив на соточку.`
];

const tags = [
  `homework`,
  `theory`,
  `practice`,
  `intensive`,
  `keks`,
  `bugs`
];

const generateRepeatingDays = () => {
  return Object.assign({}, repeatingDays, {
    'mo': Math.random() > 0.5,
  });
};

const generateTags = () => {
  return tags
    .filter(() => Math.random() > 0.5)
    .slice(0, 3);
};

const generateTask = () => {
  const dueDate = Math.random() > 0.5 ? null : getRandomDate();
  const days = dueDate ? repeatingDays : generateRepeatingDays();
  return {
    description: getRandomArrayItem(descriptions),
    dueDate,
    repeatingDays: days,
    tags: new Set(generateTags(tags)),
    color: getRandomArrayItem(colors),
    isFavorite: Math.random() > 0.5,
    isArchive: Math.random() > 0.5,
    isRepeated: Object.values(days).some((day) => day),
  };
};

const generateTasks = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTask);
};

export {generateTask, generateTasks};
