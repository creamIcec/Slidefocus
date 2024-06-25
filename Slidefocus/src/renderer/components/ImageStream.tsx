import { ReactNode, useState } from 'react';
import ExpandButton from './ExpandButton';

type Range = {
  start: number;
  end: number;
};

function showImageViewer() {}

function getRandomHeightPlaceHolder(range: Range, ShowViewerFunction: Function) {
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
    <div className={'w-full bg-slate-500'} style={{ height }} onClick={() => ShowViewerFunction('')}></div>
  );
}

function getColumnPlaceHolders(columns: number, ShowViewerFunction: Function) {
  const result = [];
  for (let i = 0; i < columns; i++) {
    result.push(getRandomHeightPlaceHolder({ start: 128, end: 512 }, ShowViewerFunction));
  }
  return result;
}

export default function ImageStream({ShowViewerFunction} : {ShowViewerFunction: Function}) {
  const TEST_CONTAINERS_ITEMS = 10;
  const TEST_CONTAINERS_COLUMNS = 4;

  const imagesColumns = [];

  const [recentVisible, setRecentVisible] = useState<boolean>(true);
  const [likedVisible, setLikedVisible] = useState<boolean>(false);
  const [folderVisible, setFolderVisible] = useState<boolean>(false);

  const switchRecent = () => {
    setRecentVisible(!recentVisible);
  };

  const switchLiked = () => {
    setLikedVisible(!likedVisible);
  };

  const switchFolder = () => {
    setFolderVisible(!folderVisible);
  };

  for (let i = 0; i < TEST_CONTAINERS_COLUMNS; i++) {
    imagesColumns.push(
      <div className="stream-column-container">
        {getColumnPlaceHolders(TEST_CONTAINERS_COLUMNS, ShowViewerFunction)}
      </div>,
    );
  }

  return (
    <div className="app-stream-grid app-stream px-5">
      <div className="flex flex-nowrap flex-row place-content-start place-items-center px-5">
        <ExpandButton expandFunction={switchRecent}></ExpandButton>
        <span className="text-xl text-black font-hanserifb">最近看过</span>
      </div>
      <div className="stream-container p-5">
        {recentVisible ? imagesColumns : null}
      </div>
      <div className="flex flex-nowrap flex-row place-content-start place-items-center px-5">
        <ExpandButton expandFunction={switchLiked}></ExpandButton>
        <span className="text-xl text-black font-hanserifb">喜欢的图片</span>
      </div>
      <div className="stream-container p-5">
        {likedVisible ? imagesColumns : null}
      </div>
      <div className="flex flex-nowrap flex-row place-content-start place-items-center px-5">
        <ExpandButton expandFunction={switchFolder}></ExpandButton>
        <span className="text-xl text-black font-hanserifb">
          "打开的文件夹路径"
        </span>
      </div>
      <div className="stream-container p-5">
        {folderVisible ? imagesColumns : null}
      </div>
    </div>
  );
}
