import React from 'react';

function Lightbox({ photo, onClose }) {
  if (!photo) return null;

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <img src={photo.url} alt="" className="lightbox-img" />
        <div className="lightbox-meta">
          <div className="lightbox-name">{photo.name}</div>
          {/* ここにいいねボタンなども追加可能 */}
        </div>
        <button className="lightbox-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}

export default Lightbox;
