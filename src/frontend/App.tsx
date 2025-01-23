import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import DirectInput from './forms/DirectInput';
import ConvertFromCsv from './forms/ConvertFromCsv';

const contentStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  width: '95%',
  minHeight: '100vh',
};

function App() {
  return (
    <>
      <Header />
      <section style={contentStyle}>
        <DirectInput />
        <ConvertFromCsv />
      </section>
      <Footer />
    </>
  );
}

export default App;
