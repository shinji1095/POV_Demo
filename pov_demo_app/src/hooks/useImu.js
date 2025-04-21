import { useState, useEffect, useCallback } from 'react';
import { createLogMessage } from '../utils/logUtils';
import { config } from '../config/config.js'

export const useImu = (addLog, addImuData, clearImuBuffer) => {
  const [isCollecting, setIsCollecting] = useState(false);

  const handleImuClick = useCallback(() => {
    setIsCollecting((prev) => {
      const newState = !prev;
      const message = createLogMessage(newState ? 'IMU collection started' : 'IMU collection stopped');
      addLog(message);
      if (newState) {
        clearImuBuffer(); // 新規取得前にバッファをクリア
      }
      return newState;
    });
  }, [addLog, clearImuBuffer]);

  useEffect(() => {
    let lastSampleTime = 0;
    const handleDeviceMotion = (event) => {
      const now = Date.now();
      if (now - lastSampleTime < 1000 / config.IMU_SAMPLING_RATE) return;
      lastSampleTime = now;
      const { x, y, z } = event.accelerationIncludingGravity || {};
      if (x !== null && y !== null && z !== null) {
        const data = {
          timestamp: new Date().toISOString(),
          x: x.toFixed(3),
          y: y.toFixed(3),
          z: z.toFixed(3),
        };
        addImuData(data);
      }
    };

    if (isCollecting) {
      window.addEventListener('devicemotion', handleDeviceMotion);
      // iOSでセンサー許可をリクエスト
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
          .then((permissionState) => {
            if (permissionState === 'granted') {
              addLog('IMU permission granted');
            } else {
              addLog('IMU permission denied');
              setIsCollecting(false);
            }
          })
          .catch((error) => {
            addLog(`IMU permission error: ${error.message}`);
            setIsCollecting(false);
          });
      }
    }

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [isCollecting, addImuData, addLog]);

  return { handleImuClick, isCollecting };
};