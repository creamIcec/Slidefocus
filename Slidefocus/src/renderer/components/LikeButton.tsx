import { useEffect, useState } from 'react';

export default function LikeButton({
  onToggle,
  imagePath,
  liked,
}: {
  onToggle: Function;
  imagePath: string;
  liked: boolean;
}) {
  const [internalLiked, setInternalLiked] = useState<boolean>(liked);

  const onClickVisualFunction = () => {
    setInternalLiked(!internalLiked);
  };

  useEffect(() => {
    setInternalLiked(liked);
  }, [liked]);

  return (
    <button
      onClick={() => {
        onToggle(imagePath, !internalLiked, '');
        onClickVisualFunction();
      }}
      className="rounded-3xl bg-bg_dark/40 dark:bg-bg/40 backdrop-blur-sm w-8 h-8 p-6 flex flex-nowrap place-content-center place-items-center"
    >
      <i
        className={`${
          internalLiked
            ? 'material-icons text-red-400'
            : 'material-symbols-outlined text-black dark:text-white'
        } text-4xl  `}
      >
        favorite
      </i>
    </button>
  );
}
