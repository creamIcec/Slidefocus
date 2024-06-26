import { useEffect, useState } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import './App.css';
import FullScreenImageView from './components/FullScreenImageView';
import ImageOpenButton from './components/ImageOpenButton';
import ImageStream from './components/ImageStream';
import SideBar from './components/SideBar';
import TitleBar from './components/TitleBar';
import ToolBar from './components/ToolBar';

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

      <ImageOpenButton setPath={setImagePath} setImagePaths={setImagePaths} />
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
