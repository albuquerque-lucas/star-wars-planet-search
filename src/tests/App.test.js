import React, { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import DataProvider from '../context/DataProvider';
import App from '../App';
import userEvent from '@testing-library/user-event';
import mockFetch from '../../cypress/mocks/fetch';
import { text } from '@fortawesome/fontawesome-svg-core';

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

  test('Testa a função handleTextChange', () => {
    render(
      <DataProvider>
        <App />
      </DataProvider>
    )

    const textBox = screen.getByRole('textbox', {
      name: /filtrar por nome:/i
    })
    expect(textBox).toBeInTheDocument();
    userEvent.type(textBox, 'Tatooine');
    expect(textBox).toHaveValue('Tatooine');
  })

  test('Testa a função deleteFilter', () => {
    render(
      <DataProvider>
        <App />
      </DataProvider>
    )

    const columnSelect = screen.getByTestId('column-filter');
    const comparisonSelect = screen.getByTestId('comparison-filter');
    const filterValueInput = screen.getByTestId('value-filter');
    const buttonFilter = screen.getByTestId('button-filter');
    userEvent.selectOptions(comparisonSelect, 'maior que');
    userEvent.selectOptions(columnSelect, 'population');
    userEvent.type(filterValueInput, '1000000');
    userEvent.click(buttonFilter);
    const deleteButton = screen.getByRole('button', { name: 'X' });
    expect(deleteButton).toBeInTheDocument();
    userEvent.click(deleteButton);
    expect(deleteButton).not.toBeInTheDocument();
    
  })

  test('Testa a remoção de todos os filtros com a função removeAllFilters', () => {
    act(() => {
      render(
        <DataProvider>
          <App />
        </DataProvider>
      )
    })
    const removeAllFiltersBtn = screen.getByTestId('button-remove-filters');
    const columnSelect = screen.getByTestId('column-filter');
    const comparisonSelect = screen.getByTestId('comparison-filter');
    const filterValueInput = screen.getByTestId('value-filter');
    const buttonFilter = screen.getByTestId('button-filter');


    userEvent.selectOptions(comparisonSelect, 'maior que');
    userEvent.selectOptions(columnSelect, 'population');
    userEvent.type(filterValueInput, '1000000');
    userEvent.click(buttonFilter);

    userEvent.selectOptions(columnSelect, 'orbital_period');
    userEvent.selectOptions(comparisonSelect, 'menor que');
    userEvent.clear(filterValueInput);
    userEvent.type(filterValueInput, '500');
    userEvent.click(buttonFilter);



  userEvent.selectOptions(columnSelect, 'rotation_period');
  userEvent.selectOptions(comparisonSelect, 'igual a');
  userEvent.clear(filterValueInput);
  userEvent.type(filterValueInput, '23');
  userEvent.click(buttonFilter);




    const deleteButtons = screen.getAllByRole('button', { name: 'X' })
    expect(deleteButtons).toHaveLength(3);
    userEvent.click(removeAllFiltersBtn);
    const updatedDeleteButtons = screen.queryAllByRole('button', { name: 'X' });
    expect(updatedDeleteButtons).toHaveLength(0);
  })
});


