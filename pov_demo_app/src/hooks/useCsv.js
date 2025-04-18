import { createLogMessage } from '../utils/logUtils';

export const useCsv = (addLog) => {
  const handleCsvClick = () => {
    const message = createLogMessage('CSV button clicked');
    addLog(message);
    console.log('Generating CSV file');
  };

  return { handleCsvClick };
};