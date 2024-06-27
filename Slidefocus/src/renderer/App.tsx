import { useEffect, useRef, useState } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import './App.css';
import FolderStream from './components/archive/FolderStream';
import FullScreenImageView from './components/FullScreenImageView';
import OpenButton from './components/OpenButton';
import LikedStream from './components/archive/LikedStream';
import RecentStream from './components/archive/RecentStream';
import SideBar from './components/SideBar';
import TitleBar from './components/TitleBar';
import ToolBar from './components/ToolBar';
import { handleImageClickForRecent } from './utils/handleSaveImagesList';
import BackToTopButton from './components/Back2top';
import { sortImages } from './utils/sort';
import MessagePopup from './components/MessagePopup';
import ImageStream from './components/ImageStream';

export type ImagePathsType = 'liked' | 'folder' | 'recent' | 'search';

export type ImageRawRecord = {
  path: string;
  liked: boolean;
  tags: string;
  lastModified: string;
};

type CurrentImageViewModel = {
  streamType: ImagePathsType;
  index: number;
};

function AppContainer() {
  const [isViewerPresent, setIsViewerPresent] = useState<boolean>(false);
  const [imagePath, setImagePath] = useState<string>('');

  const [folderImages, setFolderImages] = useState<ImageRawRecord[]>([]); //文件夹中的所有图片
  const [recentImages, setRecentImages] = useState<ImageRawRecord[]>([]); //最近的所有图片
  const [likedImages, setLikedImages] = useState<ImageRawRecord[]>([]); //喜欢的所有图片
  const [currentFullView, setCurrentFullView] = useState<CurrentImageViewModel>(
    { streamType: 'folder', index: 0 },
  );
  const [copyMessage, setCopyMessage] = useState<string>('');
  const [displayCopyMessage, setDisplayCopyMessage] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayCopyMessage(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [displayCopyMessage]);

  const recentClickCallback = (index: number) => {
    setImagePath(recentImages[index].path);
    setCurrentFullView({ streamType: 'recent', index: index });
  };

  const folderClickCallback = (index: number) => {
    setImagePath(folderImages[index].path);
    setCurrentFullView({ streamType: 'folder', index: index });
    handleImageClickForRecent(folderImages[index], false, '');
    fetchRecent();
  };

  const onSearch = (searchTerm: string) => {
    const allImagePaths = folderImages.concat(recentImages).concat(likedImages);
    const index = allImagePaths.map((item) => item.path).indexOf(searchTerm);
    if (index) {
      setCurrentFullView({ streamType: 'search', index: index });
      setImagePath(allImagePaths[index].path);
      handleImageClickForRecent(allImagePaths[index], false, '');
      fetchRecent();
    }
  };

  const likedClickCallback = (index: number) => {};

  const openSingleImageCallback = (path: string) => {
    setImagePath(path);
    handleImageClickForRecent(path, false, ''); //TODO 获取点击红心状态
    fetchRecent();
  };

  const getFullViewNextIndex = (oldIndex: number, images: ImageRawRecord[]) => {
    let newIndex = 0;
    if (oldIndex >= images.length - 1) {
      newIndex = 0;
    } else {
      newIndex = oldIndex + 1;
    }
    setImagePath(images[newIndex].path);
    const streamType = currentFullView.streamType;
    setCurrentFullView({ streamType: streamType, index: newIndex });
    return images[newIndex].path;
  };

  const getFullViewLastIndex = (oldIndex: number, images: ImageRawRecord[]) => {
    let newIndex = 0;
    if (oldIndex <= 0) {
      newIndex = images.length - 1;
    } else {
      newIndex = oldIndex - 1;
    }
    setImagePath(images[newIndex].path);
    const streamType = currentFullView.streamType;
    setCurrentFullView({ streamType: streamType, index: newIndex });
  };

  const fullViewNextImage = () => {
    const index = currentFullView.index;
    let path;
    let flag = false;
    switch (currentFullView.streamType) {
      case 'folder': {
        path = getFullViewNextIndex(index, folderImages);
        break;
      }
      case 'recent': {
        path = getFullViewNextIndex(index, recentImages);
        break;
      }
      case 'liked': {
        path = getFullViewNextIndex(index, likedImages);
        break;
      }
      case 'search': {
        flag = true;
      }
    }
    if (flag) {
      return;
    }
    handleImageClickForRecent(path, false, '');
  };

  const fullViewLastImage = () => {
    const index = currentFullView.index;
    let path;
    switch (currentFullView.streamType) {
      case 'folder': {
        path = getFullViewLastIndex(index, folderImages);
        break;
      }
      case 'recent': {
        path = getFullViewLastIndex(index, recentImages);
        break;
      }
      case 'liked': {
        path = getFullViewLastIndex(index, likedImages);
        break;
      }
    }
    handleImageClickForRecent(path, false, '');
  };

  async function fetchRecent() {
    const recentImages = await window.connectionAPIs.readRecentImages();
    sortImages(recentImages, 'path');
    setRecentImages(recentImages);
  }

  async function fetchLiked() {
    const likedImages = await window.connectionAPIs.readFavoriteImages();
    setLikedImages(likedImages.map((item: any) => item.path));
  }

  function updateCopyMessage(message: string) {
    setCopyMessage(message);
    setDisplayCopyMessage(true);
  }

  function copyPath() {
    const content = imagePath;
    const systemPath = content.slice(6, content.length);
    navigator.clipboard.writeText(systemPath);
    updateCopyMessage('复制路径成功!');
  }

  async function clipboardImg(url: string) {
    try {
      const data = await fetch(url);
      const blob = await data.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      updateCopyMessage('复制图片成功!');
    } catch (err) {
      updateCopyMessage('请尝试重新复制');
    }
  }

  function copyImage() {
    var canvas = document.createElement('canvas'); // 创建一个画板
    let image = new Image();
    image.setAttribute('crossOrigin', 'Anonymous'); // 可能会有跨域问题
    image.src = imagePath;

    image.onload = () => {
      // 图片加载完成事件
      canvas.width = image.width; // 设置画板宽度
      canvas.height = image.height; // 设置画板高度
      canvas.getContext('2d')!.drawImage(image, 0, 0); // 加载图片到画板
      let dataUrl = canvas.toDataURL('image/png'); // 转换图片为 data URL，格式为 png
      clipboardImg(dataUrl); // 调用复制方法
    };
  }

  const container = useRef<HTMLDivElement>(null);

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
      <div className="app-stream-grid app-stream px-5" ref={container}>
        <ImageStream
          images={recentImages}
          type="recent"
          ClickCallback={recentClickCallback}
          title="最近看过"
          sortMethod="path"
        ></ImageStream>
        <ImageStream
          images={likedImages}
          type="liked"
          ClickCallback={likedClickCallback}
          title="喜欢的图片"
          sortMethod="path"
        ></ImageStream>
        <ImageStream
          images={folderImages}
          type="folder"
          ClickCallback={folderClickCallback}
          title="打开的文件夹路径"
          sortMethod="path"
        ></ImageStream>
        <BackToTopButton container={container}></BackToTopButton>
      </div>
      <TitleBar onSearchCallback={onSearch}></TitleBar>
      <SideBar></SideBar>
      {isViewerPresent ? (
        <FullScreenImageView
          imagePath={imagePath}
          closeImageViewFunction={() => setIsViewerPresent(false)}
          nextImageFunction={fullViewNextImage}
          lastImageFunction={fullViewLastImage}
          copyImagePathFunction={copyPath}
          copyImageFunction={copyImage}
        ></FullScreenImageView>
      ) : null}

      {displayCopyMessage ? (
        <MessagePopup
          message={copyMessage}
          showing={displayCopyMessage}
        ></MessagePopup>
      ) : null}
      <OpenButton
        openSingleImageCallback={openSingleImageCallback}
        setImages={setFolderImages}
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
