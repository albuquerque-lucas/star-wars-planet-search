import React, { useMemo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import DataContext from './DataContext';
import useFetch from '../hooks/useFetch';

function DataProvider({ children }) {
  const { data, error, isLoading } = useFetch('https://swapi.dev/api/planets');
  const [filteredData, setFilteredData] = useState([]);
  const [nameValue, setNameValue] = useState('');
  const [column, setColumn] = useState('population');
  const [comparison, setComparison] = useState('maior que');
  const [filterValue, setFilterValue] = useState(0);
  const [filters, setFilters] = useState([]);
  const columnsToFilter = [
    'population',
    'orbital_period',
    'diameter',
    'rotation_period',
    'surface_water',
  ];
  const [availableColumns, setAvailableColumns] = useState(columnsToFilter);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const filterByName = useCallback(
    (query) => filteredData.filter(
      (item) => item.name.toLowerCase().includes(query.toLowerCase()),
    ),
    [filteredData],
  );

  const handleTextChange = useCallback(({ target }) => {
    const { value } = target;
    setNameValue(value);
  }, []);

  const handleFilterChange = useCallback(({ target }) => {
    const { id, value } = target;
    switch (id) {
    case 'comparison':
      setComparison(value);
      break;
    case 'column':
      setColumn(value);
      break;
    case 'filterValue':
      setFilterValue(value);
      break;
    default:
      break;
    }
  }, []);

  const handleFilters = useCallback(
    (event) => {
      event.preventDefault();
      let higherThan;
      let lesserThan;
      let equalTo;
      const filteredComparison = availableColumns.filter((item) => item !== column);
      console.log(filteredComparison);
      switch (comparison) {
      case 'maior que':
        higherThan = filteredData
          .filter((item) => Number(item[column]) > Number(filterValue));
        setFilteredData(higherThan);
        break;
      case 'menor que':
        lesserThan = filteredData
          .filter((item) => Number(item[column]) < Number(filterValue));
        setFilteredData(lesserThan);
        break;
      case 'igual a':
        equalTo = filteredData
          .filter((item) => Number(item[column]) === Number(filterValue));
        setFilteredData(equalTo);
        break;
      default:
        break;
      }
      setFilters([...filters, { column, comparison, filterValue }]);
      setAvailableColumns(filteredComparison);
      setColumn(availableColumns[0]);
      console.log(column);
      console.log(filteredComparison);
    },
    [
      column,
      comparison,
      filterValue,
      filters,
      filteredData,
      availableColumns,
    ],
  );

  const value = useMemo(
    () => ({
      data,
      filteredData,
      error,
      isLoading,
      nameValue,
      handleTextChange,
      filterByName,
      filters,
      setFilters,
      handleFilterChange,
      column,
      comparison,
      filterValue,
      handleFilters,
      availableColumns,
    }),
    [data,
      filteredData,
      error,
      isLoading,
      nameValue,
      handleTextChange,
      filterByName,
      filters,
      setFilters,
      handleFilterChange,
      column,
      comparison,
      filterValue,
      handleFilters,
      availableColumns,
    ],
  );

  return (
    <DataContext.Provider value={ value }>
      {children}
    </DataContext.Provider>
  );
}

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DataProvider;
