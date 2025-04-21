import { config } from '../config/config';

export const generateCsv = (imuBuffer) => {
  const headers = ['timestamp', 'x', 'y', 'z'];
  const csvRows = [headers.join(',')];

  imuBuffer.forEach((data) => {
    const row = [
      data.timestamp,
      data.x,
      data.y,
      data.z,
    ].join(',');
    csvRows.push(row);
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '');
  const fileName = `imu_data_${timestamp}.csv`;
  const outputDir = config.OUTPUT_DIR;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${outputDir}/${fileName}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};