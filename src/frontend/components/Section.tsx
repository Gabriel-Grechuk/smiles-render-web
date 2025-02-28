import React from 'react';

const sectionStyle: React.CSSProperties = {
  boxShadow: '2px 4px 10px #333',
  marginBottom: '40px',
  borderRadius: '10px',
  width: '95%',
  margin: '25px',
};

const headerStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#ffd230',
  color: '#000',
  borderRadius: '10px 10px 0px 0px',
  fontSize: '26px',
  fontWeight: 'bold',
};

function Section(props: { title: string; children: React.JSX.Element }) {
  return (
    <section style={sectionStyle}>
      <div style={headerStyle}>
        <h2>{props.title}</h2>
      </div>
      <div style={{ padding: '20px' }}>{props.children}</div>
    </section>
  );
}

export default Section;
