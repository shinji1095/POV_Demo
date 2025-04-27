export const config = {
    // 音声関係
    AUDIO_INTERVAL: 1, 
    AUDIO_PATH: '/sound/bad_highlow_2_speed_1.mp3',

    // 振動関係
    VIBRATION_DURATION: 500,  // 振動時間（ms）
    VIBRATION_INTERVAL: 1000, // 振動+停止の合計周期（ms）

    // IMU
    IMU_SAMPLING_RATE: 50,    // Hz

    // CSV関係
    OUTPUT_DIR: '/sdcard/Download/',

    // AI関係
    TFLITE_MODEL_PATH: '/model/best_classification_float32.tflite'
  };