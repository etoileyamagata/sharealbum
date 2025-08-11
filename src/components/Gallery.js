import React from 'react';
import LikeButton from './LikeButton';

function Gallery({
  photos,
  onPhotoClick,
  // ★選択モード用（App側から渡されます。未指定時は通常動作）
  selectMode = false,
  selectedIds = [],
  onToggleSelect
}) {
  const handleThumbClick = (photo) => {
    if (selectMode) {
      // 選択モード中はLightboxを開かず、選択状態をトグル
      if (onToggleSelect) onToggleSelect(photo.id);
    } else {
      // 通常時はLightboxを開く
      if (onPhotoClick) onPhotoClick(photo);
    }
  };

  return (
    <div className="gallery-grid">
{photos.map((photo, index) => {
  const isSelected = Array.isArray(selectedIds) && selectedIds.includes(photo.id);
  return (
    <div
      key={photo.id}
      className="gallery-item"
      onClick={() => handleThumbClick(photo)}
      role={selectMode ? 'button' : undefined}
      aria-pressed={selectMode ? !!isSelected : undefined}
      tabIndex={0}
      style={{
        position: 'relative',
        cursor: 'pointer',
        outline: 'none',
        // 選択中は枠で視覚化（CSS追加不要の最小実装）
        boxShadow: isSelected ? '0 0 0 3px #1976d2 inset' : 'none',
        borderRadius: 8
      }}
    >
      {/* チェックバッジ（選択モード時のみ表示） */}
      {selectMode && (
        <div
          style={{
            position: 'absolute',
            top: 6,
            left: 6,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: isSelected ? '#1976d2' : 'rgba(0,0,0,0.45)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            zIndex: 2,
            userSelect: 'none'
          }}
        >
          {isSelected ? '✓' : ''}
        </div>
      )}

      <img
        src={photo.url}
        alt=""
        className="gallery-thumb"
        loading={typeof index === 'number' && index < 12 ? 'eager' : 'lazy'}
        decoding="async"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          borderRadius: 8
        }}
      />
    </div>
  );
})}
    </div>
  );
}

export default Gallery;
