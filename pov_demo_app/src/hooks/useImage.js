import { createLogMessage } from '../utils/logUtils';

export const useImage = (addLog) => {
  const handleImageClick = () => {
    const message = createLogMessage('Image button clicked');
    addLog(message);
    console.log('Capturing image from webcam');
  };

  return { handleImageClick };
};