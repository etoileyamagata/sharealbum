import React, { useEffect } from 'react';

function Toast({ message, onClose, duration = 2200 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

return (
  <div className="toast-popup" style={{ zIndex: 10001 }}>
    {message}
  </div>
);

}

export default Toast;
