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

export type ImagePathsType = 'liked' | 'folder' | 'recent';

type CurrentImageViewModel = {
  streamType: ImagePathsType;
  index: number;
};

function AppContainer() {
  const [isViewerPresent, setIsViewerPresent] = useState<boolean>(false);
  const [imagePath, setImagePath] = useState<string>('');

  const [folderImagePaths, setImagePaths] = useState<string[]>([]); //文件夹中的所有图片
  const [recentImagePaths, setRecentImagePaths] = useState<string[]>([]); //最近的所有图片
  const [likedImagePaths, setLikedImagePaths] = useState<string[]>([]); //喜欢的所有图片
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
    setImagePath(recentImagePaths[index]);
    setCurrentFullView({ streamType: 'recent', index: index });
  };

  const folderClickCallback = (index: number) => {
    setImagePath(folderImagePaths[index]);
    setCurrentFullView({ streamType: 'folder', index: index });
    handleImageClickForRecent(folderImagePaths[index], false, '');
    fetchRecent();
  };

  //const likedClickCallback = (index: number) => {
    const likedClickCallback = async (index: number) => {
      try {
        // 获取当前点击的图片路径和其他相关信息
        const imagePath = folderImagePaths[index];
        const isLiked = likedImagePaths.includes(imagePath);
        const tags: any[] = []; // 假设这里有图片的标签信息
    
        // 保存更新后的喜欢状态
        const updatedLikedImagePaths = await window.connectionAPIs.saveLikedImages(
          imagePath,
          !isLiked,
          tags
        );
    
        // 更新组件状态
        setLikedImagePaths(updatedLikedImagePaths);
      } catch (error) {
        console.error('Error updating liked image:', error);
      }
   // };
  };

  const openSingleImageCallback = (path: string) => {
    setImagePath(path);
    handleImageClickForRecent(path, false, ''); //TODO 获取点击红心状态
    fetchRecent();
  };

  const getFullViewNextIndex = (oldIndex: number, paths: string[]) => {
    let newIndex = 0;
    if (oldIndex >= paths.length - 1) {
      newIndex = 0;
    } else {
      newIndex = oldIndex + 1;
    }
    setImagePath(paths[newIndex]);
    const streamType = currentFullView.streamType;
    setCurrentFullView({ streamType: streamType, index: newIndex });
    return paths[newIndex];
  };

  const getFullViewLastIndex = (oldIndex: number, paths: string[]) => {
    let newIndex = 0;
    if (oldIndex <= 0) {
      newIndex = paths.length - 1;
    } else {
      newIndex = oldIndex - 1;
    }
    setImagePath(paths[newIndex]);
    const streamType = currentFullView.streamType;
    setCurrentFullView({ streamType: streamType, index: newIndex });
  };

  const fullViewNextImage = () => {
    const index = currentFullView.index;
    let path;
    switch (currentFullView.streamType) {
      case 'folder': {
        path = getFullViewNextIndex(index, folderImagePaths);
        break;
      }
      case 'recent': {
        path = getFullViewNextIndex(index, recentImagePaths);
        break;
      }
      case 'liked': {
        path = getFullViewNextIndex(index, likedImagePaths);
        break;
      }
    }
    handleImageClickForRecent(path, false, '');
  };

  const fullViewLastImage = () => {
    const index = currentFullView.index;
    let path;
    switch (currentFullView.streamType) {
      case 'folder': {
        path = getFullViewLastIndex(index, folderImagePaths);
        break;
      }
      case 'recent': {
        path = getFullViewLastIndex(index, recentImagePaths);
        break;
      }
      case 'liked': {
        path = getFullViewLastIndex(index, likedImagePaths);
        break;
      }
    }
    handleImageClickForRecent(path, false, '');
  };

  async function fetchRecent() {
    const recentImages = await window.connectionAPIs.readRecentImages();
    const paths = recentImages.map((item: any) => item.path);
    sortImages(paths);
    setRecentImagePaths(paths);
  }

  async function fetchLiked() {
    const likedImages = await window.connectionAPIs.readLikedImages();
    setLikedImagePaths(likedImages.map((item: any) => item.path));
  }

  function updateCopyMessage(message: string) {
    setCopyMessage(message);
    setDisplayCopyMessage(true);
  }
//一键复制路径
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
//一键复制图片
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
          imagePaths={recentImagePaths}
          type="recent"
          ClickCallback={recentClickCallback}
          title="最近看过"
        ></ImageStream>
        <ImageStream
          imagePaths={likedImagePaths}
          type="liked"
          ClickCallback={likedClickCallback}
          title="喜欢的图片"
        ></ImageStream>
        <ImageStream
          imagePaths={folderImagePaths}
          type="folder"
          ClickCallback={folderClickCallback}
          title="打开的文件夹路径"
        ></ImageStream>
        <BackToTopButton container={container}></BackToTopButton>
      </div>
      <TitleBar></TitleBar>
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
