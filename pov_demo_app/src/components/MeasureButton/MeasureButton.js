import React from 'react';
import './MeasureButton.css';

function MeasureButton({ onClick }) {
  return (
    <button className="measure-button" onClick={onClick}>
      計測開始
    </button>
  );
}

export default MeasureButton;