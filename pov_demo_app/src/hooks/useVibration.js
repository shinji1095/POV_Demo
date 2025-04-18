import { createLogMessage } from '../utils/logUtils';

export const useVibration = (addLog) => {
  const handleVibrationClick = () => {
    const message = createLogMessage('Vibration button clicked');
    addLog(message);
    // navigator.vibrate(200);
    console.log('Triggering vibration');
  };

  return { handleVibrationClick };
};