import React from 'react';
import './LogTextField.css';

function LogTextField({ logs }) {
  return (
    <textarea
      className="log-textfield"
      value={logs.join('\n')}
      readOnly
      placeholder="ログ"
    />
  );
}

export default LogTextField;