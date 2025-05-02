import React, { useState } from 'react';
import ButtonGrid from './components/ButtonGrid/ButtonGrid';
import LogTextField from './components/LogTextField/LogTextField';
import MeasureButton from './components/MeasureButton/MeasureButton';

function App() {
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs([...logs, `${new Date().toISOString()}: ${message}`]);
  };

  return (
    <div className="App">
      <div className="top-section">
        <ButtonGrid addLog={addLog} />
        <LogTextField logs={logs} />
      </div>
      <MeasureButton addLog={addLog} />
    </div>
  );
}

export default App;