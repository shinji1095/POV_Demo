import { useState, useEffect, useCallback, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { loadTFLiteModel, setWasmPath } from '@tensorflow/tfjs-tflite';
import '@tensorflow/tfjs-backend-wasm';

import { config } from '../config/config';

setWasmPath('/static/js/');

export const useAi = (addLog) => {
  const [isRunning, setIsRunning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));
  const tfliteModelRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.setBackend('wasm');
        await tf.ready();
        const model = await loadTFLiteModel(config.TFLITE_MODEL_PATH);
        tfliteModelRef.current = model;
        console.log('TF Lite model loaded');
      } catch (error) {
        console.error(`Model load error: ${error.message}`);
      }
    };
    loadModel();
  }, []);

  const preprocessImage = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, 640, 640);
    const { data } = imageData;
    const floatData = new Float32Array(1 * 3 * 640 * 640);

    for (let i = 0, j = 0; i < data.length; i += 4) {
      floatData[j] = data[i] / 255.0;
      floatData[j + 640 * 640] = data[i + 1] / 255.0;
      floatData[j + 2 * 640 * 640] = data[i + 2] / 255.0;
      j++;
    }

    return tf.tensor4d(floatData, [1, 640, 640, 3]);
  };

  const softmax = (arr) => {
    const max = Math.max(...arr);
    const exp = arr.map((x) => Math.exp(x - max));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map((x) => x / sum);
  };

  const runInference = async () => {
    if (!videoRef.current || !tfliteModelRef.current) return;

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
      addLog(`Inference result: ${JSON.stringify(result)} (Time: ${elapsedMs} ms)`);
      inputTensor.dispose();
      outputTensor.dispose();
    } catch (error) {
      addLog(`Inference error: ${error.message}`);
    }
  };

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      videoRef.current = document.createElement('video');
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      console.log('Camera started');

      setIsRunning(true);

      intervalRef.current = setInterval(runInference, 100);
    } catch (error) {
      console.error(`Camera error: ${error.message}`);
    }
  }, []);

  const stop = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    console.log('Camera stopped');
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { start, stop, isRunning };
};
