import React from 'react';
import { useCsv } from '../../hooks/useCsv';
import '../ButtonGrid/ButtonGrid.css';

function CsvButton({ addLog }) {
  const { handleCsvClick } = useCsv(addLog);

  return (
    <button className="grid-button" onClick={handleCsvClick}>
      csv
    </button>
  );
}

export default CsvButton;