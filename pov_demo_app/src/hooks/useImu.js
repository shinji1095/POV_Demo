import { useState, useEffect, useCallback } from 'react';
import { createLogMessage } from '../utils/logUtils';
import { saveImuData } from '../utils/dbUtils';

export const useImu = (addLog) => {
  const [isCollecting, setIsCollecting] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const handleImuClick = useCallback(() => {
    setIsCollecting((prev) => {
      const newState = !prev;
      const message = createLogMessage(newState ? 'IMU collection started' : 'IMU collection stopped');
      addLog(message);
      if (newState) {
        setSessionId(new Date().toISOString().replace(/[:.]/g, '')); // 新しいセッションID
      } else {
        setSessionId(null);
      }
      return newState;
    });
  }, [addLog]);

  useEffect(() => {
    const handleDeviceMotion = async (event) => {
      const { x, y, z } = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
      const { alpha, beta, gamma } = event.rotationRate || { alpha: 0, beta: 0, gamma: 0 };
      if (x !== null && y !== null && z !== null 
        && alpha !== null && beta !== null && gamma !== null 
        && sessionId) {
        const data = {
          timestamp: new Date().toISOString(),
          x: x.toFixed(3),
          y: y.toFixed(3),
          z: z.toFixed(3),
          alpha: (alpha || 0).toFixed(3),
          beta: (beta || 0).toFixed(3),
          gamma: (gamma || 0).toFixed(3),        
        };
        try {
          await saveImuData(sessionId, data);
        } catch (error) {
          addLog(`IMU save error: ${error.message}`);
        }
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
              setSessionId(null);
            }
          })
          .catch((error) => {
            addLog(`IMU permission error: ${error.message}`);
            setIsCollecting(false);
            setSessionId(null);
          });
      }
    }

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [isCollecting, sessionId, addLog]);

  return { handleImuClick, isCollecting };
};