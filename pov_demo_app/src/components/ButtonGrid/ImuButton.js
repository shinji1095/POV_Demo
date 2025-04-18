import React from 'react';
import { useImu } from '../../hooks/useImu';
import '../ButtonGrid/ButtonGrid.css';

function ImuButton({ addLog }) {
  const { handleImuClick } = useImu(addLog);

  return (
    <button className="grid-button" onClick={handleImuClick}>
      IMU
    </button>
  );
}

export default ImuButton;