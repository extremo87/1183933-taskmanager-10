export const createFiltersTemplate = (filters) => {

  const renderFilter = (item, isChecked) => {
    const {title, count} = item;
    return (`
      <input
          type="radio"
          id="filter__${title}"
          class="filter__input visually-hidden"
          name="filter"
          ${isChecked ? `checked` : ``}
      />
      <label for="filter__${title}" class="filter__label">
        ${title} <span class="filter__${title}-count"> ${count}</span>
      </label>`
    );
  };

  return (`
    <section class="main__filter filter container">
    ${(filters.map((filter) => renderFilter(filter, false))).join(`\n`)}
    </section>
  `);
};
