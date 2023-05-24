import React, { useContext } from 'react';
import DataContext from '../../context/DataContext';
import './style.css';

function Table() {
  const {
    filteredData,
    filterByName,
    nameValue,
    filters,
    deleteFilter,
    removeAllFilters,
    error,
  } = useContext(DataContext);
  const headerItems = filteredData.length > 0
    ? Object.keys(filteredData[0]).filter((item) => item !== 'residents') : [];
  const nameFiltered = filterByName(nameValue);
  const filteredDisplay = nameFiltered.map((item, index) => (
    <tr key={ index }>
      <td data-testid="planet-name">{item.name}</td>
      <td>{item.rotation_period}</td>
      <td>{item.orbital_period}</td>
      <td>{item.diameter}</td>
      <td>{item.climate}</td>
      <td>{item.gravity}</td>
      <td>{item.terrain}</td>
      <td>{item.surface_water}</td>
      <td>{item.population}</td>
      <td>
        {item.films.map((film, filmIndex) => (
          <a key={ filmIndex } href={ film }>
            <p>{film}</p>
          </a>
        ))}
      </td>
      <td>{item.created}</td>
      <td>{item.edited}</td>
      <td>{item.url}</td>
    </tr>
  ));
  return (
    <div>
      <ul className="filter-list">
        {
          filters.map((item, index) => (
            <li
              key={ index }
              className="filter-list-item"
              data-testid="filter"
            >
              <p>{`${item.column} - ${item.comparison} - ${item.filterValue}`}</p>
              {' '}
              <button
                id={ index }
                onClick={ ({ target }) => deleteFilter(target) }
              >
                X
              </button>
            </li>
          ))
        }
        <li>
          <button onClick={ removeAllFilters } data-testid="button-remove-filters">
            Remover Filtros
          </button>
        </li>
      </ul>
      { error
        ? <h1>Não foi possível concluir a solicitação</h1>
        : (
          <table className="planet-table">
            <thead>
              <tr>
                {headerItems.map((item, index) => (
                  <th key={ index }>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>

              {
                filteredDisplay
              }

            </tbody>

          </table>
        )}

    </div>
  );
}

export default Table;
