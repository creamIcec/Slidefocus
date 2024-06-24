import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';
import { useState } from 'react';
import TitleBar from './components/TitleBar';
import ImageStream from './components/ImageStream';

function AppContainer() {
  const [data, setData] = useState<string>('');

  const testFetchImage = () => {
    window.readImageAPIs
      .readLocalImage('./testImage/test.jpg')
      .then((image_data) => {
        const url = image_data;
        setData(url);
      });
  };

  return (
    <div>
      <TitleBar></TitleBar>
      <ImageStream></ImageStream>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContainer />} />
      </Routes>
    </Router>
  );
}
