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
  const [currentImage, setCurrentImage] = useState<ImageRawRecord>();
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
    setCurrentImage(recentImages[index]);
    setCurrentFullView({ streamType: 'recent', index: index });
  };

  const folderClickCallback = (index: number) => {
    setCurrentImage(folderImages[index]);
    setCurrentFullView({ streamType: 'folder', index: index });
    handleImageClickForRecent(folderImages[index]);
    fetchRecent();
  };

  const likedClickCallback = (index: number) => {
    setCurrentImage(likedImages[index]);
    setCurrentFullView({ streamType: 'liked', index: index });
    handleImageClickForRecent(likedImages[index]);
    fetchRecent();
  };

  const likedCallback = (newLikedImages: ImageRawRecord[]) => {
    console.log('接收到的likedImages:');
    console.log(newLikedImages);
    setLikedImages(newLikedImages);
  };

  const setLikeStatedFolderImages = (images: ImageRawRecord[]) => {
    const newFolderImages = images.map((item) => {
      if (likedImages.map((likedItem) => likedItem.path).includes(item.path)) {
        item.liked = true;
      } else {
        item.liked = false;
      }
      return item;
    });
    console.log('new folder:');
    console.log(newFolderImages);
    setFolderImages(newFolderImages);
  };

  const updateImageLikedState = () => {
    const newRecentImages = recentImages.map((item) => {
      if (likedImages.map((likedItem) => likedItem.path).includes(item.path)) {
        item.liked = true;
      } else {
        item.liked = false;
      }
      return item;
    });
    setRecentImages(newRecentImages);

    const newFolderImages = folderImages.map((item) => {
      if (likedImages.map((likedItem) => likedItem.path).includes(item.path)) {
        item.liked = true;
      } else {
        item.liked = false;
      }
      return item;
    });
    setFolderImages(newFolderImages);
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
      setCurrentImage(allImages[found]);
      handleImageClickForRecent(allImages[found]);
      fetchRecent();
    }
  };

  const openSingleImageCallback = (path: string) => {
    const imageObj = {
      path: path || '',
      liked: false,
      tags: '',
      lastModified: '',
    };
    setCurrentImage(imageObj);
    handleImageClickForRecent(imageObj);
    fetchRecent();
  };

  const getFullViewNextIndex = (oldIndex: number, images: ImageRawRecord[]) => {
    let newIndex = 0;
    if (oldIndex >= images.length - 1) {
      newIndex = 0;
    } else {
      newIndex = oldIndex + 1;
    }
    setCurrentImage(images[newIndex]);
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
    setCurrentImage(images[newIndex]);
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
    setLikedImages(likedImages);
  }

  function updateCopyMessage(message: string) {
    setCopyMessage(message);
    setDisplayCopyMessage(true);
  }
  //一键复制路径
  function copyPath() {
    const content = currentImage?.path;
    if (!content) {
      updateCopyMessage('请尝试重新复制!');
      return;
    }
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
    if (!currentImage) {
      return;
    }

    var canvas = document.createElement('canvas'); // 创建一个画板
    let image = new Image();
    image.setAttribute('crossOrigin', 'Anonymous'); // 可能会有跨域问题
    image.src = currentImage.path;

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

  useEffect(() => {
    if (currentImage) {
      setIsViewerPresent(true);
    }
  }, [currentImage]);

  useEffect(() => {
    console.log('初次更新喜欢状态');
    console.log(likedImages);
    updateImageLikedState();
  }, [likedImages]);

  useEffect(() => {
    fetchRecent();
    fetchLiked();
    return () => {};
  }, []); //第一次初始化

  const container = useRef<HTMLDivElement>(null);

  return (
    <div className="app-grid-layout">
      <ToolBar setSortMethod={_setSortMethod}></ToolBar>
      <div className="app-stream-grid app-stream px-5" ref={container}>
        <ImageStream
          images={recentImages}
          type="recent"
          ClickCallback={recentClickCallback}
          LikedCallback={likedCallback}
          title="最近看过"
          sortMethod={imageSortMethod}
        ></ImageStream>
        <ImageStream
          images={likedImages}
          type="liked"
          ClickCallback={likedClickCallback}
          LikedCallback={likedCallback}
          title="喜欢的图片"
          sortMethod={imageSortMethod}
        ></ImageStream>
        <ImageStream
          images={folderImages}
          type="folder"
          ClickCallback={folderClickCallback}
          LikedCallback={likedCallback}
          title="打开的文件夹路径"
          sortMethod={imageSortMethod}
        ></ImageStream>
        <BackToTopButton container={container}></BackToTopButton>
      </div>
      <TitleBar onSearchCallback={onSearch}></TitleBar>
      <SideBar></SideBar>
      {isViewerPresent ? (
        <FullScreenImageView
          image={currentImage!}
          closeImageViewFunction={() => setIsViewerPresent(false)}
          nextImageFunction={fullViewNextImage}
          lastImageFunction={fullViewLastImage}
          copyImagePathFunction={copyPath}
          copyImageFunction={copyImage}
          likedCallback={likedCallback}
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
        setImages={setLikeStatedFolderImages}
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
