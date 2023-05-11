import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DataProvider from '../context/DataProvider';
import App from '../App';
import planetData from './mocks/planetData';

describe('Testes RTL da aplicação', () => {
  beforeEach(()=> {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(planetData),
    })
  });

  test('Verifica o componente Table', async () => {
    render(
      <DataProvider>
        <App />
      </DataProvider>
    )
    const tableHeaders = [
      'name',
      'rotation_period',
      'orbital_period',
      'diameter',
      'climate',
      'gravity',
      'terrain',
      'surface_water',
      'population',
      'films',
      'created',
      'edited',
      'url',
    ];
        await waitFor(() => {
          tableHeaders.forEach((item) => {
            expect(screen.getByRole('cell', {name:item})).toBeInTheDocument();
          });
    });


  })

  // test('Verifica se os elementos de filtro estão presentes na tela', async () => {
  //   render(
  //       <App />
  //   );
  //   const testIds = [
  //     'name-filter',
  //     'column-filter',
  //     'comparison-filter',
  //     'value-filter',
  //     'button-filter',
  //   ];
  //   testIds.forEach((item) => {
  //     expect(screen.getByTestId(item)).toBeInTheDocument();
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByRole('cell', { name: /tatooine/i })).toBeInTheDocument();
  //     // expect(screen.getByRole('cell', {name: /kamino/i})).toBeInTheDocument();
  //   });
  // });
});
