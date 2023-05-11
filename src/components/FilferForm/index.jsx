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
          <option value="population">population</option>
          <option value="orbital_period">orbital_period</option>
          <option value="diameter">diameter</option>
          <option value="rotation_period">rotation_period</option>
          <option value="surface_water">surface_water</option>
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
