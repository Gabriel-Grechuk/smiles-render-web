import React, { useState } from 'react';
import Section from '../components/Section';
import Error from '../components/Error';
import SmilesCard from '../components/SmilesCard';
import * as csvTools from '../tools/csv';
import { downloadBlob, zip } from '../tools/helpers';
import CSVViewer from '../components/CSVViewer';
import Select from 'react-select';

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
  columns: string[];
  smilesColumn: string;
  namesColumn: string;
  imageFormat: string;
}

interface CsvData {
  content: string[][];
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
    columns: [],
    smilesColumn: '',
    namesColumn: '',
    imageFormat: 'png',
  });
  const [csvData, setCsvData] = useState<CsvData>({
    content: [],
    delimiter: ',',
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

    const smiles = csvTools.getCSVColumn(
      csvData.content,
      formFields.smilesColumn.toString()
    );
    const names = formFields.namesColumn
      ? csvTools.getCSVColumn(
          csvData.content,
          formFields.namesColumn.toString()
        )
      : ([] as string[]).fill('', 0, smiles.length);

    const smilesPayload = zip(smiles, names);
    if (formAction == 'render') renderSmiles(smilesPayload);
    else if (formAction == 'download') downloadSmiles(smilesPayload);
  };

  const hadleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (!file) return;

    file.text().then((text: string) => {
      const delimiter = csvTools.getDelimiter(text);
      const content = csvTools.parseCSV(text, delimiter);
      const [header] = content;

      setCsvData({
        delimiter,
        content,
      });
      setFormFields({
        ...formFields,
        file: file,
        fileName: file ? file.name : '',
        columns: header,
      });
    });
  };

  return (
    <Section title="Convert from CSV">
      <div>
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
                  flexWrap: 'wrap',
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
                  onChange={hadleFileChange}
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
                <label>Enter name of smiles column:</label>
              </p>
              <Select
                placeholder="Select the smiles column..."
                value={
                  formFields.smilesColumn
                    ? {
                        value: formFields.smilesColumn,
                        label: formFields.smilesColumn,
                      }
                    : undefined
                }
                options={formFields.columns
                  .filter((column) => !!column)
                  .map((column) => {
                    return {
                      label: column,
                      value: column,
                    };
                  })}
                onChange={(e) => {
                  setFormFields({
                    ...formFields,
                    smilesColumn: e?.value || '',
                  });
                }}
              />
            </div>

            <div style={inputStyles}>
              <p style={inputParagraphStyles}>
                <label>Enter the name of molecules column(optional):</label>
              </p>
              <Select
                placeholder="Select the names column (optional)..."
                value={
                  formFields.namesColumn
                    ? {
                        value: formFields.namesColumn,
                        label: formFields.namesColumn,
                      }
                    : undefined
                }
                options={formFields.columns
                  .filter((column) => !!column)
                  .map((column) => {
                    return {
                      label: column,
                      value: column,
                    };
                  })}
                onChange={(e) => {
                  setFormFields({
                    ...formFields,
                    namesColumn: e?.value || '',
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
                value={csvData.delimiter}
                onChange={(e) => {
                  setCsvData({
                    ...csvData,
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
          </form>
          <CSVViewer
            data={csvData.content}
            selectedColumns={(() => {
              const columns: any = [];
              if (formFields.smilesColumn)
                columns.push({
                  name: formFields.smilesColumn,
                  color: '#cbdff2',
                });

              if (formFields.namesColumn)
                columns.push({
                  name: formFields.namesColumn,
                  color: '#cbf2da',
                });
              return columns;
            })()}
          />
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
      </div>
    </Section>
  );
}

export default ConvertFromCsv;
