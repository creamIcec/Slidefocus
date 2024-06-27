import { ImageRawRecord } from '../App';
import { sortImagePaths, sortImages } from '../utils/sort';

export default function OpenButton({
  openSingleImageCallback,
  setImages,
}: {
  openSingleImageCallback: Function;
  setImages: Function;
}) {
  const handleOpenFile = async () => {
    try {
      const imagePath = await window.connectionAPIs.readLocalImage();
      openSingleImageCallback('app://' + imagePath);
    } catch (error) {
      console.error('读取本地图像时出错:', error);
    }
  };

  const handleOpenFolder = async () => {
    try {
      const images: ImageRawRecord[] | null =
        await window.connectionAPIs.readLocalFolder();
      if (images !== null) {
        const appPrefixedImages = images.map((image) => {
          return {
            path: 'app://' + image.path,
            lastModified: image.lastModified,
            liked: image.liked,
            tags: image.tags,
          } as ImageRawRecord;
        });
        console.log(appPrefixedImages);
        sortImages(appPrefixedImages, 'path');
        setImages(appPrefixedImages);
      } else {
        setImages(null);
      }
    } catch (error) {
      console.error('读取文件夹中本地图像时出错:', error);
      setImages(null);
    }
  };

  return (
    <div className="w-full fixed bottom-4 flex flex-row flex-nowrap place-content-center place-items-center pointer-events-none z-[1002]">
      <div className=" bg-bg/60 dark:bg-bg_dark/60 rounded-3xl backdrop-blur-sm">
        <div className="w-96 h-16 p-4 flex flex-row flex-nowrap gap-2 place-content-evenly">
          <button
            onClick={handleOpenFile}
            className="w-64 h-8 p-1 text-base font-hanserifr dark:text-black text-white bg-bg_dark dark:bg-bg rounded-2xl pointer-events-auto"
          >
            打开文件...
          </button>
          <button
            onClick={handleOpenFolder}
            className="w-64 h-8 p-1 text-base font-hanserifr text-black dark:text-white bg-secondary dark:bg-secondary_dark rounded-2xl pointer-events-auto"
          >
            打开文件夹...
          </button>
        </div>
      </div>
    </div>
  );
}
