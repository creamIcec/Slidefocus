import { useEffect, useRef, useState } from 'react';
import { ImagePathsType, ImageRawRecord } from '../App';
import { useWindowSize } from '../hooks/useWindowSize';
import { SortType, sortImageElemets as sortImageElements } from '../utils/sort';
import ExpandPanelTitle from './ExpandPanelTitle';
import LikeButton from './LikeButton';

/*
  1. 读取下一张图片
  2. 由于固定高度，根据图片长宽比计算出对应宽度，进入第3步
  3. 如果宽度小于等于剩余宽度，则放入剩余宽度中并回到第1步，否则进入第4步
  4. 转移到第二行，将上一行的最后一张宽度占满，如果宽度大于第二行行宽，则裁剪到行宽并放入，如果小于则放入；回到第1步
*/

export default function ImageStream({
  images,
  ClickCallback,
  LikedCallback,
  type,
  title,
  sortMethod,
}: {
  images: ImageRawRecord[] | null;
  ClickCallback: Function;
  LikedCallback: Function;
  type: ImagePathsType;
  title: string;
  sortMethod: SortType;
}) {
  let FOLLOW_WINDOW_HEIGHT = 300;
  const MIN_DISPLAY_WIDTH = 300;

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [streamContainer, setStreamContainer] = useState<any[][]>([]);
  const [imageCache, setImageCache] = useState<HTMLImageElement[]>([]);

  const windowSize = useWindowSize(); //监听窗口大小变化的钩子

  const initImages = (shouldbuildPath: boolean) => {
    if (!images) {
      return;
    }
    let initedCount = 0;
    const imageTempContainer: HTMLImageElement[] = [];
    if (shouldbuildPath) {
      if (images.length <= 0) {
        setImageCache(imageTempContainer);
        buildImageStream(imageTempContainer);
      }
      for (let i = 0; i < images?.length; i++) {
        const image = new Image();
        image.onload = function () {
          initedCount++;
          imageTempContainer.push(image);
          if (initedCount == images?.length) {
            setImageCache(imageTempContainer);
            sortImageElements(imageTempContainer, sortMethod);
            buildImageStream(imageTempContainer);
          }
        };
        image.src = images[i].path;
        image.setAttribute('liked', images[i].liked ? 'true' : 'false');
      }
    } else {
      buildImageStream(imageCache);
    }
  };

  useEffect(() => {
    initImages(true);
  }, [sortMethod]);

  useEffect(() => {
    initAllImages();
  }, [windowSize.height]);

  useEffect(() => {
    initImages(true);
  }, [images]);

  useEffect(() => {
    console.log('streamContainer: ' + streamContainer);
  }, [streamContainer]);

  const initAllImages = () => {
    initImages(false);
  };

  const onToggle = async (path: string, liked: boolean, tags: string) => {
    const newLikedImages = await window.connectionAPIs.saveLikedImages(
      path,
      liked,
      tags,
    );
    console.log('新的喜欢:');
    console.log(newLikedImages);
    LikedCallback(newLikedImages);
  };

  const buildImageStream = (imageTempContainer: HTMLImageElement[]) => {
    console.log('container:');
    console.log(imageTempContainer.map((item) => item.getAttribute('liked')));
    const _streamContainer: any[][] = []; //大的容器
    let rowContainer1: any[] | null = null; //前一行的容器
    let rowContainer2: any[] | null = null; //后一行的容器
    let remainingWidth = mainContainer.current?.offsetWidth; //剩余宽度
    let processed = 0;
    let restoreWidth = 0; //保存上一个的宽度， 用于恢复

    if (imageTempContainer.length <= 0) {
      setStreamContainer(_streamContainer);
    }

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
          <div className="relative transition hover:scale-110 hover:shadow-2xl hover:z-[1000]">
            <img
              src={imageTempContainer[i].src}
              style={{ width: displayWidth, height: FOLLOW_WINDOW_HEIGHT }}
              onClick={() => {
                ClickCallback(i);
              }}
            />
            <div className="absolute bottom-0 right-0 p-5">
              <LikeButton
                onToggle={onToggle}
                imagePath={imageTempContainer[i].src}
                liked={
                  imageTempContainer[i].getAttribute('liked') === 'true'
                    ? true
                    : false
                }
              ></LikeButton>
            </div>
          </div>,
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
          <div className="relative transition hover:scale-110 hover:shadow-2xl hover:z-[1000]">
            <img
              src={imageTempContainer[i - 1].src}
              style={{
                width: remainingWidth! + restoreWidth,
                height: FOLLOW_WINDOW_HEIGHT,
                objectFit: 'cover',
              }}
              onClick={() => {
                ClickCallback(i - 1);
              }}
            />
            <div className="absolute bottom-0 right-4 p-5">
              <LikeButton
                onToggle={onToggle}
                imagePath={imageTempContainer[i - 1].src}
                liked={
                  imageTempContainer[i - 1].getAttribute('liked') === 'true'
                    ? true
                    : false
                }
              ></LikeButton>
            </div>
          </div>,
        );
        restoreWidth = 0;
        _streamContainer.push(rowContainer1);
        rowContainer1 = null;

        remainingWidth = mainContainer.current?.clientWidth; //重置容器宽度

        rowContainer2 = [];
        if (displayWidth > remainingWidth!) {
          rowContainer2.push(
            <div className="relative transition hover:scale-110 hover:shadow-2xl hover:z-[1000]">
              <img
                src={imageTempContainer[i].src}
                style={{
                  width: remainingWidth,
                  height: FOLLOW_WINDOW_HEIGHT,
                }}
                onClick={() => {
                  ClickCallback(i);
                }}
              />
              <div className="absolute bottom-0 right-0 p-5">
                <LikeButton
                  onToggle={onToggle}
                  imagePath={imageTempContainer[i].src}
                  liked={
                    imageTempContainer[i].getAttribute('liked') === 'true'
                      ? true
                      : false
                  }
                ></LikeButton>
              </div>
            </div>,
          );
          remainingWidth = 0;
        } else {
          rowContainer2.push(
            <div className="relative transition hover:scale-110 hover:shadow-2xl hover:z-[1000]">
              <img
                src={imageTempContainer[i].src}
                style={{ width: displayWidth, height: FOLLOW_WINDOW_HEIGHT }}
                onClick={() => {
                  ClickCallback(i);
                }}
              />
              <div className="absolute bottom-0 right-0 p-5">
                <LikeButton
                  onToggle={onToggle}
                  imagePath={imageTempContainer[i].src}
                  liked={
                    imageTempContainer[i].getAttribute('liked') == 'true'
                      ? true
                      : false
                  }
                ></LikeButton>
              </div>
            </div>,
          );
          remainingWidth! -= displayWidth;
        }
        rowContainer1 = rowContainer2;
      }
      processed++;
      if (processed == imageTempContainer.length) {
        _streamContainer.push(rowContainer1!);
      }
      setStreamContainer(_streamContainer);
    }
  };

  const buildImageRows = (type: ImagePathsType) => {
    let container;
    container = streamContainer;

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
    setIsVisible(!isVisible);
  };

  const mainContainer = useRef<HTMLDivElement>(null);

  return (
    <div ref={mainContainer}>
      <ExpandPanelTitle
        expandFunction={switchFolder}
        title={title}
      ></ExpandPanelTitle>
      <div className="stream-container p-5">
        {isVisible ? buildImageRows(type) : null}
      </div>
    </div>
  );
}
