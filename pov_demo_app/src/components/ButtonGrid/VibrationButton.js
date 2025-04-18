import React from 'react';
import { useVibration } from '../../hooks/useVibration';
import '../ButtonGrid/ButtonGrid.css';

function VibrationButton({ addLog }) {
  const { handleVibrationClick } = useVibration(addLog);

  return (
    <button className="grid-button" onClick={handleVibrationClick}>
      振動
    </button>
  );
}

export default VibrationButton;