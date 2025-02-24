import React from 'react';
import VisitorCounter from './VisitorCounter';

const pageFooterStyle: React.CSSProperties = {
  width: '100%',
  marginTop: '10px',
  padding: '10px 0px 10px 0px',
  display: 'flex',
  backgroundColor: '#000',
  color: '#fff',
  justifyContent: 'space-evenly',
};

function Footer() {
  return (
    <footer style={pageFooterStyle}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '90%',
        }}
      >
        <span
          style={{
            margin: '0px 5px 0px 5px',
          }}
        >
          Made with{' '}
          <i
            className="bi bi-heart-fill heart"
            style={{ color: 'red', fontSize: '12px' }}
          >
            {' '}
          </i>{' '}
          by Gabe
        </span>
        <div style={{ margin: 'margin: 0px 5px 0 5px' }}>
          <a
            href="https://github.com/Gabriel-Grechuk"
            target="_blank"
            style={{ margin: '2px' }}
          >
            <i className="bi bi-github" style={{ fontSize: '18px' }}></i>
          </a>
        </div>
      </div>
      <VisitorCounter />
    </footer>
  );
}

export default Footer;
