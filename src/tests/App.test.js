import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DataProvider from '../context/DataProvider';
import App from '../App';
import userEvent from '@testing-library/user-event';
import mockFetch from '../../cypress/mocks/fetch';

describe('Testes RTL da aplicação', () => {
  beforeEach(()=> {
    jest.spyOn(global, 'fetch').mockImplementation(mockFetch);
  });

  test('Verifica a função handleFilterChange', async () => {
    render(
      <DataProvider>
        <App />
      </DataProvider>
    )

    expect(global.fetch).toHaveBeenCalledTimes(1);
    
    const columnSelect = screen.getByTestId('column-filter');
    const comparisonSelect = screen.getByTestId('comparison-filter');
    const filterValueInput = screen.getByTestId('value-filter');
  
    userEvent.selectOptions(comparisonSelect, 'maior que');
    userEvent.selectOptions(columnSelect, 'population');
    userEvent.type(filterValueInput, '1000000');

    expect(comparisonSelect).toHaveValue('maior que');
    expect(columnSelect).toHaveValue('population');
    expect(filterValueInput).toHaveValue(1000000);
  })
});


