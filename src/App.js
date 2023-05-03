import React from 'react';
import DataProvider from './context/DataProvider';
import Table from './components/Table';
import './App.css';

function App() {
  return (
    <DataProvider>
      <Table />
    </DataProvider>
  );
}

export default App;
