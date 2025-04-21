import React from 'react';
import { useImu } from '../../hooks/useImu';

function ImuButton({ addLog, addImuData, clearImuBuffer }) {
  const { handleImuClick, isCollecting } = useImu(addLog, addImuData, clearImuBuffer);

  return (
    <button className="grid-button" onClick={handleImuClick}>
      {isCollecting ? 'IMU停止' : 'IMU'}
    </button>
  );
}

export default ImuButton;