import React, { useEffect } from 'react';

function VisitorCounter() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.counter12.com/ad.js?id=3D5cxyx3zc1D80c9';
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'center',
        border: 'none',
        alignItems: 'center',
      }}
    >
      <p
        style={{
          marginRight: '5px',
        }}
      >
        Visitors:
      </p>
      <a href="https://www.counter12.com">
        <img
          src="https://www.counter12.com/img-3D5cxyx3zc1D80c9-3.gif"
          alt="counter free"
        />
      </a>
    </div>
  );
}

export default VisitorCounter;
