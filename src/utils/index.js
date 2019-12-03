import moment from 'moment';

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInt(0, array.length);
  return array[randomIndex];
};

export const getRandomInt = (min, max) => {
  return min + Math.floor(max * Math.random());
};

export const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomInt(0, 7);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

export const isToday = (date) => {
  return moment().isSame(moment(date), `day`);
};

export const isExpired = (date) => {
  const today = new Date();
  return date < today;
};

