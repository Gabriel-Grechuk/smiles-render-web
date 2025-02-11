import React from 'react';

function CSVViewer({ data }: { data: string[][] }) {
  return (
    <div
      style={{
        width: '100%',
        height: '450px',
        border: 'solid 1px #000',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
      }}
    >
      {data.length ? <div></div> : <p>Select a CSV file</p>}
    </div>
  );
}

export default CSVViewer;
