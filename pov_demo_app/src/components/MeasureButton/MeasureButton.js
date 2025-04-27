import React from 'react';
import './MeasureButton.css';

function MeasureButton({ state, handleMeasureClick }) {
  let btnText = '';

  switch (state) {
    case 0:
      btnText = '計測開始';
      console.log("0");
      break;
    case 1:
      btnText = '計測中…';
      console.log("1");
      break;
    case 2:
      btnText = '計測終了';
      console.log("2");
      break;
    case 3:
      btnText = '計測終了';
      console.log("3");
      break;
    default:
      break;
  }

  return (
    <div className="App">
      <button
        onClick={handleMeasureClick}
        className="measure-button"
        disabled={state === 2 || state === 3}
      >
        {btnText}
      </button>
    </div>
  );
}

export default MeasureButton;