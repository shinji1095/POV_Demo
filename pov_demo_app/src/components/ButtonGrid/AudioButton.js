import React from 'react';
import { useAudio } from '../../hooks/useAudio';
import '../ButtonGrid/ButtonGrid.css';

function AudioButton({ addLog }) {
  const { handleAudioClick, isPlaying } = useAudio(addLog);

  return (
    <button className="grid-button" onClick={handleAudioClick}>
      {isPlaying ? '音声停止' : '音声'}
    </button>
  );
}

export default AudioButton;