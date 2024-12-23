import React, { useEffect, useState } from 'react';

const smilesCardStyle: React.CSSProperties = {
  margin: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '320px',
  maxWidth: '90%',
};

const imageStyle: React.CSSProperties = {
  boxShadow: '2px 4px 10px #333',
  width: '300px',
  maxWidth: '100%',
  borderRadius: '10px',
};

const loadingStype: React.CSSProperties = {
  boxShadow: '2px 4px 10px #333',
  maxWidth: '100%',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '300px',
  height: '300px',
  background: '#fff',
};

const labelStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '15px',
  width: '100%',
  maxWidth: '100%',
  fontWeight: 'bold',
  overflowWrap: 'break-word',
};

function SmilesCard(props: { smiles: string }) {
  const [isloading, setIsLoading] = useState(true);
  const [smileImage, setSmileImage] = useState(new Blob());
  const [error, setError] = useState(false);

  console.log('Hey there, beind reloaded');

  useEffect(() => {
    const url = `/render/base64/${encodeURIComponent(window.btoa(props.smiles))}`;

    fetch(url)
      .then((response) => response.blob())
      .then((image) => setSmileImage(image))
      .then(() => setIsLoading(false))
      .catch((error) => {
        console.error('Fetch Molecule error:', error);
        setError(true);
      });
  }, []);

  if (isloading)
    return (
      <div style={smilesCardStyle}>
        <div style={loadingStype}>
          <p>Loading...</p>
        </div>

        <p style={labelStyle}>{props.smiles}</p>
      </div>
    );
  else
    return (
      <div style={smilesCardStyle}>
        {error ? (
          <div style={loadingStype}>
            <p>Could not fetch image</p>
          </div>
        ) : (
          <img
            src={URL.createObjectURL(smileImage)}
            alt={props.smiles}
            style={imageStyle}
          />
        )}

        <p style={labelStyle}>{props.smiles}</p>
      </div>
    );
}

export default SmilesCard;
