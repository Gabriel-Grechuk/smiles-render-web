import React from 'react';

const cellStyle: React.CSSProperties = {
  border: '1px solid #000',
  padding: '10px',
};

const headerStyle: React.CSSProperties = {
  ...cellStyle,
  fontWeight: 'bold',
  backgroundColor: '#c9c9c9',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
};

function CSVViewer({
  data,
  selectedColumns,
}: {
  data: string[][];
  selectedColumns: {
    name: string;
    color: string;
  }[];
}) {
  const [head, ...tableData] = data;

  const columnsHighlight: Record<number, string> = {};

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
        height: '450px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        overflow: 'scroll',
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
