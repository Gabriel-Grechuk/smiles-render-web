import React from 'react';

function Error({ message }: { message: string }) {
  return (
    <div>
      <p
        style={{
          fontSize: '12px',
          color: 'red',
        }}
      >
        *{message}
      </p>
    </div>
  );
}

export default Error;
