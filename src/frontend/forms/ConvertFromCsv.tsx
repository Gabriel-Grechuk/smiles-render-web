import React, { useState } from 'react';
import Section from '../components/Section';
import Error from '../components/Error';
import SmilesCard from '../components/SmilesCard';
import * as csvTools from '../tools/csv';
import { zip } from '../tools/helpers';

const inputStyles: React.CSSProperties = {
  padding: '5px',
  marginBottom: '10px',
};

const inputParagraphStyles: React.CSSProperties = {
  marginBottom: '5px',
};

const smilesImageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
  width: '100%',
};

function ConvertFromCsv() {
  const [fileInputError, setFileInputError] = useState(false);
  const [fileInputErrorMessage, setFileInputErrorMessage] = useState('');

  const [smilesColumnError, setSmilesColumnError] = useState(false);
  const [smilesColumnErrorMessage, setSmilesColumnErrorMessage] = useState('');

  const [smilesToRender, setSmilesToRender] = useState([] as string[][]);

  const [defaultImageFormat, setDefaultImageFormat] = useState('png');
  const [defaultDelimiter, setDefaultDelimiter] = useState(',');

  const [formAction, setFormAction] = useState(
    undefined as 'render' | 'download' | undefined
  );

  const renderSmiles = (smiles: Array<[string, string]>) => {
    setSmilesToRender(smiles);
  };
  const downloadSmiles = (smiles: Array<[string, string]>) => {};

  const handleSubmit = (formData: FormData) => {
    setFileInputError(false);
    setSmilesColumnError(false);

    const csvFile = formData.get('csv-file') as File;
    const csvSmilesColumn = formData.get('csv-smiles-column');
    const csvNamesColumn = formData.get('csv-names-column');
    const csvDelimiter = formData.get('csv-delimiter') || '';

    if (!csvSmilesColumn) {
      console.error('No name for smiles column in CSV');
      setSmilesColumnError(true);
      setSmilesColumnErrorMessage('Required smiles column name');
      return;
    }

    csvFile.text().then((text: string) => {
      console.log('File content:', text);
      const delimiter = csvTools.getDelimiter(text);
      const csvData = csvTools.parseCSV(text, delimiter);
      const smiles = csvTools.getCSVColumn(csvData, csvSmilesColumn.toString());
      const names = csvNamesColumn
        ? csvTools.getCSVColumn(csvData, csvNamesColumn.toString())
        : ([] as string[]).fill('', 0, smiles.length);

      const smilesPayload = zip(smiles, names);
      if (formAction == 'render') renderSmiles(smilesPayload);
      else if (formAction == 'download') downloadSmiles(smilesPayload);
    });
  };

  return (
    <Section title="Convert from CSV">
      <form action={handleSubmit}>
        <div style={inputStyles}>
          {fileInputError && <Error message={fileInputErrorMessage} />}{' '}
          <p style={inputParagraphStyles}>
            <label htmlFor="csv-file">CSV file:</label>
          </p>
          <input type="file" name="csv-file" accept=".csv" />
        </div>

        <div style={inputStyles}>
          {smilesColumnError && <Error message={smilesColumnErrorMessage} />}{' '}
          <p style={inputParagraphStyles}>
            <label htmlFor="csv-smiles-column">
              Enter name of smiles column:
            </label>
          </p>
          <input type="text" name="csv-smiles-column" />
        </div>

        <div style={inputStyles}>
          <p style={inputParagraphStyles}>
            <label htmlFor="csv-names-column">
              Enter the name of molecules column(optional):
            </label>
          </p>
          <input type="text" name="csv-name-column" />
        </div>

        <div style={inputStyles}>
          <p style={inputParagraphStyles}>
            <label htmlFor="csv-format">
              Enter the generated files format(optional):
            </label>
          </p>
          <input
            type="text"
            name="csv-format"
            onChange={(e) => setDefaultImageFormat(e.target.value)}
            value={defaultImageFormat}
          />
        </div>

        <div style={{ ...inputStyles, marginBottom: '0px' }}>
          <p style={inputParagraphStyles}>
            <label htmlFor="csv-delimiter">
              Enter the CSV delimiter(optional):
            </label>
          </p>
          <input
            type="text"
            name="fname"
            onChange={(e) => setDefaultDelimiter(e.target.value)}
            value={defaultDelimiter}
          />
        </div>

        <div style={inputStyles}>
          <button
            type="submit"
            style={{ marginRight: '10px' }}
            onClick={() => setFormAction('render')}
          >
            Render
          </button>
          <button
            type="submit"
            style={{ marginRight: '10px' }}
            onClick={() => setFormAction('download')}
          >
            Download
          </button>
        </div>
        <div style={smilesImageStyle}>
          {[...new Set(smilesToRender)].map((smiles) => (
            <SmilesCard
              key={smiles[0]}
              smiles={smiles[0]}
              name={smiles[1] || undefined}
            />
          ))}
        </div>
      </form>
    </Section>
  );
}

export default ConvertFromCsv;
