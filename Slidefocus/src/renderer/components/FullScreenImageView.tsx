import FullScreenButton from './FullScreenButton';
import LikeButton from './LikeButton';

export type Base64 = string;

export default function FullScreenImageView({
  imageData,
  closeImageViewFunction,
}: {
  imageData: Base64 | null;
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
        <div className="fullscreen-image-grid bg-slate-500">
          <img />
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
