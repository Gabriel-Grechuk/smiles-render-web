import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Section from './components/Section';

function App() {
  return (
    <>
      <Header />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          width: '95%',
          minHeight: '100vh',
        }}
      >
        <Section title="Direct input" content={<p>Hoy there</p>} />
      </div>
      <Footer />
    </>
  );
}

export default App;
