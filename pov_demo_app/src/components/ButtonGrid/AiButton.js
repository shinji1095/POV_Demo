import React from 'react';
import { useAi } from '../../hooks/useAi';
import '../ButtonGrid/ButtonGrid.css';

function AiButton({ addLog }) {
  const { handleAiClick } = useAi(addLog);

  return (
    <button className="grid-button" onClick={handleAiClick}>
      AI
    </button>
  );
}

export default AiButton;