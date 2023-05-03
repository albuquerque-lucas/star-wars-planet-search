import React, { useContext } from 'react';
import DataContext from '../../context/DataContext';
import useFetch from '../../hooks/useFetch';

function Table() {
  const context = useContext(DataContext);
  console.log(context);
  const { data } = useFetch('https://swapi.dev/api/planets');

  if (!data) {
    return (<p>Loading...</p>);
  }

  console.log(data);
  const { results } = data;
  const headerItems = Object.keys(results[0]).filter((item) => item !== 'residents');
  const bodyItems = results.map(({ residents, ...rest }) => rest);
  console.log(bodyItems);
  return (
    <table>
      <thead>
        <tr>
          {headerItems.map((item, index) => (
            <th key={ index }>{item}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {bodyItems.map((item, index) => (
          <tr key={ index }>
            <td>{item.name}</td>
            <td>{item.rotation_period}</td>
            <td>{item.orbital_period}</td>
            <td>{item.diameter}</td>
            <td>{item.climate}</td>
            <td>{item.gravity}</td>
            <td>{item.terrain}</td>
            <td>{item.surface_water}</td>
            <td>{item.population}</td>
            <td>{item.films}</td>
            <td>{item.created}</td>
            <td>{item.edited}</td>
            <td>{item.url}</td>
          </tr>
        ))}
      </tbody>
    </table>

  );
}

export default Table;
