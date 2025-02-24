import React from 'react';

const cellStyle: React.CSSProperties = {
  border: '1px solid #000',
  padding: '10px',
  fontSize: '14px',
};

const headerStyle: React.CSSProperties = {
  ...cellStyle,
  fontWeight: 'bold',
  backgroundColor: '#ffd230',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

function CSVViewer({
  data,
  selectedColumns,
}: {
  data: string[][];
  selectedColumns: {
    name: string;
    color: string;
    justifyContent: 'flex-start';
  }[];
}) {
  const [head, ...tableData] = data;

  const columnsHighlight: Record<number, string> = {};

  if (data.length)
    for (const highLight of selectedColumns) {
      const column = head.findIndex((item) => item === highLight.name);
      Object.assign(columnsHighlight, {
        [column]: highLight.color,
      });
    }

  return (
    <div
      style={{
        width: '100%',
        maxHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        padding: '50px',
        overflowY: 'scroll',
      }}
    >
      {data.length ? (
        <div style={tableStyle}>
          <table>
            <thead>
              <tr>
                {head.map((cell) => (
                  <th style={headerStyle} key={cell}>
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, index) => (
                    <td
                      style={{
                        ...cellStyle,
                        backgroundColor: columnsHighlight[index] || undefined,
                      }}
                      key={index}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Select a CSV file</p>
      )}
    </div>
  );
}

export default CSVViewer;
