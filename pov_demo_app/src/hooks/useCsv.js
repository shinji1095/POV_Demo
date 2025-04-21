import { useCallback } from 'react';
import { createLogMessage } from '../utils/logUtils';
import { generateCsv } from '../utils/csvUtils';

export const useCsv = (addLog, imuBuffer, clearImuBuffer) => {
  const handleCsvClick = useCallback(() => {
    if (imuBuffer.length === 0) {
      const message = createLogMessage('No IMU data to save');
      addLog(message);
      return;
    }

    try {
      generateCsv(imuBuffer);
      const message = createLogMessage('CSV file saved');
      addLog(message);
      clearImuBuffer();
    } catch (error) {
      const message = createLogMessage(`CSV save error: ${error.message}`);
      addLog(message);
    }
  }, [addLog, imuBuffer, clearImuBuffer]);

  return { handleCsvClick };
};