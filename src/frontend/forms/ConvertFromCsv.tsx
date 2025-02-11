import React, { act, useState } from 'react';
import Section from '../components/Section';
import Error from '../components/Error';
import SmilesCard from '../components/SmilesCard';
import * as csvTools from '../tools/csv';
import { downloadBlob, zip } from '../tools/helpers';
import CSVViewer from '../components/CSVViewer';

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

interface ConvertFields {
  file: File | null;
  fileName: string;
  smilesColumn: string;
  namesColumn: string;
  imageFormat: string;
  delimiter: string;
}

interface InputError {
  message: string;
}

function ConvertFromCsv() {
  const [fileInputError, setFileInputError] = useState<InputError | null>(null);
  const [smilesError, setSmilesError] = useState<InputError | null>(null);
  const [smilesToRender, setSmilesToRender] = useState<string[][]>([]);
  const [formAction, setFormAction] = useState(
    undefined as 'render' | 'download' | undefined
  );
  const [formFields, setFormFields] = useState<ConvertFields>({
    file: null,
    fileName: '',
    smilesColumn: '',
    namesColumn: '',
    delimiter: ',',
    imageFormat: 'png',
  });

  const renderSmiles = (smiles: Array<[string, string]>) => {
    setSmilesToRender(smiles);
  };

  const downloadSmiles = (smiles: Array<[string, string]>) => {
    fetch('/render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        smiles: smiles.map((data) => {
          const [smiles, name] = data;
          return {
            smiles,
            name,
            format: 'png',
          };
        }),
      }),
    })
      .then((response) => response.blob())
      .then((blob) => downloadBlob({ name: 'smiles.zip', blob }))
      .finally(() => {
        setFileInputError(null);
        setSmilesError(null);
      })
      .catch((error) => {
        console.error('Could not download smiles zip:', error);
        setFileInputError({
          message: `Could not download smiles zip: ${error}`,
        });
      });
  };

  const handleSubmit = () => {
    setFileInputError(null);
    setSmilesError(null);

    if (!formFields.file) {
      console.error('No CSV file selected');
      setFileInputError({
        message: 'Select a CSV file.',
      });
      return;
    }

    if (!formFields.smilesColumn) {
      console.error('No name for smiles column in CSV');
      setSmilesError({
        message: 'Required smiles column name',
      });
      return;
    }

    formFields.file?.text().then((text: string) => {
      const delimiter = csvTools.getDelimiter(text);
      const csvData = csvTools.parseCSV(text, delimiter);
      const smiles = csvTools.getCSVColumn(
        csvData,
        formFields.smilesColumn.toString()
      );
      const names = formFields.namesColumn
        ? csvTools.getCSVColumn(csvData, formFields.namesColumn.toString())
        : ([] as string[]).fill('', 0, smiles.length);

      const smilesPayload = zip(smiles, names);
      if (formAction == 'render') renderSmiles(smilesPayload);
      else if (formAction == 'download') downloadSmiles(smilesPayload);
    });
  };

  return (
    <Section title="Convert from CSV">
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <form action={handleSubmit}>
          <div style={inputStyles}>
            {fileInputError && <Error message={fileInputError.message} />}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <p style={inputParagraphStyles}>
                <label
                  htmlFor="csv-file"
                  style={{
                    border: '1px solid #ccc',
                    display: 'inline-block',
                    padding: '6px 12px',
                    cursor: 'pointer',
                  }}
                >
                  Select a CSV file
                </label>
              </p>
              <input
                type="file"
                id="csv-file"
                name="csv-file"
                accept=".csv"
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  setFormFields({
                    ...formFields,
                    file,
                    fileName: file ? file.name : '',
                  });
                }}
                style={{
                  display: 'none',
                }}
              />
              {formFields.fileName && (
                <p style={{ marginLeft: '5px' }}>
                  Selected: "{formFields.fileName}"
                </p>
              )}
            </div>
          </div>

          <div style={inputStyles}>
            {smilesError && <Error message={smilesError.message} />}
            <p style={inputParagraphStyles}>
              <label htmlFor="csv-smiles-column">
                Enter name of smiles column:
              </label>
            </p>
            <input
              type="text"
              name="csv-smiles-column"
              value={formFields.smilesColumn}
              onChange={(e) => {
                setFormFields({
                  ...formFields,
                  smilesColumn: e.target.value,
                });
              }}
            />
          </div>

          <div style={inputStyles}>
            <p style={inputParagraphStyles}>
              <label htmlFor="csv-names-column">
                Enter the name of molecules column(optional):
              </label>
            </p>
            <input
              type="text"
              name="csv-name-column"
              value={formFields.namesColumn}
              onChange={(e) => {
                setFormFields({
                  ...formFields,
                  namesColumn: e.target.value,
                });
              }}
            />
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
              value={formFields.imageFormat}
              onChange={(e) => {
                setFormFields({
                  ...formFields,
                  imageFormat: e.target.value,
                });
              }}
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
              value={formFields.delimiter}
              onChange={(e) => {
                setFormFields({
                  ...formFields,
                  delimiter: e.target.value,
                });
              }}
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
        <CSVViewer data={[]} />
      </div>
    </Section>
  );
}

export default ConvertFromCsv;
