import { createLogMessage } from '../utils/logUtils';

export const useAi = (addLog) => {
  const handleAiClick = () => {
    const message = createLogMessage('AI button clicked');
    addLog(message);
    console.log('Running YOLOv8 inference');
  };

  return { handleAiClick };
};