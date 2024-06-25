import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';
import TitleBar from './components/TitleBar';
import ImageStream from './components/ImageStream';
import SideBar from './components/SideBar';
import ToolBar from './components/ToolBar';
import FullScreenImageView from './components/FullScreenImageView';
import { useEffect, useRef, useState } from 'react';
import BackToTopButton from './components/Back2top';
import OpenFileButton from './components/OpenFileButton';
import OpenFolderButton from './components/OpenFolderButton';

function AppContainer() {
  const [isViewerPresent, setIsViewerPresent] = useState<boolean>(false);
  const [imagePath, setImagePath] = useState<string>('');

  const [imagePaths, setImagePaths] = useState<string[] | null>(null);
  const switchViewer = (imageData: string) => {
    setIsViewerPresent(!isViewerPresent);
  };

  useEffect(() => {
    if (imagePath && imagePath != '') {
      setIsViewerPresent(true);
    }
  }, [imagePath]);

  return (
    <div className="app-grid-layout">
      <ToolBar></ToolBar>
      <ImageStream
        imagePaths={imagePaths}
        ShowViewerFunction={switchViewer}
      ></ImageStream>
      <TitleBar></TitleBar>
      <SideBar></SideBar>
      {isViewerPresent ? (
        <FullScreenImageView
          imageData={imagePath}
          closeImageViewFunction={() => setIsViewerPresent(false)}
        ></FullScreenImageView>
      ) : null}

      <OpenFolderButton setImagePaths={setImagePaths}></OpenFolderButton>
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
