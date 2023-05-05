import React, { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import DataContext from './DataContext';
import useFetch from '../hooks/useFetch';

function DataProvider({ children }) {
  const { data, error, isLoading } = useFetch('https://swapi.dev/api/planets');
  const [inputValue, setInputValue] = useState('');

  const handleChange = useCallback(({ target }) => {
    const { value } = target;
    setInputValue(value);
  }, []);

  const filterByName = useCallback(
    (query) => data.filter(
      (item) => item.name.toLowerCase().includes(query.toLowerCase()),
    ),
    [data],
  );

  const value = useMemo(
    () => ({ data, error, isLoading, inputValue, handleChange, filterByName }),
    [data, error, isLoading, inputValue, handleChange, filterByName],
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
