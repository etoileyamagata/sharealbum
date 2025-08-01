import React, { useState, useEffect, useRef } from 'react';

// 配列シャッフル関数
function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function SlideShow({ photos, interval = 6000, onClose }) {
  const [shuffled, setShuffled] = useState(() => shuffleArray(photos));
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const timerRef = useRef();

  // 新しいphotosが来たときもリシャッフル
  useEffect(() => {
    setShuffled(shuffleArray(photos));
    setIdx(0);
    setFade(false);
  }, [photos]);

  useEffect(() => {
    setFade(false);
    const fadeIn = setTimeout(() => setFade(true), 80); // フェードイン
    const timer = setTimeout(() => {
      setFade(false); // フェードアウト
      setTimeout(() => {
        // 最後まで到達したら再シャッフル
        if (idx === shuffled.length - 1) {
          setShuffled(shuffleArray(shuffled));
          setIdx(0);
        } else {
          setIdx(i => i + 1);
        }
      }, 1100);
    }, interval - 1100);

    return () => {
      clearTimeout(fadeIn);
      clearTimeout(timer);
    };
  }, [idx, shuffled, interval]);

  if (!shuffled.length || errorCount >= shuffled.length) return (
    <div style={{textAlign:'center',marginTop:40,fontSize:'1.5rem',color:'#888'}}>
      表示できる写真がありません
    </div>
  );

  // フルスクリーン解除
  const exitFullScreen = () => {
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } catch (e) {}
  };

  const handleClose = () => {
    exitFullScreen();
    if (onClose) onClose();
  };

  return (
    <div style={{
      minHeight:'100vh',
      background:'#111',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      position:'fixed', left:0, top:0, width:'100vw', height:'100vh', zIndex:9999,
      overflow: 'hidden'
    }}>
      <img
        src={shuffled[idx]?.url || ""}
        alt=""
        style={{
          maxHeight: '80vh',
          maxWidth: '90vw',
          borderRadius: 34,
          boxShadow: '0 8px 38px #111b',
          background: '#222',
          transition: 'opacity 1.1s cubic-bezier(0.8,0,0.2,1)',
          opacity: fade ? 1 : 0,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1.09)',
        }}
        onError={() => {
          setErrorCount(c => c + 1);
          setIdx(i => (i + 1) % shuffled.length);
        }}
      />

      <div style={{
        color: '#fff',
        marginTop: 26,
        fontSize: '1.32rem',
        letterSpacing: 1.2,
        position: 'absolute',
        top: '72vh',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 12,
        textShadow: '0 2px 14px #222c',
        transition: 'opacity 1.1s cubic-bezier(0.8,0,0.2,1)',
        opacity: fade ? 1 : 0
      }}>
        {shuffled[idx]?.name}
      </div>

      <div style={{
        position: 'absolute', bottom: 38, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8, zIndex: 20
      }}>
        {shuffled.map((_, i) => (
          <div
            key={i}
            style={{
              width: 22, height: 5, borderRadius: 3,
              background: i === idx ? '#3b82f6' : '#444',
              transition: 'background 0.3s'
            }}
          />
        ))}
      </div>

      <button onClick={handleClose} style={{
        position: 'absolute', top: 22, right: 22, fontSize: '2.2rem',
        color: '#fff', background: 'rgba(40,40,40,0.85)',
        border: 'none', borderRadius: 14, padding: '4px 18px', cursor: 'pointer', zIndex: 30
      }}>✕</button>
    </div>
  );
}

export default SlideShow;
