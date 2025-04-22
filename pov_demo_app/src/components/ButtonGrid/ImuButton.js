import React from 'react';
import { useImu } from '../../hooks/useImu';

function ImuButton({ addLog }) {
  const { handleImuClick, isCollecting } = useImu(addLog);

  return (
    <button className="grid-button" onClick={handleImuClick}>
      {isCollecting ? 'IMU停止' : 'IMU'}
    </button>
  );
}

export default ImuButton;