import React, { useState } from 'react';
import Section from '../components/Section';
import Error from '../components/Error';

const inputStyles: React.CSSProperties = {
  padding: '5px',
  marginBottom: '10px',
};

const inputParagraphStyles: React.CSSProperties = {
  marginBottom: '5px',
};

function ConvertFromCsv() {
  const [fileInputError, setFileInputError] = useState(false);
  const [fileInputErrorMessage, setFileInputErrorMessage] = useState('');

  const [smilesColumnError, setSmilesColumnError] = useState(false);
  const [smilesColumnErrorMessage, setSmilesColumnErrorMessage] = useState('');

  return (
    <Section title="Convert from CSV">
      <>
        <div style={inputStyles}>
          {fileInputError && <Error message={fileInputErrorMessage} />}
          <p style={inputParagraphStyles}>
            <label htmlFor="csv-file">CSV file:</label>
          </p>
          <input type="file" id="csv-file" name="csv-file" accept=".csv" />
        </div>

        <div style={inputStyles}>
          {smilesColumnError && <Error message={smilesColumnErrorMessage} />}
          <p style={inputParagraphStyles}>
            <label htmlFor="csv-smiles-column">
              Enter name of smiles column:
            </label>
          </p>
          <input type="text" id="csv-smiles-column" name="csv-smiles-column" />
        </div>

        <div style={inputStyles}>
          <p style={inputParagraphStyles}>
            <label htmlFor="csv-names-column">
              Enter the name of molecules column (optional):
            </label>
          </p>
          <input type="text" id="csv-names-column" name="csv-name-column" />
        </div>

        <div style={inputStyles}>
          <p style={inputParagraphStyles}>
            <label htmlFor="csv-format">
              Enter the generated files format (optional):
            </label>
          </p>
          <input type="text" id="csv-format" name="csv-format" value="png" />
        </div>

        <div style={{ ...inputStyles, marginBottom: '0px' }}>
          <p style={inputParagraphStyles}>
            <label htmlFor="csv-delimiter">
              Enter the CSV delimiter (optional):
            </label>
          </p>
          <input type="text" id="csv-delimiter" name="fname" value="," />
        </div>

        <div style={inputStyles}>
          <button
            style={{ marginRight: '10px' }}
            onClick={() => {
              console.log('Hoy');
            }}
          >
            Render
          </button>
          <button
            onClick={() => {
              console.log('Hoy');
            }}
          >
            Download
          </button>
        </div>
      </>
    </Section>
  );
}

export default ConvertFromCsv;
