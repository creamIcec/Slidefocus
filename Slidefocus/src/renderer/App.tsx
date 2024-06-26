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
  const [folderImagePaths, setImagePaths] = useState<string[]>([]); //文件夹中的所有图片
  const [imageIndex, setImageIndex] = useState<number>(0);

  const switchViewer = (imageIndex: number) => {
    setIsViewerPresent(!isViewerPresent);
    setImageIndex(imageIndex);
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
        likedImagePaths={[]}
        folderImagePaths={folderImagePaths}
        ShowViewerFunction={switchViewer}
      ></ImageStream>
      <TitleBar></TitleBar>
      <SideBar></SideBar>
      {isViewerPresent ? (
        <FullScreenImageView
          imagePaths={folderImagePaths}
          imageIndex={imageIndex}
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
