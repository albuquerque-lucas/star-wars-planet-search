import React, { useContext } from 'react';
import './style.css';
import DataContext from '../../context/DataContext';

function FilterForm() {
  const { handleChange, inputValue } = useContext(DataContext);
  return (
    <form className="filter-form">
      <div className="name-filter">
        <label htmlFor="name-filter">Filtrar por nome: </label>
        <input
          type="text"
          placeholder="Filtrar por nome"
          name="name-filter"
          data-testid="name-filter"
          value={ inputValue }
          onChange={ handleChange }
        />

      </div>
      {/* <div className="other-filters">
        <input type="number" />
      </div> */}
    </form>
  );
}

export default FilterForm;
