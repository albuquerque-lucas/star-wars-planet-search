import React from 'react';
import DataProvider from './context/DataProvider';
import Table from './components/Table';
import FilterForm from './components/FilferForm';
import './App.css';

function App() {
  return (
    <DataProvider>
      <div className="main">
        <FilterForm />
        <Table />
      </div>

    </DataProvider>
  );
}

export default App;
