import { createLogMessage } from '../utils/logUtils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const useImage = (addLog) => {
  let video = null;
  let stream = null;
  let canvas = null;
  let img = null;
  let n = 0;

  const handleImageClick = async () => {
    const message = createLogMessage('Image button clicked');
    addLog(message);
    console.log('Capturing image from webcam');

    caputureBurstImage();
  };

  async function caputureBurstImage (durationMs = 1000) {
    try {
      video = document.createElement('video');
      video.setAttribute('autoplay', true);
      video.setAttribute('playsinline', true);
      video.style.display = 'none';
      document.body.appendChild(video);
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      video.srcObject = stream;
      console.log('カメラアクセス成功！');

      await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            video.play();
            resolve();
          };
        }
      );

      canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      const start = performance.now();
      const zip = new JSZip();

      while (performance.now() - start < durationMs) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        img = canvas.toDataURL('image/png');
        const binary = atob(img.split(',')[1]);
        const array = Uint8Array.from(binary, (char) => char.charCodeAt(0));
        zip.file(n + '.png', array);

        n++;

        //await wait(33);
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'burst_images.zip');

      stream.getTracks().forEach((track) => track.stop());
      video.remove();
      console.log('撮影完了');
    }
    
    catch (err) {
      console.error('カメラアクセスエラー:', err);
    }
  };
  //const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  return { handleImageClick };
};