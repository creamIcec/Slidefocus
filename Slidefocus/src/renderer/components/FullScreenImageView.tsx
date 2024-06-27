import FullScreenButton from './FullScreenButton';
import LikeButton from './LikeButton';

export default function FullScreenImageView({
  imagePaths,
  imagePath,
  closeImageViewFunction,
}: {
  imagePaths: string[];
  imagePath: string;
  closeImageViewFunction: Function;
}) {
  return (
    <div className="w-full h-full fixed top-0 left-0 bg-yellow-300/40 backdrop-blur-sm">
      <div className="fullscreen-grid-layout pointer-events-auto">
        <div className="flex flex-nowrap gap-2 flex-row-reverse fullscreen-toolbar-grid">
          <FullScreenButton
            icon="link"
            onClickFunction={null}
          ></FullScreenButton>
          <FullScreenButton
            icon="file_copy"
            onClickFunction={null}
          ></FullScreenButton>
          <FullScreenButton
            icon="close"
            onClickFunction={() => closeImageViewFunction()}
          ></FullScreenButton>
        </div>
        <div className="flex flex-nowrap place-content-center place-items-center fullscreen-lastarrow-grid">
          <FullScreenButton
            icon="arrow_circle_left"
            onClickFunction={null}
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
            onClickFunction={null}
          ></FullScreenButton>
        </div>
        <div className="like-button-container">
          <LikeButton></LikeButton>
        </div>
      </div>
    </div>
  );
}
