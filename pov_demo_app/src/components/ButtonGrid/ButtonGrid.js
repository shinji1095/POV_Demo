import React from 'react';
import AudioButton from './AudioButton';
import VibrationButton from './VibrationButton';
import ImuButton from './ImuButton';
import CsvButton from './CsvButton';
import ImageButton from './ImageButton';
import AiButton from './AiButton';
import './ButtonGrid.css';

function ButtonGrid({ addLog }) {
  return (
    <div className="button-grid">
      <AudioButton addLog={addLog} />
      <VibrationButton addLog={addLog} />
      <ImuButton addLog={addLog} />
      <CsvButton addLog={addLog} />
      <ImageButton addLog={addLog} />
      <AiButton addLog={addLog} />
    </div>
  );
}

export default ButtonGrid;