import React from 'react';
import { defaultColors } from '../styles/themes';

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  ...defaultColors,
};

const smileRederStyle = {
  fontWeight: 'bold',
  fontSize: '26px',
};

const pageLogoStyle = {
  width: '100px',
  padding: '10px 10px 10px 25px',
};

const gitHubLinkStyle = {
  marginRight: '25px',
};

function Header() {
  return (
    <header style={headerStyle}>
      <a href="/">
        <div style={smileRederStyle}>
          <img style={pageLogoStyle} src="static/logo.png"></img>
        </div>
      </a>
      <a
        href="https://github.com/Gabriel-Grechuk/smiles-render-web"
        target="_blank" rel="noreferrer"
      >
        <div style={gitHubLinkStyle}>
          <i className="bi bi-github" style={{ marginRight: '5px' }}></i>
          Checkout the Github page
        </div>
      </a>
    </header>
  );
}

export default Header;