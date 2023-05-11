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
  } = useContext(DataContext);
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
          {availableColumns.map((item) => (
            <option key={ item } value={ item }>
              {item}
            </option>
          ))}
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
    </form>
  );
}

export default FilterForm;
