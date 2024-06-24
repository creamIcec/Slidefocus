import { ReactNode } from 'react';

export default function ImageStream() {
  const TEST_CONTAINERS_ITEMS = 10;
  const TEST_CONTAINERS_COLUMNS = 4;

  const imagesColumns = [];
  const imagesPlaceholders: ReactNode[] = [];

  for (let i = 0; i < TEST_CONTAINERS_ITEMS; i++) {
    imagesPlaceholders.push(<div className="w-64 h-96 bg-slate-500"></div>);
  }

  for (let i = 0; i < TEST_CONTAINERS_COLUMNS; i++) {
    imagesColumns.push(<div>{imagesPlaceholders}</div>);
  }

  return (
    <div className="flex flex-nowrap flex-row gap-10 w-48 h-96 absolute top-10 p-10">
      {imagesColumns}
    </div>
  );
}
