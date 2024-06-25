import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';
import TitleBar from './components/TitleBar';
import ImageStream from './components/ImageStream';
import SideBar from './components/SideBar';
import ToolBar from './components/ToolBar';
import FullScreenImageView, { Base64 } from './components/FullScreenImageView';
import { useState } from 'react';

function AppContainer() {
  const [isViewerPresent, setIsViewerPresent] = useState<boolean>(false);

  const switchViewer = (imageData: Base64) => {
    setIsViewerPresent(!isViewerPresent);
  };

  return (
    <div className="app-grid-layout">
      <ToolBar></ToolBar>
      <ImageStream ShowViewerFunction={switchViewer}></ImageStream>
      <TitleBar></TitleBar>
      <SideBar></SideBar>
      {isViewerPresent ? (
        <FullScreenImageView
          imageData={null}
          closeImageViewFunction={() => setIsViewerPresent(false)}
        ></FullScreenImageView>
      ) : null}
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
