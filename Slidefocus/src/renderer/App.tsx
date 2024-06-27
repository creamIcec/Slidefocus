import { useEffect, useRef, useState } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import './App.css';
import BackToTopButton from './components/Back2top';
import FullScreenImageView from './components/FullScreenImageView';
import ImageStream from './components/ImageStream';
import MessagePopup from './components/MessagePopup';
import OpenButton from './components/OpenButton';
import SideBar from './components/SideBar';
import TitleBar from './components/TitleBar';
import ToolBar from './components/ToolBar';
import { handleImageClickForRecent } from './utils/handleSaveImagesList';
import { SortType, sortImages } from './utils/sort';

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
  const [imageSortMethod, setImageSortMethod] = useState<SortType>('path');
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
    handleImageClickForRecent(folderImages[index]);
    fetchRecent();
  };

  const onSearch = (searchTerm: string) => {
    const searchPattern = new RegExp(searchTerm, 'i');
    const allImages = folderImages.concat(recentImages).concat(likedImages);
    const found = allImages
      .map((item) => item.path)
      .findIndex((item) => item.search(searchPattern) != -1);
    if (found != -1) {
      setCurrentFullView({
        streamType: 'search',
        index: found,
      });
      setImagePath(allImages[found].path);
      handleImageClickForRecent(allImages[found]);
      fetchRecent();
    }
  };

  //const likedClickCallback = (index: number) => {
    const likedClickCallback = async (index: number) => {
      try {
        // 获取当前点击的图片路径
        const imagePath = folderImages[index].path;
    
        // 检查图片是否已在收藏夹中
        const existingImageIndex = likedImages.findIndex((img) => img.path === imagePath);
    
        if (existingImageIndex !== -1) {
          // 如果图片已在收藏夹中,则从收藏夹中删除
          likedImages.splice(existingImageIndex, 1);
        } else {
          // 如果图片不在收藏夹中,则添加到收藏夹
          likedImages.unshift({ path: imagePath, liked: true, tags: [], lastModified: '' });
        }
    
        // 将更新后的收藏夹数据写入JSON文件
        await window.connectionAPIs.saveLikedImages(likedImages);
    
        // 更新组件状态
        setLikedImages(likedImages);
      } catch (error) {
        console.error('Error updating liked image:', error);
      }
    };
    // };
  };

  const openSingleImageCallback = (path: string) => {
    setImagePath(path);
    handleImageClickForRecent({
      path: path || '',
      liked: false,
      tags: '',
      lastModified: '',
    });
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
    return images[newIndex].path;
  };

  const fullViewNextImage = () => {
    const index = currentFullView.index;
    let path = '';
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
    handleImageClickForRecent({
      path: path || '',
      liked: false,
      tags: '',
      lastModified: '',
    });
  };

  const fullViewLastImage = () => {
    const index = currentFullView.index;
    let path;
    let flag = false;
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
      case 'search': {
        flag = true;
      }
    }
    if (flag) {
      return;
    }
    handleImageClickForRecent({
      path: path || '',
      liked: false,
      tags: '',
      lastModified: '',
    });
  };

  async function fetchRecent() {
    const recentImages = await window.connectionAPIs.readRecentImages();
    sortImages(recentImages, 'path');
    setRecentImages(recentImages);
  }

  async function fetchLiked() {
    const likedImages = await window.connectionAPIs.readLikedImages();
    setLikedImages(likedImages.map((item: any) => item.path));
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

  function _setSortMethod(sortMethod: SortType) {
    console.log('当前排序方式:' + sortMethod);
    setImageSortMethod(sortMethod);
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
      <ToolBar setSortMethod={_setSortMethod}></ToolBar>
      <div className="app-stream-grid app-stream px-5" ref={container}>
        <ImageStream
          images={recentImages}
          type="recent"
          ClickCallback={recentClickCallback}
          title="最近看过"
          sortMethod={imageSortMethod}
        ></ImageStream>
        <ImageStream
          images={likedImages}
          type="liked"
          ClickCallback={likedClickCallback}
          title="喜欢的图片"
          sortMethod={imageSortMethod}
        ></ImageStream>
        <ImageStream
          images={folderImages}
          type="folder"
          ClickCallback={folderClickCallback}
          title="打开的文件夹路径"
          sortMethod={imageSortMethod}
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
