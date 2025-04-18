import { useState, useEffect, useCallback } from 'react';
import { createLogMessage } from '../utils/logUtils';
import { config } from '../config/config';

export const useAudio = (addLog) => {
  const audio_path = config.AUDIO_PATH;
  const interval = config.AUDIO_INTERVAL;
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio(audio_path));

  const handleAudioClick = useCallback(() => {
    setIsPlaying((prev) => {
      const newState = !prev;
      const message = createLogMessage(newState ? 'Audio playback started' : 'Audio playback stopped');
      addLog(message);
      return newState;
    });
  }, [addLog]);

  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      audio.play().catch((error) => {
        addLog(`Audio error: ${error.message}`);
      });
      intervalId = setInterval(() => {
        audio.play().catch((error) => {
          addLog(`Audio error: ${error.message}`);
        });
      }, interval);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isPlaying, audio, addLog, interval]);

  return { handleAudioClick, isPlaying };
};