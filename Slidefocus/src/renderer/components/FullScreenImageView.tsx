import FullScreenButton from './FullScreenButton';
import LikeButton from './LikeButton';

export default function FullScreenImageView({
  imagePath,
  closeImageViewFunction,
  nextImageFunction,
  lastImageFunction,
  copyImagePathFunction,
  copyImageFunction,
}: {
  imagePath: string;
  closeImageViewFunction: Function;
  nextImageFunction: Function;
  lastImageFunction: Function;
  copyImagePathFunction: Function;
  copyImageFunction: Function;
}) {
  return (
    <div className="w-full h-full fixed top-0 left-0 bg-yellow-300/40 backdrop-blur-sm z-[1000]">
      <div className="fullscreen-grid-layout pointer-events-auto">
        <div className="flex flex-nowrap gap-2 flex-row-reverse fullscreen-toolbar-grid">
          <FullScreenButton
            icon="link"
            onClickFunction={copyImagePathFunction}
          ></FullScreenButton>
          <FullScreenButton
            icon="file_copy"
            onClickFunction={copyImageFunction}
          ></FullScreenButton>
          <FullScreenButton
            icon="close"
            onClickFunction={() => closeImageViewFunction()}
          ></FullScreenButton>
        </div>
        <div className="flex flex-nowrap place-content-center place-items-center fullscreen-lastarrow-grid">
          <FullScreenButton
            icon="arrow_circle_left"
            onClickFunction={lastImageFunction}
          ></FullScreenButton>
        </div>
        <div className="fullscreen-image-grid">
          <img
            src={imagePath}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <div className="flex flex-nowrap place-content-center place-items-center fullscreen-nextarrow-grid">
          <FullScreenButton
            icon="arrow_circle_right"
            onClickFunction={nextImageFunction}
          ></FullScreenButton>
        </div>
        <div className="like-button-container">
          <LikeButton></LikeButton>
        </div>
      </div>
    </div>
  );
}
