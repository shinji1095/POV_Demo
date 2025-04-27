import React from 'react';
import './LogTextField.css';

function LogTextField({ message, state, onOkClick }) {
  return (
    <div className="log-textfield-wrapper">
      <div className="log-textfield-container">
        <textarea
          className="log-textfield"
          value={message}
          readOnly
          placeholder="ログ"
        />
        {(state === 2 || state === 3) && (
          <button onClick={onOkClick} className="ok-button">
            OK
          </button>
        )}
      </div>
    </div>
  );
}

export default LogTextField;