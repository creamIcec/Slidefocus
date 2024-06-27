export default function LikeButton() {
  return (
    <button className="rounded-3xl bg-bg_dark/40 dark:bg-bg/40 backdrop-blur-sm w-8 h-8 p-6 flex flex-nowrap place-content-center place-items-center">
      <i className="material-symbols-outlined text-4xl text-black dark:text-white">
        favorite
      </i>
    </button>
  );
}
