import React, { useState } from 'react';
import MeasureButton from './components/MeasureButton/MeasureButton';
import LogTextField from './components/LogTextField/LogTextField';

function App() {
  const [state, setState] = useState(0);
  const [message, setMessage] = useState('');

  const handleMeasureClick = () => {
    if (state === 0) {
      setState(1);
    } else if (state === 1) {
      const isSuccess = Math.random() > 0.3;
      if (isSuccess) {
        setState(2);
        setMessage('計測が正常に完了しました．');
      } else {
        setState(3);
        setMessage('エラー：和田研究室の江藤か下村に連絡して下さい．');
      }
    }
  };

  const handleOkClick = () => {
    setState(0);
    setMessage('');
  };

  let clr = '#ffffff';
  if (state === 1) {
    clr = '#ffff00';
  }
  else if (state === 2) {
    clr = '#00ff00';
  }
  else if (state === 3) {
    clr = '#ff0000';
  }

  return (
    <div style={{ backgroundColor: clr }}>
      <LogTextField message={message} state={state} onOkClick={handleOkClick} />
      <MeasureButton state={state} handleMeasureClick={handleMeasureClick} />
    </div>
  );
}

export default App;