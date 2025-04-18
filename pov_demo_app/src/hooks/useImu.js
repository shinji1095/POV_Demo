import { createLogMessage } from '../utils/logUtils';

export const useImu = (addLog) => {
  const handleImuClick = () => {
    const message = createLogMessage('IMU button clicked');
    addLog(message);
    console.log('Starting IMU data collection');
  };

  return { handleImuClick };
};