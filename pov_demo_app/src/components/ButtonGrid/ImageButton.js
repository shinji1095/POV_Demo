import React from 'react';
import { useImage } from '../../hooks/useImage';
import '../ButtonGrid/ButtonGrid.css';

function ImageButton({ addLog }) {
  const { handleImageClick } = useImage(addLog);

  return (
    <button className="grid-button" onClick={handleImageClick}>
      画像
    </button>
  );
}

export default ImageButton;