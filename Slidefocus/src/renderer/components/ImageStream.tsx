import { ReactNode, useEffect, useRef, useState } from 'react';
import ExpandButton from './ExpandButton';
import BackToTopButton from './Back2top';

/*
  1. 读取下一张图片
  2. 由于固定高度，根据图片长宽比计算出对应宽度，进入第3步
  3. 如果宽度小于等于剩余宽度，则放入剩余宽度中并回到第1步，否则进入第4步
  4. 转移到第二行，将上一行的最后一张宽度占满，如果宽度大于第二行行宽，则裁剪到行宽并放入，如果小于则放入；回到第1步
*/

type Range = {
  start: number;
  end: number;
};

function showImageViewer() {}

function getRandomHeightPlaceHolder(
  range: Range,
  ShowViewerFunction: Function,
) {
  range.end = Math.max(range.end, 0);
  range.start = Math.max(range.start, 0);

  if (range.end < range.start) {
    let temp = range.end;
    range.end = range.start;
    range.start = temp;
  }
  const height = Math.floor(
    Math.random() * (range.end - range.start) + range.start,
  );

  return (
    <div
      className={'w-full bg-slate-500'}
      style={{ height }}
      onClick={() => ShowViewerFunction('')}
    ></div>
  );
}

function getColumnPlaceHolders(columns: number, ShowViewerFunction: Function) {
  const result = [];
  for (let i = 0; i < columns; i++) {
    result.push(
      getRandomHeightPlaceHolder({ start: 128, end: 512 }, ShowViewerFunction),
    );
  }
  return result;
}

export default function ImageStream({
  imagePaths,
  ShowViewerFunction,
}: {
  imagePaths: string[] | null;
  ShowViewerFunction: Function;
}) {
  const FIXED_HEIGHT = 300;

  const [recentVisible, setRecentVisible] = useState<boolean>(true);
  const [likedVisible, setLikedVisible] = useState<boolean>(false);
  const [folderVisible, setFolderVisible] = useState<boolean>(false);
  const [streamContainer, setStreamContainer] = useState<any[][]>([]);

  useEffect(() => {
    buildImageStream();
  }, [imagePaths]);

  useEffect(() => {
    console.log('streamContainer: ' + streamContainer);
  }, [streamContainer]);

  const buildImageStream = () => {
    if (!imagePaths) {
      return;
    }
    const _streamContainer: any[][] = []; //大的容器
    let rowContainer1: any[] | null; //前一行的容器
    let rowContainer2: any[] | null; //后一行的容器
    let remainingWidth = container.current?.clientWidth; //剩余宽度
    let processed = 0;
    for (let i = 0; i < imagePaths?.length; i++) {
      const image = new Image();
      image.onload = function () {
        const width = image.width;
        const height = image.height;

        const ratio = width / height; //长宽比

        const displayWidth = FIXED_HEIGHT * ratio;

        if (displayWidth <= remainingWidth!) {
          if (!rowContainer1) {
            rowContainer1 = [];
          }
          rowContainer1.push(
            <div style={{ width: displayWidth, height: FIXED_HEIGHT }}>
              <img src={imagePaths[i]}></img>
            </div>,
          );
          remainingWidth! -= displayWidth;
          processed++;
        } else {
          if (!rowContainer1) {
            rowContainer1 = [];
          } else {
            rowContainer1.pop();
          }
          rowContainer1.push(
            <div
              style={{
                width: remainingWidth,
                height: FIXED_HEIGHT,
                overflow: 'hidden',
              }}
            >
              <img src={imagePaths[i - 1]}></img>
            </div>,
          );
          _streamContainer.push(rowContainer1);
          rowContainer1 = null;

          remainingWidth = container.current?.clientWidth; //重置容器宽度

          rowContainer2 = [];
          if (displayWidth > remainingWidth!) {
            rowContainer2.push(
              <div
                style={{
                  height: FIXED_HEIGHT,
                  overflow: 'hidden',
                }}
              >
                <img src={imagePaths[i]}></img>
              </div>,
            );
          } else {
            rowContainer2.push(
              <div style={{ width: displayWidth, height: FIXED_HEIGHT }}>
                <img src={imagePaths[i]}></img>
              </div>,
            );
          }

          rowContainer1 = rowContainer2;
        }
        if (processed == imagePaths.length) {
          _streamContainer.push(rowContainer1!);
        }
        setStreamContainer(_streamContainer);
      };

      image.src = imagePaths[i];
    }
  };

  const buildImageRows = () => {
    const result = [];
    for (let i = 0; i < streamContainer!.length; i++) {
      result.push(
        <div className="stream-row-container">{streamContainer![i]}</div>,
      );
    }
    return result;
  };

  const switchRecent = () => {
    setRecentVisible(!recentVisible);
  };

  const switchLiked = () => {
    setLikedVisible(!likedVisible);
  };

  const switchFolder = () => {
    setFolderVisible(!folderVisible);
  };

  const container = useRef<HTMLDivElement>(null);

  return (
    <div className="app-stream-grid app-stream px-5" ref={container}>
      <div className="flex flex-nowrap flex-row place-content-start place-items-center px-5">
        <ExpandButton expandFunction={switchRecent}></ExpandButton>
        <span className="text-xl text-black dark:text-white font-hanserifb">
          最近看过
        </span>
      </div>
      <div className="stream-container p-5">
        {/*recentVisible ? imagesRows : null*/}
      </div>
      <div className="flex flex-nowrap flex-row place-content-start place-items-center px-5">
        <ExpandButton expandFunction={switchLiked}></ExpandButton>
        <span className="text-xl text-black dark:text-white font-hanserifb">
          喜欢的图片
        </span>
      </div>
      <div className="stream-container p-5">
        {/*likedVisible ? imagesRows : null*/}
      </div>
      <div className="flex flex-nowrap flex-row place-content-start place-items-center px-5">
        <ExpandButton expandFunction={switchFolder}></ExpandButton>
        <span className="text-xl text-black dark:text-white font-hanserifb">
          "打开的文件夹路径"
        </span>
      </div>
      <div className="stream-container p-5">
        {folderVisible ? buildImageRows() : null}
      </div>
      <BackToTopButton container={container}></BackToTopButton>
    </div>
  );
}
