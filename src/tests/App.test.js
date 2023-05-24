import React, { useEffect } from 'react';
import { render, renderHook, screen, waitFor, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import DataProvider, {handleFilterOrder} from '../context/DataProvider';
import App from '../App';
import userEvent from '@testing-library/user-event';
import mockFetch from '../../cypress/mocks/fetch';
import testData from '../../cypress/mocks/testData';
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

  test('Exibe uma mensagem de erro caso falhe na requisição', async () => {
    const mockError = 'Não foi possível concluir a solicitação';
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error(mockError));

    render(
      <DataProvider>
        <App/>
      </DataProvider>
    )
      const errorMessage = await screen.findByText(mockError);
      expect(errorMessage).toBeInTheDocument();
    })

    test('Verifica se a ordenação ascendente dos elementos é acionada corretamente', async () => {
      act(() => {
        render(
          <DataProvider>
            <App/>
          </DataProvider>
        )
      })

      const planetNames = await screen.findAllByTestId('planet-name');
      expect(planetNames[0].textContent).toBe('Tatooine');

      const columnSort = screen.getByTestId('column-sort');
      userEvent.selectOptions(columnSort, 'rotation_period');

      const ascRadioBtn = screen.getByLabelText(/ascendente/i);
      userEvent.click(ascRadioBtn);
      const sortBtn = screen.getByRole('button', {
        name: /ordenar/i
      });
      userEvent.click(sortBtn);

      const sortedColumnSort = screen.getAllByTestId('planet-name');
      expect(sortedColumnSort[0].textContent).toBe('Bespin');
    })

    test('Verifica se a ordenação ascendente dos elementos é acionada corretamente', async () => {
      act(() => {
        render(
          <DataProvider>
            <App/>
          </DataProvider>
        )
      })

      const planetNames = await screen.findAllByTestId('planet-name');
      expect(planetNames[0].textContent).toBe('Tatooine');

      const columnSort = screen.getByTestId('column-sort');
      userEvent.selectOptions(columnSort, 'rotation_period');

      const ascRadioBtn = screen.getByLabelText(/descendente/i);
      userEvent.click(ascRadioBtn);
      const sortBtn = screen.getByRole('button', {
        name: /ordenar/i
      });
      userEvent.click(sortBtn);

      const sortedColumnSort = screen.getAllByTestId('planet-name');
      expect(sortedColumnSort[0].textContent).toBe('Kamino');
    })

  // test('Testa a função handleFilterOrder', async () => {
  //   global.fetch = jest.fn(() => Promise.resolve({
  //     json: () => Promise.resolve(testData.results),
  //   }))
  //   render(
  //     <DataProvider>
  //       <App/>
  //     </DataProvider>
  //   )

  //   const columnSort = screen.getByTestId('column-sort');
  //   userEvent.selectOptions(columnSort, 'rotation_period');

  //   const ascRadioBtn = screen.getByLabelText(/ascendente/i);
  //   userEvent.click(ascRadioBtn);
  //   const sortBtn = screen.getByRole('button', {
  //     name: /ordenar/i
  //   });
  //   userEvent.click(sortBtn);

  //   await waitFor(() =>{
  //     expect(screen.getAllByTestId('planet-name')[0].textContent).toBe('Bespin');
  //     // expect(planetNames[0].textContent).toBe('Bespin');
  //   })
  // })
});


