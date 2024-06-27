import { useEffect, useState } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import './App.css';
import FolderStream from './components/FolderStream';
import FullScreenImageView from './components/FullScreenImageView';
import OpenButton from './components/OpenButton';
import LikedStream from './components/LikedStream';
import RecentStream from './components/RecentStream';
import SideBar from './components/SideBar';
import TitleBar from './components/TitleBar';
import ToolBar from './components/ToolBar';
import { handleImageClickForRecent } from './utils/handleSaveImagesList';

function AppContainer() {
  const [isViewerPresent, setIsViewerPresent] = useState<boolean>(false);
  const [imagePath, setImagePath] = useState<string>('');

  const [folderImagePaths, setImagePaths] = useState<string[]>([]); //文件夹中的所有图片
  const [recentImagePaths, setRecentImagePaths] = useState<string[]>([]); //最近的所有图片
  const [likedImagePaths, setLikedImagePaths] = useState<string[]>([]); //喜欢的所有图片

  const switchViewer = (imageIndex: number) => {
    setIsViewerPresent(!isViewerPresent);
  };

  const recentClickCallback = (index: number) => {
    setImagePath(recentImagePaths[index]);
  };

  const folderClickCallback = (index: number) => {
    setImagePath(folderImagePaths[index]);
    fetchRecent();
  };

  const openSingleImageCallback = (path: string) => {
    setImagePath(path);
    handleImageClickForRecent(path, false, ''); //TODO 获取点击红心状态
    fetchRecent();
  };

  async function fetchRecent() {
    const recentImages = await window.connectionAPIs.readRecentImages();
    setRecentImagePaths(recentImages.map((item: any) => item.path));
  }

  async function fetchLiked() {
    const likedImages = await window.connectionAPIs.readFavoriteImages();
    setLikedImagePaths(likedImages.map((item: any) => item.path));
  }

  useEffect(() => {
    if (imagePath && imagePath != '') {
      setIsViewerPresent(true);
    }
  }, [imagePath]);

  useEffect(() => {
    fetchRecent();
    return () => {};
  }, []); //第一次初始化时拉取最近看过

  return (
    <div className="app-grid-layout">
      <ToolBar></ToolBar>
      {/*<ImageStream
        likedImagePaths={[]}
        folderImagePaths={folderImagePaths}
        ShowViewerFunction={switchViewer}
      ></ImageStream>*/}
      <div className="app-stream-grid app-stream px-5">
        <RecentStream
          recentImagePaths={recentImagePaths}
          ClickCallback={recentClickCallback}
        ></RecentStream>
        <LikedStream
          likedImagePaths={likedImagePaths}
          ShowViewerFunction={switchViewer}
        ></LikedStream>
        <FolderStream
          folderImagePaths={folderImagePaths}
          ClickCallback={folderClickCallback}
        ></FolderStream>
      </div>
      <TitleBar></TitleBar>
      <SideBar></SideBar>
      {isViewerPresent ? (
        <FullScreenImageView
          imagePaths={folderImagePaths}
          imagePath={imagePath}
          closeImageViewFunction={() => setIsViewerPresent(false)}
        ></FullScreenImageView>
      ) : null}

      <OpenButton
        openSingleImageCallback={openSingleImageCallback}
        setImagePaths={setImagePaths}
      />
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
