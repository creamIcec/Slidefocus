export default function LikeButton({
  onToggle,
  imagePath,
  liked,
}: {
  onToggle: Function;
  imagePath: string;
  liked: boolean;
}) {
  return (
    <button
      onClick={() => {
        onToggle(imagePath, !liked, '');
      }}
      className="rounded-3xl bg-bg_dark/40 dark:bg-bg/40 backdrop-blur-sm w-8 h-8 p-6 flex flex-nowrap place-content-center place-items-center"
    >
      <i
        className={`${
          liked
            ? 'material-icons text-red-400'
            : 'material-symbols-outlined text-black dark:text-white'
        } text-4xl  `}
      >
        favorite
      </i>
    </button>
  );
}
