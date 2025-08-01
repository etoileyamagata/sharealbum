import React, { useState } from 'react';
import { ReactComponent as HeartIcon } from '../icon/heart.svg'; // ←アイコンの場所に合わせて修正

function LikeButton({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    if (!liked) {
      setCount(count + 1);
      setLiked(true);
    }
  };

  return (
    <button
      className={`like-btn${liked ? ' liked' : ''}`}
      onClick={handleLike}
      aria-label="いいね"
      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
    >
      <HeartIcon
        width={20}
        height={20}
        style={{ fill: liked ? '#c9150c' : '#e95950', transition: 'fill 0.2s' }}
      />
      {count}
    </button>
  );
}

export default LikeButton;
