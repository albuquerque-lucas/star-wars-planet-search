import React from 'react';
import Table from './components/Table';
import FilterForm from './components/FilferForm';
import './App.css';

function App() {
  return (
    <div className="main">
      <FilterForm />
      <Table />
    </div>
  );
}

export default App;
