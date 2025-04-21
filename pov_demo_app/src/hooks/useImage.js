import { createLogMessage } from '../utils/logUtils';

export const useImage = (addLog) => {
  let video = null;

  const handleImageClick = () => {
    const message = createLogMessage('Image button clicked');
    addLog(message);
    console.log('Capturing image from webcam');

    video = document.createElement('video');
    video.setAttribute('autoplay', true);
    video.setAttribute('playsinline', true);
    video.style.display = 'none';
    document.body.appendChild(video);

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        console.log('カメラアクセス成功！');
        }
      )
      .catch((err) => {
        console.error('カメラアクセスエラー:', err);
        }
      );
  };
  const getVideoElement = () => video;
  return { handleImageClick, getVideoElement };
};