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
  const columnsToFilter = useMemo(() => [
    'population',
    'orbital_period',
    'diameter',
    'rotation_period',
    'surface_water',
  ], []);
  const [availableColumns, setAvailableColumns] = useState(columnsToFilter);
  const [isToDelete, setIsToDelete] = useState(false);
  const [filterOrder, setFilterOrder] = useState({ order: {
    column: 'population',
    sort: '',
  },
  });
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    if (isToDelete) {
      let filterResult = data;
      filters.forEach((item) => {
        switch (item.comparison) {
        case 'maior que':
          filterResult = filterResult
            .filter((element) => Number(element[item.column]) > Number(item.filterValue));
          break;
        case 'menor que':
          filterResult = filterResult
            .filter((element) => Number(element[item.column]) < Number(item.filterValue));
          break;
        case 'igual a':
          filterResult = filterResult
            .filter((element) => Number(element[item
              .column]) === Number(item.filterValue));
          break;
        default:
          break;
        }
        setFilteredData(filterResult);
      });
      setIsToDelete(false);
    }
  }, [isToDelete, filters, data]);

  const handleFilterOrder = useCallback((event) => {
    event.preventDefault();
    const { order: { sort, column: filterColumn } } = filterOrder;
    const resultUnknown = filteredData.filter((item) => item[filterColumn] === 'unknown');
    const resultMain = filteredData.filter((item) => item[filterColumn] !== 'unknown');
    if (sort === 'ASC') {
      const filterAsc = resultMain
        .sort((a, b) => Number(a[filterColumn] - b[filterColumn]));
      setFilteredData([...filterAsc, ...resultUnknown]);
    } else {
      const filterDesc = resultMain
        .sort((a, b) => Number(b[filterColumn] - a[filterColumn]));
      setFilteredData([...filterDesc, ...resultUnknown]);
    }
  }, [filterOrder, filteredData]);

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

  const deleteFilter = useCallback(
    (target) => {
      setFilteredData(data);
      const newFilters = filters.filter((item, index) => {
        if (index === Number(target.id)) {
          setAvailableColumns([...availableColumns, item.column]);
        }
        return index !== Number(target.id);
      });
      setFilters(newFilters);
      setIsToDelete(true);
    },
    [filters, availableColumns, data],
  );

  const removeAllFilters = useCallback(
    () => {
      setFilteredData(data);
      setFilters([]);
      setAvailableColumns(columnsToFilter);
    },
    [data, columnsToFilter],
  );

  const value = useMemo(
    () => (
      {
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
        deleteFilter,
        removeAllFilters,
        columnsToFilter,
        filterOrder,
        setFilterOrder,
        handleFilterOrder,
      }),
    [
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
      deleteFilter,
      removeAllFilters,
      columnsToFilter,
      filterOrder,
      setFilterOrder,
      handleFilterOrder,
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
