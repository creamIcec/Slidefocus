import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';
import TitleBar from './components/TitleBar';
import ImageStream from './components/ImageStream';
import SideBar from './components/SideBar';

function AppContainer() {
  return (
    <div className="app-grid-layout">
      <ImageStream></ImageStream>
      <TitleBar></TitleBar>
      <SideBar></SideBar>
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
