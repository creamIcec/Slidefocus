import { ImageRawRecord } from '../App';
import { sortImages } from '../utils/sort';

export default function OpenButton({
  openSingleImageCallback,
  setImages,
}: {
  openSingleImageCallback: Function;
  setImages: Function;
}) {
  const handleOpenFile = async () => {
    try {
      const image = await window.connectionAPIs.readLocalImage();
      openSingleImageCallback(image);
    } catch (error) {
      console.error('读取本地图像时出错:', error);
    }
  };

  const handleOpenFolder = async () => {
    try {
      const images: ImageRawRecord[] | null =
        await window.connectionAPIs.readLocalFolder();
      if (images !== null) {
        sortImages(images, 'path');
        setImages(images);
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
