import { useCallback } from 'react';
import { createLogMessage } from '../utils/logUtils';
import { generateCsv } from '../utils/csvUtils';
import { getLatestSessionData } from '../utils/dbUtils';

export const useCsv = (addLog) => {
  const handleCsvClick = useCallback(async () => {
    try {
      const data = await getLatestSessionData();
      if (data.length === 0) {
        const message = createLogMessage('No IMU data to save');
        addLog(message);
        return;
      }
      generateCsv(data);
      const message = createLogMessage('CSV file saved');
      addLog(message);
    } catch (error) {
      const message = createLogMessage(`CSV save error: ${error.message}`);
      addLog(message);
    }
  }, [addLog]);

  return { handleCsvClick };
};