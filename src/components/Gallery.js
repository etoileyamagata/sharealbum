import React from 'react';
import LikeButton from './LikeButton';

function Gallery({ photos, onPhotoClick }) {
  return (
    <div className="gallery-grid">
      {photos.map(photo => (
        <div key={photo.id} className="gallery-item">
          <img
            src={photo.url}
            alt=""
            className="gallery-thumb"
            onClick={() => onPhotoClick(photo)}
          />
        </div>
      ))}
    </div>
  );
}

export default Gallery;
