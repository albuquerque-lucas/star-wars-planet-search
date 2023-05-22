import React, { useContext } from 'react';
import './style.css';
import DataContext from '../../context/DataContext';

function FilterForm() {
  const {
    handleTextChange,
    nameValue,
    column,
    comparison,
    filterValue,
    handleFilterChange,
    handleFilters,
    availableColumns,
    columnsToFilter,
    setFilterOrder,
    filterOrder,
    handleFilterOrder,
  } = useContext(DataContext);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFilterOrder((prevState) => ({
      ...prevState,
      order: {
        ...prevState.order,
        [name]: value,
      },
    }));
  };

  return (
    <form className="filter-form">
      <div className="name-filter">
        <label htmlFor="name-filter">Filtrar por nome: </label>
        <input
          type="text"
          placeholder="Filtrar por nome"
          id="name-filter"
          data-testid="name-filter"
          value={ nameValue }
          onChange={ handleTextChange }
        />

      </div>
      <div className="other-filters">
        <select
          id="column"
          data-testid="column-filter"
          value={ column }
          onChange={ handleFilterChange }
        >
          {
            availableColumns.map((item) => (
              <option key={ item } value={ item }>
                {item}
              </option>
            ))
          }
        </select>

        <select
          id="comparison"
          data-testid="comparison-filter"
          value={ comparison }
          onChange={ handleFilterChange }
        >
          <option value="maior que">maior que</option>
          <option value="menor que">menor que</option>
          <option value="igual a">igual a</option>
        </select>
        <input
          type="number"
          id="filterValue"
          data-testid="value-filter"
          value={ filterValue }
          onChange={ handleFilterChange }
        />
        <button
          data-testid="button-filter"
          onClick={ handleFilters }
        >
          Filtrar

        </button>
      </div>
      <div className="order-filters">
        <select
          data-testid="column-sort"
          name="column"
          onChange={ handleChange }
        >
          {
            columnsToFilter.map((item, index) => (
              <option key={ index } value={ item }>
                {item}
              </option>
            ))
          }
        </select>
        <div className="radio-btns">
          <label htmlFor="asc-filter">
            Ascendente
            <input
              type="radio"
              name="sort"
              value="ASC"
              data-testid="column-sort-input-asc"
              onChange={ handleChange }
              checked={ filterOrder.order.sort === 'ASC' }
            />

          </label>
          <label htmlFor="asc-filter">
            Descendente
            <input
              type="radio"
              name="sort"
              value="DESC"
              data-testid="column-sort-input-desc"
              onChange={ handleChange }
              checked={ filterOrder.order.sort === 'DESC' }
            />
          </label>
        </div>
        <button data-testid="column-sort-button" onClick={ handleFilterOrder }>
          Ordenar
        </button>
      </div>
    </form>
  );
}

export default FilterForm;
