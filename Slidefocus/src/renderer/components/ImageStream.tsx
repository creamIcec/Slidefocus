import { ReactNode } from 'react';

export default function ImageStream() {
  const TEST_CONTAINERS_ITEMS = 10;
  const TEST_CONTAINERS_COLUMNS = 4;

  const imagesColumns = [];
  const imagesPlaceholders: ReactNode[] = [];

  for (let i = 0; i < TEST_CONTAINERS_ITEMS; i++) {
    imagesPlaceholders.push(<div className="w-full h-48 bg-slate-500"></div>);
  }

  for (let i = 0; i < TEST_CONTAINERS_COLUMNS; i++) {
    imagesColumns.push(<div>{imagesPlaceholders}</div>);
  }

  return (
    <div className="app-stream-grid app-stream p-5">
      <div className="">
        <span className="text-xl text-black font-hanserifb p-5">最近看过</span>
      </div>
      <div className="stream-container p-5">{imagesColumns}</div>
    </div>
  );
}
