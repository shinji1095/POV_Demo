import React from 'react';
import { useAi } from '../../hooks/useAi';
import '../ButtonGrid/ButtonGrid.css';

function AiButton({ addLog, getLatestImage }) {
  const { start, stop, isRunning } = useAi(addLog);

  return (
    <button className="grid-button" onClick={isRunning ? stop : start}>
      {isRunning ? '停止' : '開始'}
    </button>
  );
}

export default AiButton;