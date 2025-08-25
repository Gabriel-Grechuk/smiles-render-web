import React, { useEffect, useState } from 'react';

const smilesPrectionComponent: React.CSSProperties = {
  margin: '10px',
  padding: '15px',
  boxShadow: '2px 4px 10px #333',
  maxWidth: '100%',
  borderRadius: '10px',
};

const smilesPrectionCard: React.CSSProperties = {
  margin: '10px',
};

const cellStyle: React.CSSProperties = {
  border: '1px solid #000',
  padding: '10px',
  fontSize: '14px',
  textAlign: 'center',
  verticalAlign: 'middle',
};

const headerStyle: React.CSSProperties = {
  ...cellStyle,
  fontWeight: 'bold',
  backgroundColor: '#ffd230',
};

const predictionImageStyles: React.CSSProperties = {
  width: '100%',
  maxWidth: '350px',
};

function Prediction(props: { smiles: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [fields, setFields] = useState<
    {
      head: string[];
      data: string[];
    }[]
  >([
    {
      head: [],
      data: [],
    },
  ]);

  useEffect(() => {
    setIsLoading(true);

    fetch(`/predict/base64/${encodeURIComponent(window.btoa(props.smiles))}}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((predictResponse) => {
        const parser = new DOMParser();
        const importedDoc = parser.parseFromString(
          predictResponse,
          'text/html'
        );
        const elements = importedDoc.querySelectorAll('#tablePreview');

        const values: any[] = [];

        for (const value of elements) {
          const head = value.querySelector('thead')!.querySelector('tr')!;
          const body = value.querySelector('tbody')!.querySelector('tr')!;

          const headIndexes: string[] = [];
          const bodyValues: string[] = [];

          for (const node of head.childNodes as unknown as any[])
            if (node.innerText) headIndexes.push(node.innerText.trim());

          for (const node of body.childNodes as unknown as any[]) {
            const value = node.textContent.trim();
            if (value) {
              bodyValues.push(value.split('\n')[0].trim());
            } else if (node.querySelector && node.querySelector('img')) {
              bodyValues.push(node.querySelector('img').src);
            }
          }

          values.push({
            head: headIndexes,
            data: bodyValues,
          });
        }

        setFields(values);

        setIsLoading(false);
      })
      .catch((err) => {
        console.log('Error here:', err);
        setIsError(true);
      });
  }, []);

  const renderContent = () => {
    if (isLoading && !isError) {
      return (
        <div style={{ margin: '25px' }}>
          <p
            style={{
              fontSize: '16px',
            }}
          >
            Predicting{' '}
            <strong
              style={{
                fontWeight: 'bold',
              }}
            >
              {props.smiles}
            </strong>
            , it may take a few seconds...
          </p>
        </div>
      );
    }

    if (!isLoading && !isError) {
      return (
        <div style={smilesPrectionComponent}>
          <div style={smilesPrectionCard}>
            <p style={{ marginBottom: '20px', fontSize: '16px' }}>
              Predicted SMILES:{' '}
              <strong style={{ fontWeight: 'bold' }}>{props.smiles}</strong>
            </p>
            {fields.map((prediction, i) => (
              <>
                <table
                  key={`table-${i}`}
                  style={{
                    marginBottom: '30px',
                    boxShadow: '2px 4px 10px #333',
                    width: '100%',
                  }}
                >
                  <thead>
                    <tr>
                      {prediction.head.map((cell, index) => (
                        <th
                          style={headerStyle}
                          key={`head-${index}-${props.smiles}`}
                        >
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {prediction.data.map((cell, index) => (
                        <td
                          style={cellStyle}
                          key={`cell-${index}-${props.smiles}`}
                        >
                          {cell.startsWith('data:image/png;base64') ? (
                            <img
                              src={cell}
                              style={predictionImageStyles}
                              alt="prediction"
                            />
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </>
            ))}
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div style={{ margin: '25px' }}>
          <p>Could not predict {props.smiles}</p>
        </div>
      );
    }

    return null;
  };

  return <>{renderContent()}</>;
}

export default Prediction;
