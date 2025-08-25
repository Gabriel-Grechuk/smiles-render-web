import React from 'react';
import { useState } from 'react';
import Section from '../components/Section';
import Prediction from '../components/Prediction';

const defaultSmiles = [
  'CCCCCCCC',
  'C0CCCCC0C0CCCCC0',
  'OC[C@@H](O1)[C@@H](O)[C@H](O)[C@@H](O)[C@H](O)1',
];

const smilesPredictionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
};

function PredictWithStopTox() {
  const [smiles, setSmiles] = useState(defaultSmiles);
  const [smilesToRender, setSmilesToRender] = useState([] as string[]);

  function loadSmiles() {
    setSmilesToRender(smiles);
  }

  return (
    <Section title="Predict With STopTox">
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
          <button style={{ marginRight: '10px' }} onClick={loadSmiles}>
            Predict
          </button>
        </div>
        <div style={smilesPredictionStyle}>
          {[...new Set(smilesToRender)].filter(Boolean).map((smiles) => (
            <Prediction smiles={smiles} />
          ))}
        </div>
      </>
    </Section>
  );
}

export default PredictWithStopTox;
