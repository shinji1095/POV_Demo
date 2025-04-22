import React from 'react';
import { useCsv } from '../../hooks/useCsv';

function CsvButton({ addLog }) {
  const { handleCsvClick } = useCsv(addLog);

  return (
    <button className="grid-button" onClick={handleCsvClick}>
      csv
    </button>
  );
}

export default CsvButton;