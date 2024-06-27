import { useEffect, useRef, useState } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';
import ExpandPanelTitle from './ExpandPanelTitle';

/*
  1. 读取下一张图片
  2. 由于固定高度，根据图片长宽比计算出对应宽度，进入第3步
  3. 如果宽度小于等于剩余宽度，则放入剩余宽度中并回到第1步，否则进入第4步
  4. 转移到第二行，将上一行的最后一张宽度占满，如果宽度大于第二行行宽，则裁剪到行宽并放入，如果小于则放入；回到第1步
*/
type ImagePathsType = 'folder';

export default function FolderStream({
  folderImagePaths,
  ClickCallback,
}: {
  folderImagePaths: string[] | null;
  ClickCallback: Function;
}) {
  let FOLLOW_WINDOW_HEIGHT = 300;
  const MIN_DISPLAY_WIDTH = 300;

  const [folderVisible, setFolderVisible] = useState<boolean>(false);
  const [folderStreamContainer, setFolderStreamContainer] = useState<any[][]>(
    [],
  );
  const [folderImageCache, setFolderImageCache] = useState<HTMLImageElement[]>(
    [],
  );

  const windowSize = useWindowSize(); //监听窗口大小变化的钩子

  const initFolderImages = (shouldbuildPath: boolean) => {
    if (!folderImagePaths) {
      return;
    }
    let initedCount = 0;
    const imageTempContainer: HTMLImageElement[] = [];
    if (shouldbuildPath) {
      for (let i = 0; i < folderImagePaths?.length; i++) {
        const image = new Image();
        image.onload = function () {
          initedCount++;
          imageTempContainer.push(image);
          if (initedCount == folderImagePaths?.length) {
            setFolderImageCache(imageTempContainer);
            sortImages(imageTempContainer);
            buildImageStream('folder', imageTempContainer);
          }
        };
        image.src = folderImagePaths[i];
      }
    } else {
      buildImageStream('folder', folderImageCache);
    }
  };

  /*const initImages = (type: ImagePathsType, shouldbuildPath: boolean) => {
    debugger;
    if (!folderImagePaths) {
      return;
    }
    let initedCount = 0;
    const imageTempContainer: HTMLImageElement[] = [];
    if (shouldbuildPath) {
      for (let i = 0; i < folderImagePaths?.length; i++) {
        const image = new Image();
        image.onload = function () {
          initedCount++;
          imageTempContainer.push(image);
          if (initedCount == folderImagePaths?.length) {
            switch(type){
              case 'folder':
                setFolderImageCache(imageTempContainer);
                break;
              case 'liked':
                setLikedImageCache(imageTempContainer);
                break;
              case 'recent':
                setRecentImageCache(imageTempContainer);
                break;
            }
            sortImages(imageTempContainer);
            buildImageStream(type, imageTempContainer);
          }
        };
        image.src = folderImagePaths[i];
      }
    } else {
      switch(type){
        case 'folder':
          buildImageStream(type, folderImageCache);
          break;
        case 'liked':
          buildImageStream(type, likedImageCache);
          break;
        case 'recent':
          buildImageStream(type, recentImageCache);
          break;
      }
    }
  };*/

  useEffect(() => {
    initAllImages();
  }, [windowSize.height]);

  useEffect(() => {
    initFolderImages(true);
  }, [folderImagePaths]);

  useEffect(() => {
    console.log('streamContainer: ' + folderStreamContainer);
  }, [folderStreamContainer]);

  const sortImages = (imagesArray: HTMLImageElement[]) => {
    imagesArray.sort((item1, item2) => {
      return item1.src.localeCompare(item2.src, 'zh-CN');
    });
  };

  const initAllImages = () => {
    initFolderImages(false);
  };

  const buildImageStream = (
    type: ImagePathsType,
    imageTempContainer: HTMLImageElement[],
  ) => {
    const _streamContainer: any[][] = []; //大的容器
    let rowContainer1: any[] | null = null; //前一行的容器
    let rowContainer2: any[] | null = null; //后一行的容器
    let remainingWidth = mainContainer.current?.offsetWidth; //剩余宽度
    let processed = 0;
    let restoreWidth = 0; //保存上一个的宽度， 用于恢复
    for (let i = 0; i < imageTempContainer.length; i++) {
      const width = imageTempContainer[i].width;
      const height = imageTempContainer[i].height;

      const ratio = width / height; //长宽比
      const displayWidth = FOLLOW_WINDOW_HEIGHT * ratio;

      if (
        displayWidth <= remainingWidth! &&
        remainingWidth! > MIN_DISPLAY_WIDTH
      ) {
        if (!rowContainer1) {
          rowContainer1 = [];
        }
        rowContainer1.push(
          <img
            src={imageTempContainer[i].src}
            style={{ width: displayWidth, height: FOLLOW_WINDOW_HEIGHT }}
            className="transition hover:scale-110 hover:shadow-2xl"
            onClick={() => {
              ClickCallback(i);
            }}
          />,
        );
        remainingWidth! -= displayWidth;
        restoreWidth = displayWidth;
      } else {
        if (!rowContainer1) {
          rowContainer1 = [];
        } else {
          rowContainer1.pop();
        }
        rowContainer1.push(
          <div>
            <img
              src={imageTempContainer[i - 1].src}
              style={{
                width: remainingWidth! + restoreWidth,
                height: FOLLOW_WINDOW_HEIGHT,
                objectFit: 'cover',
              }}
              className="transition hover:scale-110 hover:shadow-2xl"
              onClick={() => {
                ClickCallback(i - 1);
              }}
            />
          </div>,
        );
        restoreWidth = 0;
        _streamContainer.push(rowContainer1);
        rowContainer1 = null;

        remainingWidth = mainContainer.current?.clientWidth; //重置容器宽度

        rowContainer2 = [];
        if (displayWidth > remainingWidth!) {
          rowContainer2.push(
            <img
              src={imageTempContainer[i].src}
              style={{
                width: remainingWidth,
                height: FOLLOW_WINDOW_HEIGHT,
              }}
              className="transition hover:scale-110 hover:shadow-2xl"
              onClick={() => {
                ClickCallback(i);
              }}
            />,
          );
          remainingWidth = 0;
        } else {
          rowContainer2.push(
            <img
              src={imageTempContainer[i].src}
              style={{ width: displayWidth, height: FOLLOW_WINDOW_HEIGHT }}
              className="transition hover:scale-110 hover:shadow-2xl"
              onClick={() => {
                ClickCallback(i);
              }}
            />,
          );
          remainingWidth! -= displayWidth;
        }
        rowContainer1 = rowContainer2;
      }
      processed++;
      if (processed == imageTempContainer.length) {
        _streamContainer.push(rowContainer1!);
      }
      setFolderStreamContainer(_streamContainer);
    }
  };

  const buildImageRows = (type: ImagePathsType) => {
    let container;
    container = folderStreamContainer;

    const result = [];
    for (let i = 0; i < container!.length; i++) {
      result.push(
        <div
          className="stream-row-container"
          style={{ height: FOLLOW_WINDOW_HEIGHT }}
        >
          {container![i]}
        </div>,
      );
    }
    return result;
  };

  const switchFolder = () => {
    setFolderVisible(!folderVisible);
  };

  const mainContainer = useRef<HTMLDivElement>(null);

  return (
    <div ref={mainContainer}>
      <ExpandPanelTitle
        expandFunction={switchFolder}
        title="打开的文件夹路径"
      ></ExpandPanelTitle>
      <div className="stream-container p-5">
        {folderVisible ? buildImageRows('folder') : null}
      </div>
    </div>
  );
}
