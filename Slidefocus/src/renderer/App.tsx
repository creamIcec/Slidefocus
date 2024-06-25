import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';
import TitleBar from './components/TitleBar';
import ImageStream from './components/ImageStream';
import SideBar from './components/SideBar';
import ToolBar from './components/ToolBar';
import FullScreenImageView from './components/FullScreenImageView';
import { useRef, useState } from 'react';
import BackToTopButton from './components/Back2top';
import OpenFileButton from './components/OpenFileButton';

function AppContainer() {
  const [isViewerPresent, setIsViewerPresent] = useState<boolean>(false);
  const [imagePath, setImagePath] = useState<string>('');

  const switchViewer = (imageData: string) => {
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
          imageData={imagePath}
          closeImageViewFunction={() => setIsViewerPresent(false)}
        ></FullScreenImageView>
      ) : null}
      <OpenFileButton setPath={setImagePath}></OpenFileButton>
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
