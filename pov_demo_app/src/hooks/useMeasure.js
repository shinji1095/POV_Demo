import { useState, useEffect, useCallback, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { loadTFLiteModel, setWasmPath } from '@tensorflow/tfjs-tflite';
import '@tensorflow/tfjs-backend-wasm';

import { config } from '../config/config';
import { generateCsv } from '../utils/csvUtils';
import { createLogMessage } from '../utils/logUtils';
import { softmax, preprocessImage } from '../utils/aiUtils.js';
import { saveImuData, getLatestSessionData } from '../utils/dbUtils';

// Loading Web Assembly
setWasmPath('/static/js/');

export const useMeasure = (addLog) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [audioSrc, setAudioSrc] = useState(config.AUDIO_PATHS.bad);

  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));
  const tfliteModelRef = useRef(null);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const lastVibrateTimeRef = useRef(0);

  // Load Model
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.setBackend('wasm');
        await tf.ready();
        const model = await loadTFLiteModel(config.TFLITE_MODEL_PATH);
        tfliteModelRef.current = model;
        console.log(createLogMessage('TF Lite model loaded'));
      } catch (error) {
        console.log(createLogMessage(`Model load error: ${error.message}`));
      }
    };
    loadModel();
  }, []);

  const triggerVibration = () => {
    const now = performance.now();
    if (now - lastVibrateTimeRef.current > config.VIBRATION_INTERVAL) {
      navigator.vibrate(config.VIBRATION_DURATION);
      lastVibrateTimeRef.current = now;
    }
  };

  // Audio Setup
  useEffect(() => {
    const audioInstance = new Audio(audioSrc);
    audioInstance.loop = true; // ループ再生
    audioRef.current = audioInstance;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  useEffect(() => {
    let intervalId;
    if (isPlaying && audioRef.current) {
      intervalId = setInterval(() => {
        audioRef.current.play().catch((error) => {
          console.log(createLogMessage(`Audio play error: ${error.message}`));
        });
      }, config.AUDIO_INTERVAL);
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioSrc;
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.log(createLogMessage(`Audio play error: ${error.message}`));
        });
      }
    }
  }, [audioSrc, isPlaying]);

  const runMeasurement = useCallback(async () => {
    if (!videoRef.current || !tfliteModelRef.current) {
      console.log(createLogMessage('Video or model not ready'));
      return;
    }

    const canvas = canvasRef.current;
    canvas.width = 640;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, 640, 640);

    try {
      const start = performance.now();
      const inputTensor = preprocessImage(canvas);
      const outputTensor = tfliteModelRef.current.predict(inputTensor);
      const scores = await outputTensor.data();
      const probabilities = softmax(scores);
      const result = {
        'Bad view': probabilities[0].toFixed(3),
        'Good view': probabilities[1].toFixed(3),
      };
      const end = performance.now();
      const elapsedMs = (end - start).toFixed(2);
      console.log(createLogMessage(`Inference result: ${JSON.stringify(result)} (Time: ${elapsedMs} ms)`));
      console.log(`bad probability: ${probabilities[0]} , goog probability: ${probabilities[1]}`)
      if (probabilities[0] > 0.5){
        navigator.vibrate(0);
      }else{
        triggerVibration(100);
      }
      const newSrc = probabilities[0] > 0.5 ? config.AUDIO_PATHS.bad : config.AUDIO_PATHS.good;
      setAudioSrc(newSrc);

      inputTensor.dispose();
      outputTensor.dispose();
    } catch (error) {
      console.log(createLogMessage(`Inference error: ${error.message}`));
    }
  }, []);

//   useEffect(() => {
//     let intervalId;
//     if (isVibrating) {
//       intervalId = setInterval(() => {
//         navigator.vibrate(config.VIBRATION_DURATION);
//       }, config.VIBRATION_INTERVAL);
//     }
//     return () => {
//       if (intervalId) clearInterval(intervalId);
//       navigator.vibrate(0);
//     };
//   }, [isVibrating]);

  // Collecting Imu Data
  useEffect(() => {
    const handleDeviceMotion = async (event) => {
      const { x, y, z } = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
      const { alpha, beta, gamma } = event.rotationRate || { alpha: 0, beta: 0, gamma: 0 };
      if (x !== null && y !== null && z !== null && sessionId) {
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
          console.log(createLogMessage('IMU data saved'));
        } catch (error) {
          console.log(createLogMessage(`IMU save error: ${error.message}`));
        }
      }
    };

    if (isCollecting && sessionId) {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [isCollecting, sessionId]);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      videoRef.current = document.createElement('video');
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      const newSessionId = new Date().toISOString().replace(/[:.]/g, '');
      setSessionId(newSessionId);
      console.log(createLogMessage('Camera started'));

      // iOS permission for IMU
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        try {
          const permissionState = await DeviceMotionEvent.requestPermission();
          if (permissionState === 'granted') {
            console.log(createLogMessage('IMU permission granted'));
            setIsCollecting(true);
          } else {
            console.log(createLogMessage('IMU permission denied'));
            setIsCollecting(false);
            setSessionId(null);
            return;
          }
        } catch (error) {
          console.log(createLogMessage(`IMU permission error: ${error.message}`));
          setIsCollecting(false);
          setSessionId(null);
          return;
        }
      } else {
        setIsCollecting(true); // Android or non-iOS
      }

      setIsRunning(true);
      setIsPlaying(true);
      intervalRef.current = setInterval(runMeasurement, 400);
    } catch (error) {
      console.log(createLogMessage(`Camera error: ${error.message}`));
    }
  }, []);

  const stop = useCallback(async () => {
    setIsRunning(false);
    console.log(createLogMessage('Camera stopped'));
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Stop Vibration
    navigator.vibrate(0);
    // Stop Audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    // Stop IMU
    setIsCollecting(false);  
    // Save CSV
    if (sessionId) {
      try {
        const data = await getLatestSessionData();
        if (data.length > 0) {
          generateCsv(data);
          console.log(createLogMessage('CSV file saved'));
        } else {
          console.log(createLogMessage('No IMU data to save'));
        }
      } catch (error) {
        console.log(createLogMessage(`CSV save error: ${error.message}`));
      }
    }
    setSessionId(null);
  }, [sessionId]);

  useEffect(() => {
    return () => {
      if (isRunning) stop();
    };
  }, [isRunning, stop]);

  return { start, stop, isRunning };
};