import { ImageRawRecord } from '../App';

export type SortType = 'last-modified' | 'path';

const sortImages = (srcArray: ImageRawRecord[], type: SortType) => {
  srcArray.sort((item1, item2) => {
    switch (type) {
      case 'last-modified':
        return new Date(item1.lastModified) > new Date(item2.lastModified)
          ? 1
          : -1;
      case 'path':
        return item1.path.localeCompare(item2.path, 'zh-CN');
    }
  });
};

const sortImageElemets = (srcArray: HTMLImageElement[], type: SortType) => {
  srcArray.sort((item1, item2) => {
    switch (type) {
      case 'last-modified':
        return new Date(item1.getAttribute('last-modified')!) >
          new Date(item2.getAttribute('last-modified')!)
          ? 1
          : -1;
      case 'path':
        return item1.src.localeCompare(item2.src, 'zh-CN');
    }
  });
};

const sortImagePaths = (srcArray: string[]) => {
  srcArray.sort((item1, item2) => {
    return item1.localeCompare(item2);
  });
};

export { sortImages, sortImageElemets, sortImagePaths };
