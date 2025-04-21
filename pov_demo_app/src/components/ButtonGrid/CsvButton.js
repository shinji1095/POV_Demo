import React from 'react';
import { useCsv } from '../../hooks/useCsv';

function CsvButton({ addLog, imuBuffer, clearImuBuffer }) {
  const { handleCsvClick } = useCsv(addLog, imuBuffer, clearImuBuffer);

  return (
    <button className="grid-button" onClick={handleCsvClick}>
      csv
    </button>
  );
}

export default CsvButton;