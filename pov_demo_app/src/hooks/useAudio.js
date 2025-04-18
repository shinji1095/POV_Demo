import { createLogMessage } from '../utils/logUtils';

export const useAudio = (addLog) => {
  const handleAudioClick = () => {
    const message = createLogMessage('Audio button clicked');
    addLog(message);
    console.log('Triggering audio playback');
  };

  return { handleAudioClick };
};