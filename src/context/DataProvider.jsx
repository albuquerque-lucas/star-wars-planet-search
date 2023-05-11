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

  const handleFilters = useCallback((event) => {
    event.preventDefault();
    let higherThan;
    let lesserThan;
    let equalTo;
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
  }, [column, comparison, filterValue, filters, filteredData]);

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
