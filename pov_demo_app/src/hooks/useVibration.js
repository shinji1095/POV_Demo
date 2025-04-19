import { useState, useEffect, useCallback } from 'react';
import { createLogMessage } from '../utils/logUtils';
import { config } from '../config/config';

export const useVibration = (addLog) => {
  const [isVibrating, setIsVibrating] = useState(false);

  const handleVibrationClick = useCallback(() => {
    setIsVibrating((prev) => {
      const newState = !prev;
      const message = createLogMessage(newState ? 'Vibration started' : 'Vibration stopped');
      addLog(message);
      return newState;
    });
  }, [addLog]);

  useEffect(() => {
    let intervalId;
    if (isVibrating) {
      intervalId = setInterval(() => {
        navigator.vibrate(config.VIBRATION_DURATION);
      }, config.VIBRATION_INTERVAL);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
      navigator.vibrate(0);
    };
  }, [isVibrating]);

  return { handleVibrationClick, isVibrating };
};