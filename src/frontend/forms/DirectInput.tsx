import React, { useRef } from 'react';
import { useState } from 'react';
import Section from '../components/Section';
import SmilesCard from '../components/SmilesCard';
import { downloadBlob } from '../tools/helpers';

const defaultSmiles = [
  'CCCCCCCC',
  'C0CCCCC0C0CCCCC0',
  'N#N',
  'OC[C@@H](O1)[C@@H](O)[C@H](O)[C@@H](O)[C@H](O)1',
];

const smilesImageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
  width: '100%',
};

function DirectInput() {
  const [smiles, setSmiles] = useState(defaultSmiles);
  const [smilesToRender, setSmilesToRender] = useState([] as string[]);
  const [error, setError] = useState(false);

  function loadSmiles() {
    setSmilesToRender(smiles);
  }

  function downloadSmiles() {
    fetch('/render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format: 'png', smiles }),
    })
      .then((response) => response.blob())
      .then((blob) => downloadBlob({ name: 'smiles.zip', blob }))
      .finally(() => setError(false))
      .catch((error) => {
        console.error('Could not download smiles zip:', error);
        setError(true);
      });
  }

  return (
    <Section title="Direct input">
      <>
        <div>
          <p style={{ marginBottom: '10px' }}>
            <label> Enter your smiles : </label>
          </p>
          <textarea
            style={{
              width: '100%',
            }}
            defaultValue={defaultSmiles.join('\n')}
            rows={6}
            onChange={(event) => {
              setSmiles(event.target.value.split('\n'));
            }}
          ></textarea>
        </div>
        <div style={{ padding: '10px 0px 10px 0px' }}>
          {error ? (
            <p style={{ color: 'red', padding: '10px' }}>
              Could not download the smiles! Check the smiles input and try
              again.
            </p>
          ) : null}
          <button style={{ marginRight: '10px' }} onClick={loadSmiles}>
            Render
          </button>
          <button onClick={downloadSmiles}>Download</button>
        </div>
        <div style={smilesImageStyle}>
          {[...new Set(smilesToRender)].map((smiles) => (
            <SmilesCard key={smiles} smiles={smiles} />
          ))}
        </div>
      </>
    </Section>
  );
}

export default DirectInput;
