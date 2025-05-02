import React from 'react';
import { useMeasure } from '../../hooks/useMeasure';
import './MeasureButton.css';

function MeasureButton({ addLog }) {
  const { start, stop, isRunning } = useMeasure(addLog);
  return (
    <button className="measure-button" onClick={isRunning ? stop : start}>
      {isRunning ? "計測終了" : "計測開始"}
    </button>
  );
}

export default MeasureButton;