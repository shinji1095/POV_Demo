import React from 'react';
import { useAudio } from '../../hooks/useAudio';
import '../ButtonGrid/ButtonGrid.css';

function AudioButton({ addLog }) {
  const { handleAudioClick } = useAudio(addLog);

  return (
    <button className="grid-button" onClick={handleAudioClick}>
      音声
    </button>
  );
}

export default AudioButton;