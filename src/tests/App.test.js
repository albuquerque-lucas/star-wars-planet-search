import React, { useEffect } from 'react';
import { render, renderHook, screen, waitFor, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import DataProvider from '../context/DataProvider';
import App from '../App';
import userEvent from '@testing-library/user-event';
import mockFetch from '../../cypress/mocks/fetch';
import testData from '../../cypress/mocks/testData';
import useFetch from '../hooks/useFetch';
import Table from '../components/Table';

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

  test('define o erro corretamente ao fazer uma requisição com erro', async () => {
    const mockError = 'Erro ao fazer a requisição';
    const mockFetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: mockError }),
    });
    global.fetch = mockFetch;
  
    let result;

    act(() => {
      const { result: hookResult } = renderHook(() => useFetch('https://swapi.dev/api/planets'));
      result = hookResult;
    });
  
    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
  
    await waitFor(() => {
      return !result.current.isLoading;
    });
  
    act(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual([]);
      expect(result.current.error).toBe(mockError);
    });
  
    expect(mockFetch).toHaveBeenCalledWith('https://swapi.dev/api/planets');
  });

  test('Testa a função handleFilterOrder', () => {
    render(
      <DataProvider>
        <App/>
      </DataProvider>
    )

    const columnSort = screen.getByTestId('column-sort');
    userEvent.selectOptions(columnSort, 'rotation_period');

    const ascRadioBtn = screen.getByText(/ascendente/i);
    const radioBtn = within(ascRadioBtn).getByRole('radio');
    userEvent.click(radioBtn);

    const sortBtn = screen.getByRole('button', {
      name: /ordenar/i
    });
    userEvent.click(sortBtn);

    const planetNames = screen.getAllByTestId('planet-name');
  })
});


