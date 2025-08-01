import React, { forwardRef } from 'react';

const PhotoUpload = forwardRef(function PhotoUpload({ onUpload, name }, ref) {
  // 写真選択と同時に即アップロード
  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    if (!name || files.length === 0) return;
    onUpload({ name, files });
    e.target.value = '';
  };

  // UIに何も出さない（inputは非表示）
  return (
    <input
      type="file"
      multiple
      accept="image/*"
      style={{ display: 'none' }}
      ref={ref}
      onChange={handleChange}
    />
  );
});

export default PhotoUpload;
